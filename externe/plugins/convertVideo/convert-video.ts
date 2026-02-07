import readline from 'node:readline'
import path, { basename, dirname, extname } from 'node:path'
import fs from 'fs'
import { settings } from '../../../settings'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const 
    convertationTypeQuestion = await new Promise<string>(resolve => rl.question('Выберите тип конвертации(1  - папка(по умолчанию), 2 - файл): ', resolve)),
    convertationType = Number.parseInt(convertationTypeQuestion) || 1,
    questionString = convertationType == 2 ? 'Путь к файлу: ' : 'Путь к папке: ',
    convertVideoFunction = settings.videoConverter.convertVideoFunction

rl.question(questionString, (inputFile) => {
    const 
        videoExtensions = [
            '.mp4', '.mov', '.mkv', '.avi', '.flv', '.webm', '.wmv',
            '.mpeg', '.mpg', '.m4v', '.3gp', '.3g2', '.ts', '.m2ts',
            '.vob', '.ogv', '.rm', '.rmvb', '.asf', '.divx', '.f4v',
            '.f4p', '.nut', '.yuv', '.amv', '.nsv'
        ],
        outputFormat = settings.videoConverter.outputFormat
    
    if(convertationType == 2) {
        const 
            formattedInputFile = inputFile.replace(/^['"]|['"]$/g, '').trim(),
            outputDir = path.join(dirname(formattedInputFile), 'converted'),
            newBaseFileName =  basename(formattedInputFile, extname(formattedInputFile)) + '_compressed' + outputFormat
        
        if (!fs.existsSync(outputDir)) { 
            fs.mkdirSync(outputDir, { recursive: true })
        }

        if (!fs.existsSync(formattedInputFile)) {
            console.error('Файл не найден: ', formattedInputFile)
            return
        }

        const outputFile = `${outputDir}/${newBaseFileName}`

        convertVideoFunction({inputFile: formattedInputFile, outputFile})
    }
    else {
        const
            folderPath = `${inputFile.replace(/^['"]|['"]$/g, '').trim()}/`,
            outputDir = path.join(folderPath, 'converted')

        if (!fs.existsSync(outputDir)) { 
            fs.mkdirSync(outputDir, { recursive: true })
        }

        fs.promises.readdir(folderPath).then(files => {
            for (const file of files) {
                if(!videoExtensions.includes(path.extname(file)))
                    continue

                const formattedInputFile = folderPath + file

                const
                    newBaseFileName =  basename(file, extname(file)) + '_compressed' + outputFormat,
                    outputFile = `${outputDir}/${newBaseFileName}`

                convertVideoFunction({inputFile: formattedInputFile, outputFile}) 
            }
        })
        
    }
    rl.close()
})