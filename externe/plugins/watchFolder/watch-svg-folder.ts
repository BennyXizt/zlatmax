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

            let result = false

            translation.pluginStart(watchDir, nameOfTheOutputFile)

            server.watcher.add(watchDir);
            server.watcher.on('add', (filePath) => {
                if (dirname(filePath) === watchDir && !basename(filePath)?.includes(nameOfTheOutputFile) && extname(filePath) === '.svg') {
                    translation.newFileAdded(filePath)    
                        
                    setTimeout(() => {
                        try {
                            if(convertType === 0) {
                                result = convertSVGToFile({ watchDir, filePath, nameOfTheOutputFile, translation, relativePath, dummy})
                            }

                            if(result)
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

function convertSVGToFile({ watchDir, filePath, nameOfTheOutputFile, translation, relativePath, dummy}: SVGConvertToFile): boolean {
    const   
        watchedFile = fs.readFileSync(filePath, 'utf-8'),
        viewbox = watchedFile.match(/viewBox="([^"]+)/)?.[1],
        name = basename(filePath).slice(0, -4).toLowerCase().replace(/\s/g, '-'),
        destFile = `${watchDir}/${nameOfTheOutputFile}`,
        rewriteFile = fs.existsSync(destFile) && fs.readFileSync(destFile, 'utf-8'), 
        isFileNotExistOrEmpty = !fs.existsSync(destFile) || fs.statSync(destFile).size === 0,

        pathArray = watchedFile.match(/<path (.+)>/g),
        circleArray = watchedFile.match(/<circle (.+)>/g),
        lineArray = watchedFile.match(/<line (.+)>/g),
        rectArray = watchedFile.match(/<rect (.+)>/g),
        ellipseArray = watchedFile.match(/<ellipse (.+)>/g)

    let fileContent = ''
    
    if(isFileNotExistOrEmpty) {
        fileContent = 
            `<svg xmlns="http://www.w3.org/2000/svg" style="display:none;">` +
            `\n\t<defs>` +
            `\n\t\t<symbol id='${name}' viewBox='${viewbox}'>`
    }
    else if(rewriteFile && !rewriteFile.includes(name)) {
        const
            index = rewriteFile.lastIndexOf('</defs>')
            
        fileContent = 
            `${rewriteFile.slice(0, index)}` +
            `\t<symbol id='${name}' viewBox='${viewbox}'>`         
    }
    else {
        translation.iconIsExist(name)
        return false
    }

    if(pathArray) {
        for (const item of pathArray) {
            const 
                d = item.match(/d="([Mm][^"]+")/g),

                transform = item.match(/transform="([^"]+)"/g),
                stroke = /stroke=/.test(item),
                strokeWidth = item.match(/stroke-width="([^"]+)"/g),
                strokeOpacity = item.match(/stroke-opacity="([^"]+)"/g)
            
            fileContent += 
                `\n\t\t\t<path ${d} ${transform ?? ''} ${stroke ? "stroke='currentColor' fill='none'" : "fill='currentColor'"} ${strokeWidth ?? ''} ${strokeOpacity ?? ''} />`
        }
    }
    if(circleArray) {
        for (const item of circleArray) {
            const
                r = item.match(/\br="([^"]+)"/g),
                cx = item.match(/\bcx="([^"]+)"/g),
                cy = item.match(/\bcy="([^"]+)"/g),

                transform = item.match(/transform="([^"]+)"/g),
                stroke = /stroke=/.test(item),
                strokeWidth = item.match(/stroke-width="([^"]+)"/g),
                strokeOpacity = item.match(/stroke-opacity="([^"]+)"/g)

                fileContent += 
                    `\n\t\t\t<circle ${r} ${cx ?? ''} ${cy ?? ''} ${transform ?? ''} ${stroke ? "stroke='currentColor' fill='none'" : "fill='currentColor'"} ${strokeWidth ?? ''} ${strokeOpacity ?? ''} />`
        }
    }
    if(lineArray) {
        for (const item of lineArray) {
            const
                x1 = item.match(/\bx1="([^"]+)"/g),
                y1 = item.match(/\by1="([^"]+)"/g),
                x2 = item.match(/\bx2="([^"]+)"/g),
                y2 = item.match(/\by2="([^"]+)"/g),

                transform = item.match(/transform="([^"]+)"/g),
                stroke = /stroke=/.test(item),
                strokeWidth = item.match(/stroke-width="([^"]+)"/g),
                strokeOpacity = item.match(/stroke-opacity="([^"]+)"/g)

                fileContent += 
                    `\n\t\t\t<line ${x1 ?? ''} ${y1 ?? ''} ${x2 ?? ''} ${y2 ?? ''} ${transform ?? ''} ${stroke ? "stroke='currentColor' fill='none'" : "fill='currentColor'"} ${strokeWidth ?? ''} ${strokeOpacity ?? ''} />`
        }
    }
    if(rectArray) {
        for (const item of rectArray) {
            const
                width = item.match(/width="([^"]+)"/g),
                height = item.match(/height="([^"]+)"/g),
                x = item.match(/\bx="([^"]+)"/g),
                y = item.match(/\by="([^"]+)"/g),
                rx = item.match(/\brx="([^"]+)"/g),
                ry = item.match(/\bry="([^"]+)"/g),

                transform = item.match(/transform="([^"]+)"/g),
                stroke = /stroke=/.test(item),
                strokeWidth = item.match(/stroke-width="([^"]+)"/g),
                strokeOpacity = item.match(/stroke-opacity="([^"]+)"/g)

            fileContent += 
                `\n\t\t\t<rect ${width} ${height} ${x ?? ''} ${y ?? ''} ${rx ?? ''} ${ry ?? ''} ${transform ?? ''} ${stroke ? "stroke='currentColor' fill='none'" : "fill='currentColor'"} ${strokeWidth ?? ''} ${strokeOpacity ?? ''} />`
       
        }
    }
    if(ellipseArray) {
        for (const item of ellipseArray) {
            const
                rx = item.match(/\brx="([^"]+)"/g),
                ry = item.match(/\bry="([^"]+)"/g),
                cx = item.match(/\bcx="([^"]+)"/g),
                cy = item.match(/\bcy="([^"]+)"/g),

                transform = item.match(/transform="([^"]+)"/g),
                stroke = /stroke=/.test(item),
                strokeWidth = item.match(/stroke-width="([^"]+)"/g),
                strokeOpacity = item.match(/stroke-opacity="([^"]+)"/g)

            fileContent += 
                `\n\t\t\t<ellipse ${rx} ${ry} ${cx ?? ''} ${cy ?? ''} ${transform ?? ''} ${stroke ? "stroke='currentColor' fill='none'" : "fill='currentColor'"} ${strokeWidth ?? ''} ${strokeOpacity ?? ''} />`
        }
    }

    fileContent += 
        `\n\t\t</symbol>` + 
        `\n\t</defs>` +
        `\n</svg>`

    fs.writeFileSync(destFile, fileContent, 'utf-8') 
    translation.iconWasCreated(destFile, name)
    console.log(`<svg><use href="${relativePath}/${nameOfTheOutputFile}#${name}"></svg>`)

    if(dummy) {
        const
            dummyDestination = resolve(__dirname, dummy.destination), 
            dummyFile = `${dummyDestination}/${dummy.fileName}`
        
        updateDummySVGPage({watchedFile: destFile, dummyFile: dummyFile, id: name, translation: translation})
    }

    return true
}