import ffmpeg from 'fluent-ffmpeg'
import { basename} from 'node:path'
import { ConvertVideo } from '../types/plugin.type'

export function convertToMP4scale320({inputFile, outputFile}: ConvertVideo) {
    ffmpeg(inputFile)
        .output(outputFile)
        .videoCodec('libx264')
        .audioCodec('aac')
        .audioBitrate('96k')
        .videoFilters('scale=-1:320')
        .outputOptions([
            '-preset slow',
            '-crf 28',
            '-profile:v high',
            '-movflags +faststart'
        ])
        .on('progress', (progress) => console.log(`${basename(outputFile)} | Обработка: ${progress.percent?.toFixed(2)}%`))
        .on('end', () => console.log('Файл MP4 успешно создан'))
        .on('error', (err: Error) => console.log('Ошибка конвертации файла: ', err))
        .run()
}
export function convertToMP4scale480({inputFile, outputFile}: ConvertVideo) {
    ffmpeg(inputFile)
        .output(outputFile)
        .videoCodec('libx264')
        .audioCodec('aac')
        .audioBitrate('96k')
        .videoFilters('scale=-1:480')
        .outputOptions([
            '-preset slow',
            '-crf 26',
            '-profile:v high',
            '-movflags +faststart'
        ])
        .on('progress', (progress) => console.log(`${basename(outputFile)} | Обработка: ${progress.percent?.toFixed(2)}%`))
        .on('end', () => console.log('Файл MP4 успешно создан'))
        .on('error', (err: Error) => console.log('Ошибка конвертации файла: ', err))
        .run()
}
export function convertToMP4scale720({inputFile, outputFile}: ConvertVideo) {
    ffmpeg(inputFile)
        .output(outputFile)
        .videoCodec('libx264')
        .audioCodec('aac')
        .audioBitrate('128k')
        .videoFilters('scale=-1:720')
        .outputOptions([
            '-preset slow',
            '-crf 23',
            '-profile:v high',
            '-movflags +faststart'
        ])
        .on('progress', (progress) => console.log(`${basename(outputFile)} | Обработка: ${progress.percent?.toFixed(2)}%`))
        .on('end', () => console.log('Файл MP4 успешно создан'))
        .on('error', (err: Error) => console.log('Ошибка конвертации файла: ', err))
        .run()
}
export function convertToMP4scale1080({inputFile, outputFile}: ConvertVideo) {
    ffmpeg(inputFile)
        .output(outputFile)
        .videoCodec('libx264')
        .audioCodec('aac')
        .audioBitrate('192k')
        .videoFilters([
            'transpose=1',  
            'scale=-1:1080' 
        ])
        .outputOptions([
            '-preset slow',
            '-crf 20',
            '-profile:v high',
            '-movflags +faststart'
        ])
        .on('progress', (progress) => console.log(`${basename(outputFile)} | Обработка: ${progress.percent?.toFixed(2)}%`))
        .on('end', () => console.log('Файл MP4 успешно создан'))
        .on('error', (err: Error) => console.log('Ошибка конвертации файла: ', err))
        .run()
}
export function convertToWEBMscale320({inputFile, outputFile}: ConvertVideo) {
    ffmpeg(inputFile)
        .output(outputFile)
        .videoCodec('libvpx-vp9')        
        .audioCodec('libopus') 
        .size('?x320')           
        .outputOptions([
            '-crf 26',                
            '-b:v 0',                
            '-threads 4',              
            '-tile-columns 4',         
            '-auto-alt-ref 1',
            '-lag-in-frames 25'          
        ])
        .on('progress', (progress) => console.log(`${basename(outputFile)} | Обработка: ${progress.percent?.toFixed(2)}%`))
        .on('end', () => console.log('Файл WebM успешно создан'))
        .on('error', (err: Error) => console.log('Ошибка конвертации файла: ', err))
        .run()
}
export function convertToWEBMscale480({inputFile, outputFile}: ConvertVideo) {
    ffmpeg(inputFile)
        .output(outputFile)
        .videoCodec('libvpx-vp9')        
        .audioCodec('libopus') 
        .size('?x480')           
        .outputOptions([
            '-crf 24',                
            '-b:v 0',                
            '-threads 4',              
            '-tile-columns 4',         
            '-auto-alt-ref 1',
            '-lag-in-frames 25'          
        ])
        .on('progress', (progress) => console.log(`${basename(outputFile)} | Обработка: ${progress.percent?.toFixed(2)}%`))
        .on('end', () => console.log('Файл WebM успешно создан'))
        .on('error', (err: Error) => console.log('Ошибка конвертации файла: ', err))
        .run()
}
export function convertToMOV({inputFile, outputFile}: ConvertVideo) {
  ffmpeg(inputFile)
    .output(outputFile)
    .outputOptions([
    //   '-c copy',                 // ❌ Копирование без перекодирования
      '-map_metadata -1',        // ❌ Удаляет все метаданные (глобальные и потоковые)
      '-map_chapters -1',        // ❌ Удаляет главы
      '-metadata title=',        // ❌ Убирает название
      '-metadata comment=',      // ❌ Убирает комментарий
      '-metadata author=',       // ❌ Убирает автора
      '-metadata encoder=',      // ❌ Убирает информацию о кодеке/энкодере
      '-metadata creation_time=', // ❌ Убирает дату создания
    //   '-an'                  // убираем аудио
    ])
    .on('progress', (progress) =>
      console.log(`${basename(outputFile)} | Обработка: ${progress.percent?.toFixed(2)}%`)
    )
    .on('end', () => console.log('Файл без метаданных, качество сохранено'))
    .on('error', (err) => console.log('Ошибка: ', err))
    .run();
}