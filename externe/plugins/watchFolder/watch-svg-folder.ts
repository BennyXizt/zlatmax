import type { Plugin, ViteDevServer } from 'vite'
import { fileURLToPath } from 'url'
import { resolve, dirname, basename, extname } from 'path'
import fs from 'fs'
import type { SVGConvertToFile, SVGFolderInterface} from './types/plugin.interface'
import { SVGFolderTranslation } from './i18n'
import { updateDummySVGPage } from './utils/utils'


export function ViteWatchSVGFolderPlugin({relativePath, nameOfTheOutputFile, language, dummy, convertType}: SVGFolderInterface): Plugin  {
    return {
        name: 'watch-svg-folder-plugin',
        configureServer(server: ViteDevServer) {
            const 
                __filename = fileURLToPath(import.meta.url),
                __dirname = dirname(__filename),
                watchDir = resolve(__dirname, relativePath),
                translation = new SVGFolderTranslation({pluginName: 'watchSVGFolderPlugin', language})

            translation.pluginStart(watchDir, nameOfTheOutputFile)

            server.watcher.add(watchDir);
            server.watcher.on('add', (filePath) => {
                if (dirname(filePath) === watchDir && !basename(filePath)?.includes(nameOfTheOutputFile) && extname(filePath) === '.svg') {
                    translation.newFileAdded(filePath)    
                        
                    setTimeout(() => {
                        try {
                            if(convertType === 0) {
                                convertSVGToFile({ watchDir, filePath, nameOfTheOutputFile, translation, relativePath, dummy})
                            }

                            fs.unlinkSync(filePath)   
                        } catch (err) {
                            translation.errorReadingTheFile((err as Error))
                        }
                    }, 100)
                    
                    server.ws.send({ type: 'full-reload' })
                }
            })
        }
    }
}


function convertSVGToFile({ watchDir, filePath, nameOfTheOutputFile, translation, relativePath, dummy}: SVGConvertToFile) {
    const   
        watchedFile = fs.readFileSync(filePath, 'utf-8'),
        viewbox = watchedFile.match(/viewBox="([^"]+)/)?.[1],
        dArray = watchedFile.match(/d="([Mm][^"]+")/g),
        name = basename(filePath).slice(0, -4).toLowerCase().replace(/\s/g, '-'),
        destFile = `${watchDir}/${nameOfTheOutputFile}`

    if(!fs.existsSync(destFile) || fs.statSync(destFile).size === 0 && dArray) {
        
        let fileContent = 
        `
            <svg xmlns="http://www.w3.org/2000/svg" style="display:none;">
            <defs>
            <symbol id='${name}' viewBox='${viewbox}'>
        `.trim()
                                    

        for(const d of dArray!) {
            fileContent += `\n\t\t<path ${d} fill='currentColor'></path>`
        }

        fileContent += 
        `
            </symbol>
            </defs>
        </svg>
        `

        fs.writeFileSync(destFile, fileContent, 'utf-8')   
        
        translation.iconWasCreated(destFile, name)
        console.log(`<svg><use href="${relativePath}/${nameOfTheOutputFile}#${name}"></svg>`)

        if(dummy) {
            const
                dummyDestination = resolve(__dirname, dummy.destination), 
                dummyFile = `${dummyDestination}/${dummy.fileName}`
            
            updateDummySVGPage({watchedFile: destFile, dummyFile: dummyFile, id: name, translation: translation})
        }
                            
    }
    else if(dArray) {
        const 
            rewriteFile = fs.readFileSync(destFile, 'utf-8'),
            index = rewriteFile.lastIndexOf('</defs>')
            
        if(!rewriteFile.includes(name)) {
            let fileContent = 
            `
            ${rewriteFile.slice(0, index)}
            <symbol id='${name}' viewBox='${viewbox}'>
            `.trim()
                                        

            for(const d of dArray) {
                fileContent += `\n\t\t<path ${d} fill='currentColor'></path>`
            }

            fileContent += `                         
                </symbol>
                </defs>
                </svg>
            `.trim()

            fs.writeFileSync(destFile, fileContent, 'utf-8')    
            translation.iconWasCreated(destFile, name)
            console.log(`<svg><use href="${relativePath}/${nameOfTheOutputFile}#${name}"></svg>`)

            if(dummy) {
                const
                    dummyDestination = resolve(__dirname, dummy.destination), 
                    dummyFile = `${dummyDestination}/${dummy.fileName}`
                
                updateDummySVGPage({watchedFile: destFile, dummyFile: dummyFile, id: name, translation: translation})
            }
        }
        else {
            translation.iconIsExist(name)
        }
    }
}