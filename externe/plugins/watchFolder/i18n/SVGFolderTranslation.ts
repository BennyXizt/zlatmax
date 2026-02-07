import { Translation } from "./Translation"
import type { Language } from "../types/plugin.type" 

export class SVGFolderTranslation extends Translation {
    constructor({pluginName, language}: { pluginName: string, language?: Language}) {
        super({ pluginName, language })
        this.messages = {
            ru: {
                ...this.messages.ru,
                pluginStart: (watchDir: string, nameOfTheOutputFile: string) =>
                    `Началось слежение за директорией ${watchDir}, итоговые спрайты будут записаны в ${nameOfTheOutputFile}`,
                iconWasCreated: (destFile: string, name: string) =>
                    `🆕 Иконка создана: ${destFile} c id="${name}"`,
                iconIsExist: (name: string) =>
                    `📄 SVG c именем ${name} уже существует`
            }
        }
    }
    pluginStart(watchDir: string, nameOfTheOutputFile: string) {
        console.log(`\x1b[34m[${this.pluginName}]:\x1b[0m ${this.messages[this.language]?.pluginStart(watchDir, nameOfTheOutputFile)}`)
    }
    iconWasCreated(destFile: string, name: string) {      
        console.log(`\x1b[34m[${this.pluginName}]:\x1b[0m ${this.messages[this.language]?.iconWasCreated(destFile, name)}`)
    }
    iconIsExist(name: string) {
        console.log(`\x1b[34m[${this.pluginName}]:\x1b[0m ${this.messages[this.language]?.iconIsExist(name)}`)
    }

}