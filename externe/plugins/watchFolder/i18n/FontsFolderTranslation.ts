import { Translation } from "./Translation"

export class FontsFolderTranslation extends Translation {
    constructor({pluginName, language}: {pluginName: string, language?: Language}) {
        super({pluginName, language})
        this.messages = {
            ru: {
                ...this.messages.ru,
                pluginStart: (watchDir: string, outputDestination: string) =>
                    `Началось слежение за директорией ${watchDir}\n\x1b[33m[${this.pluginName}]:\x1b[0m Итоговые шрифты будут записаны в ${outputDestination}`,
                errorFontWeightNotExists: (name: string) =>
                    `❌ Ошибка font-weight c названием '${name}' не существует`,
                newFontAdded: (destinationFile: string) =>
                    `🆕 Шрифт создан: ${destinationFile}`,
                newFontUpdated: (destinationFile: string) =>
                    `🆕 Шрифт обновлён: ${destinationFile}`
            }
        }
    }
    pluginStart(watchDir: string, outputDestination: string) {
        console.log(`\x1b[33m[${this.pluginName}]:\x1b[0m ${this.messages[this.language]?.pluginStart(watchDir, outputDestination)}`)
    }
    newFontAdded(destinationFile: string) {
        console.log(`\x1b[33m[${this.pluginName}]:\x1b[0m ${this.messages[this.language]?.newFontAdded(destinationFile)}`)
    }
    newFontUpdated(destinationFile: string) {
       console.log(`\x1b[33m[${this.pluginName}]:\x1b[0m ${this.messages[this.language]?.newFontUpdated(destinationFile)}`)
    }
    errorFontWeightNotExists(name: string) {        
        console.error(`\x1b[33m[${this.pluginName}]:\x1b[0m ${this.messages[this.language]?.errorFontWeightNotExists(name)}`)
    }
}