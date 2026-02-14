import fs from 'fs'
import {relative, dirname} from 'path'
import { SVGFolderTranslation } from '../i18n'

export function updateDummySVGPage({watchedFile, dummyFile, id, translation}: {watchedFile: string, dummyFile: string, id: string, translation: SVGFolderTranslation}) {
    try {
        const relativePath = relative(dirname(dummyFile), watchedFile).replace(/\\/g, '/')
        
        if(!fs.existsSync(dummyFile) || fs.statSync(dummyFile).size === 0) {
            const 
                fileContent =
                `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Dummy SVG</title>
                    <link rel="stylesheet" href="../fontIcons.scss">
                    </head>
                    <body>
                        <%- include('externe/components/DummyAside/DummyAside.ejs') %>
                        <h1>Dummy SVG</h1>
                        <ul class="icons">
                        <li class="icon">
                            <svg><use href="${relativePath}#${id}"></use><use href="${relativePath.replace(/\/public/, '')}#${id}"></use></svg>
                            <span>${id}</span>        
                            <div>
                                &lt;svg&gt;
                                <p style='margin-left: 5px'>
                                    &lt;use href="media/icons/sprite.svg#${id}"&gt;&lt;/use&gt;
                                </p>
                                &lt;/svg&gt;
                            </div>
                        </li>
                        </ul>
                        <script type="module" src="/src/ts/main.ts"></script>
                    </body>
                    </html>
                `
            fs.writeFileSync(dummyFile, fileContent, 'utf-8')   
            translation.newFileAdded(dummyFile)
        }
        else {
            const 
                rewriteFile = fs.readFileSync(dummyFile, 'utf-8'),
                isDataExist = rewriteFile.includes(`<svg><use href="${relativePath}#${id}"></use><use href="${relativePath.replace(/\/public/, '')}#${id}"></use></svg>`)

            if(isDataExist) return

            const
                lastIndex = rewriteFile.lastIndexOf('</li>') + 5,
                fileContent = 
                `
                    ${rewriteFile.slice(0, lastIndex)}
                        <li class="icon">
                        <svg><use href="${relativePath}#${id}"></use><use href="${relativePath.replace(/\/public/, '')}#${id}"></use></svg>
                        <span>${id}</span>
                        <div>
                            &lt;svg&gt;
                            <p style='margin-left: 5px'>
                                &lt;use href="media/icons/sprite.svg#${id}"&gt;&lt;/use&gt;
                            </p>
                            &lt;/svg&gt;
                        </div>
                    </li>
                    ${rewriteFile.slice(lastIndex)}
                `.trim()
            
            
            fs.writeFileSync(dummyFile, fileContent, 'utf-8')   
            translation.fileHasBeenUpdated(dummyFile)
        }
    } catch(e) {
        console.log(e)
    }    
}