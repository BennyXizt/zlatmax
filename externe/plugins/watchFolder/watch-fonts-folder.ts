import type { Plugin, ViteDevServer } from 'vite'
import { fileURLToPath } from 'url'
import { resolve, dirname, basename, extname } from 'path'
import fs from 'fs'
import type { FontsFolderInterface} from './types/plugin.interface'
import { FontsFolderTranslation } from './i18n'

export function ViteWatchFontsFolderPlugin({relativePath, outputDestination, language}: FontsFolderInterface): Plugin {
    return {
        name: 'watch-fonts-folder-plugin',
        configureServer(server: ViteDevServer) {
            const 
                __filename = fileURLToPath(import.meta.url),
                __dirname = dirname(__filename),
                watchDir = resolve(__dirname, relativePath),
                destinationFile = resolve(__dirname, outputDestination),
                translation = new FontsFolderTranslation({pluginName: 'watchFontsFolderPlugin', language})

           const fonts = {
                'thin': {
                    weight: 100,
                    style: 'normal'
                },
                'thinitalic': {
                    weight: 100,
                    style: 'italic'
                },
                'extralight': {
                    weight: 200,
                    style: 'normal'
                },
                'extralightitalic': {
                    weight: 200,
                    style: 'italic'
                },
                'light': {
                    weight: 300,
                    style: 'normal'
                },
                'lightitalic': {
                    weight: 300,
                    style: 'italic'
                },
                'normal': {
                    weight: 400,
                    style: 'normal'
                },
                'normalitalic': {
                    weight: 400,
                    style: 'italic'
                },
                'regular': {
                    weight: 400,
                    style: 'normal'
                },
                'regularitalic': {
                    weight: 400,
                    style: 'italic'
                },
                'medium': {
                    weight: 500,
                    style: 'normal'
                },
                'mediumitalic': {
                    weight: 500,
                    style: 'italic'
                },
                'semibold': {
                    weight: 600,
                    style: 'normal'
                },
                'semibolditalic': {
                    weight: 600,
                    style: 'italic'
                },
                'bold': {
                    weight: 700,
                    style: 'normal'
                },
                'bolditalic': {
                    weight: 700,
                    style: 'italic'
                },
                'extrabold': {
                    weight: 800,
                    style: 'normal'
                },
                'extrabolditalic': {
                    weight: 800,
                    style: 'italic'
                },
                'black': {
                    weight: 900,
                    style: 'normal'
                },
                'blackitalic': {
                    weight: 900,
                    style: 'italic'
                }
            }


            translation.pluginStart(watchDir, destinationFile)

            server.watcher.add(watchDir);
            server.watcher.on('add', (filePath) => {
                if (dirname(filePath) === watchDir) {
                    translation.newFileAdded(filePath)
                    
                    setTimeout(() => {
                        try {
                            const   
                                fileArray = basename(filePath).match(/^([^-]+)-([^.]+)\.(.+)$/)?.slice(1),
                                baseName = fileArray?.[0],
                                finalFonts = fileArray ? fonts[fileArray[1].toLowerCase() as keyof typeof fonts] : undefined,                                
                                fontSrc = `${relativePath}/${basename(filePath)}`,
                                format = fileArray?.[2] === 'ttf' ? 'truetype' : fileArray?.[2]
                            

                            if(!baseName || !finalFonts || !format || !fontSrc) {
                                if(fileArray)
                                    translation.errorFontWeightNotExists(fileArray[1])

                                return
                            }
                               
                            
                            if(!fs.existsSync(destinationFile)) {
                                 const fileContent = 
                                 `
                                    @font-face {
                                        font-family: '${baseName}';
                                        src: url('${fontSrc}') format('${format}');
                                        font-weight: ${finalFonts.weight};
                                        font-display: swap;
                                        font-style: ${finalFonts.style};
                                    }
                                 `.trim()

                                 fs.writeFileSync(destinationFile, fileContent, 'utf-8')   

                                translation.newFileAdded(filePath)
                                console.log(`font-family: ${baseName}; font-weight: ${finalFonts.weight}; font-style: ${finalFonts.style}`)
                            }
                            else {
                                const rewriteFile = fs.readFileSync(destinationFile, 'utf-8')

                                let 
                                    formattedString = rewriteFile.split('@font-face'),
                                    isCreateNewFontFamily = true,
                                    isNeedToFileUpdate = true
                                
                                  formattedString = formattedString
                                  .filter((e): e is string => typeof e === 'string')
                                  .map(element => {
                                    if(element === '')
                                        return element
                                        
                                    if(
                                        element.includes(baseName!) &&
                                        element.includes(finalFonts.weight!.toString()) &&
                                        element.includes(finalFonts.style!.toString()) &&
                                        new RegExp(`\\b${format}\\b`).test(element) 
                                    ) {
                                        isNeedToFileUpdate = false                                        
                                        return element
                                    }
                                    else if(
                                        element.includes(baseName!) &&
                                        element.includes(finalFonts.weight!.toString()) &&
                                        element.includes(finalFonts.style!.toString()) &&
                                        !new RegExp(`\\b${format}\\b`).test(element)
                                    ) {
                                        isCreateNewFontFamily = false
                                        const url = element.match(/src:([^;]+)/)?.[1]
                                    
                                        if(!url)
                                            return element

                                        const 
                                            startIndex = element.indexOf(url),
                                            endIndex = startIndex + url.length + 2                                              

                                        return (
                                            `
                                                ${element.slice(0, startIndex)}
                                                ${url},
                                                url('${fontSrc}') format('${format}');
                                                ${element.slice(endIndex)}

                                            `
                                        )

                                    }
                                    return element
                                  })

                                  if(!isNeedToFileUpdate)
                                    return

                                  if(isCreateNewFontFamily) {
                                    const fileContent = 
                                        `
                                            ${rewriteFile}
                                            @font-face {
                                                font-family: "${baseName}";
                                                src: url('${fontSrc}') format("${format}");
                                                font-weight: ${finalFonts.weight};
                                                font-display: swap;
                                                font-style: ${finalFonts.style};
                                            }
                                        `.trim()
                                    

                                    fs.writeFileSync(destinationFile, fileContent, 'utf-8')   

                                    translation.newFontUpdated(destinationFile)
                                    console.log(`font-family: ${baseName}; font-weight: ${finalFonts.weight}; font-style: ${finalFonts.style}`)
                                  }    
                                  else {
                                    fs.writeFileSync(destinationFile, formattedString.join("@font-face"), 'utf-8')   

                                    translation.newFontUpdated(destinationFile)
                                    console.log(`font-family: ${baseName}; font-weight: ${finalFonts.weight}; font-style: ${finalFonts.style}`)
                                  }     
                                
                            }
                            
                        } catch(err) {
                            translation.errorReadingTheFile((err as Error))
                        }
                    }, 100)

                    server.ws.send({ type: 'full-reload' })
                }            
            })
        }
    }
}