import { FFmpegProgressInterface } from "../types/plugin.interface"
import { Translation } from "./Translation"
import type { Language } from "../types/plugin.type" 

export class VideoFolderTranslation extends Translation {
    constructor({pluginName, language}: {pluginName: string, language?: Language}) {
        super({pluginName, language})
        this.messages = {
            ru: {
                ...this.messages.ru,
                errorConvertingFile: (err: Error, format: string) =>
                    `❌ Ошибка при конвертации в ${format}\n\x1b[35m[${this.pluginName}]:\x1b[0m ${err}`,
                percentConvertingFile: (progress: FFmpegProgressInterface, fileName: string) =>
                    `⏳ [${fileName}] Обработка: ${progress.percent ? progress.percent.toFixed(2) : '0'}%`,
                videoConvertingStart: (outputFile: string, destinationVideoDirectory: string) =>
                    `Началась конвертация видео ${outputFile}\n\x1b[35m[${this.pluginName}]:\x1b[0m Итоговый файл будет записан в ${destinationVideoDirectory}`,
                pluginConvertedVideoStart: (watchDir: string, destinationVideoDirectory: string) =>
                    `Началось слежение за директорией ${watchDir}\n\x1b[35m[${this.pluginName}]:\x1b[0m Итоговые видео будут записаны в директорию ${destinationVideoDirectory}`,
                pluginCreateVideoPosterStart: (watchDir: string, posterDirectory: string) =>
                    `Началось слежение за директорией ${watchDir}\n\x1b[35m[${this.pluginName}]:\x1b[0m Итоговый постер будет записан в директорию ${posterDirectory}`
            }
        }
    }

    pluginConvertedVideoStart(watchDir: string, destinationVideoDirectory: string) {
        console.log(`\x1b[35m[${this.pluginName}]:\x1b[0m ${this.messages[this.language]?.pluginConvertedVideoStart(watchDir, destinationVideoDirectory)}`)
    }
    pluginCreateVideoPosterStart(watchDir: string, posterDirectory: string) {
        console.log(`\x1b[35m[${this.pluginName}]:\x1b[0m ${this.messages[this.language]?.pluginCreateVideoPosterStart(watchDir, posterDirectory)}`)
    }
    videoConvertingStart(outputFile: string, destinationVideoDirectory: string) {
        console.log(`\x1b[35m[${this.pluginName}]:\x1b[0m ${this.messages[this.language]?.videoConvertingStart(outputFile, destinationVideoDirectory)}`)
    }
    errorConvertingFile(err: Error, format: string) {        
        console.error(`\x1b[35m[${this.pluginName}]:\x1b[0m ${this.messages[this.language]?.errorConvertingFile(err, format)}`)
    }
    percentConvertingFile(progress: FFmpegProgressInterface, fileName: string) {        
        console.log(`\x1b[35m[${this.pluginName}]:\x1b[0m ${this.messages[this.language]?.percentConvertingFile(progress, fileName)}`)
    }
}