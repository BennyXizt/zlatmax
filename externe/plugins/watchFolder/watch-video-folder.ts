import type { Plugin, ViteDevServer } from 'vite'
import { fileURLToPath } from 'url'
import { resolve, dirname, basename, extname } from 'path'
import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'
import type { VideoFolderInterface, FFmpegProgressInterface } from './types/plugin.interface'
import { VideoFolderTranslation } from './i18n'

export function ViteWatchVideoFolderPlugin({relativePath, outputVideoDirectory, posterDirectory, language, outputVideoFormat}: VideoFolderInterface): Plugin {
    return {
        name: 'watch-video-folder-plugin',
        configureServer(server: ViteDevServer) {
            const 
                __filename = fileURLToPath(import.meta.url),
                __dirname = dirname(__filename),
                watchDir = resolve(__dirname, relativePath),
                destinationVideoDirectory = outputVideoDirectory ? resolve(__dirname, outputVideoDirectory) : undefined,
                destinationPosterDirectory = posterDirectory ? resolve(__dirname, posterDirectory) : undefined,
                translation = new VideoFolderTranslation({pluginName: 'watchVideoFolderPlugin', language}),
                videoExtensions = [
                    '.mp4', '.mov', '.mkv', '.avi', '.flv', '.webm', '.wmv',
                    '.mpeg', '.mpg', '.m4v', '.3gp', '.3g2', '.ts', '.m2ts',
                    '.vob', '.ogv', '.rm', '.rmvb', '.asf', '.divx', '.f4v',
                    '.f4p', '.nut', '.yuv', '.amv', '.nsv'
                ]

            
            let finalOutputVideoFormat: string[] = []

            if(destinationVideoDirectory) {
                translation.pluginConvertedVideoStart(watchDir, destinationVideoDirectory!)
                finalOutputVideoFormat = outputVideoFormat && outputVideoFormat.length > 0 ? outputVideoFormat : ['.mp4', '.webm']
            }

            if(destinationPosterDirectory) 
                translation.pluginCreateVideoPosterStart(watchDir, destinationPosterDirectory!)
            

            server.watcher.add(watchDir);
            server.watcher.on('add', (inputFile) => {
                
                if (watchDir !== dirname(inputFile) || !videoExtensions.includes(extname(inputFile).toLowerCase())) 
                    return

                translation.newFileAdded(inputFile) 

                setTimeout(() => {
                    try {          
                        if(destinationVideoDirectory) {
                            if(!fs.existsSync(destinationVideoDirectory))
                                fs.mkdirSync(destinationVideoDirectory)

                            for(const outputFormat of finalOutputVideoFormat) {
                                const
                                    newBaseFileName =  basename(inputFile, extname(inputFile)) + outputFormat,
                                    outputFile = `${destinationVideoDirectory}/${newBaseFileName}`
                                

                                translation.videoConvertingStart(outputFile, destinationVideoDirectory)
                                
                                if(outputFormat === '.mp4') {
                                    ffmpeg(inputFile)
                                        .output(outputFile)
                                        .videoCodec('libx264')
                                        .audioCodec('aac')
                                        .audioBitrate('128k')
                                        .outputOptions([
                                            '-preset slow',
                                            '-crf 20',
                                            '-profile:v high',
                                            '-movflags +faststart'
                                        ])
                                        .on('progress', (progress: FFmpegProgressInterface) => translation.percentConvertingFile(progress, newBaseFileName))
                                        .on('end', () => translation.newFileAdded(outputFile))
                                        .on('error', (err: Error) => {
                                            translation.errorConvertingFile(err, outputFormat)
                                        })
                                        .run()
                                }
                                else if(outputFormat === '.webm') {
                                    ffmpeg(inputFile)
                                        .output(outputFile)
                                        .videoCodec('libvpx-vp9')
                                        .audioCodec('libopus')
                                        .outputOptions([
                                            '-crf 30',          
                                            '-b:v 0',          
                                            '-threads 4',      
                                            '-speed 1',         
                                            '-tile-columns 4',  
                                            '-frame-parallel 1',
                                            '-g 240', 
                                            '-auto-alt-ref 1'         
                                        ])
                                        .on('progress', (progress: FFmpegProgressInterface) => translation.percentConvertingFile(progress, newBaseFileName))
                                        .on('end', () => translation.newFileAdded(outputFile))
                                        .run()
                                }
                            } 
                        }     

                        if(destinationPosterDirectory) {
                            if(!fs.existsSync(destinationPosterDirectory))
                                fs.mkdirSync(destinationPosterDirectory)

                            const sizes = ['320x180', '640x360', '1280x720']
                               

                            for(const size of sizes) {
                                const 
                                    newBaseFileName =  `${basename(inputFile, extname(inputFile))}_${size}.jpg`,
                                    outputFile = `${destinationPosterDirectory}/${newBaseFileName}`

                                ffmpeg(inputFile)
                                    .screenshots({
                                        timestamps: ['00:00:01'],  
                                        filename: newBaseFileName,
                                        folder: destinationPosterDirectory,
                                        size: size 
                                    })
                                    .on('progress', (progress: FFmpegProgressInterface) => translation.percentConvertingFile(progress, newBaseFileName))
                                    .on('end', () => translation.newFileAdded(outputFile))
                            }

                            
                        }
                        
                    } catch(err) {
                        translation.errorReadingTheFile((err as Error))
                    }
                }, 100)
                server.ws.send({ type: 'full-reload' })
            })
        }
    }
}