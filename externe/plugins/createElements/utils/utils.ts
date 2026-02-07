

export function updateMainSCSS({scssDir, blockType, componentName, fs}: {
    scssDir: string,
    blockType: string,
    componentName: string,
    fs: typeof import('fs')
}) {
    let fileContent: string

    const 
        data = fs.readFileSync(`${scssDir}/main.scss`, 'utf-8'),
        outputFile = `${scssDir}/main.scss`,
        startIndex = data.lastIndexOf(`// internal ${blockType} START`),
        lastIndex = data.lastIndexOf(`// internal ${blockType} END`),
        slicedText = data.slice(startIndex + `// internal ${blockType} START`.length, lastIndex).trim()
        
    if(slicedText.length == 0) {
            fileContent = 
            `
            ${data.slice(0, startIndex + `// internal ${blockType} START`.length).trim()}\n@import\n\t'./${blockType}/${componentName}';\n${data.slice(lastIndex).trim()}
            `.trim()   
    }
    else {
            fileContent = 
            `
            ${data.slice(0, startIndex + `// internal ${blockType} START`.length).trim()}\n${slicedText.slice(0, -1)},\n\t'./${blockType}/${componentName}';\n${data.slice(lastIndex).trim()}
            `.trim()   
    }
    fs.writeFileSync(outputFile, fileContent, 'utf-8')  
}

export function createEJSFile({ejsDir, blockType, componentName, fs}: {
    ejsDir: string,
    blockType: string,
    componentName: string,
    fs: typeof import('fs')
}) {
    let 
        ejsFileContent: string,
        formattedComponentName = componentName
    const ejsFile = `${ejsDir}/${blockType}/${componentName}.ejs`

    if(componentName.includes('-')) {
        formattedComponentName = formattedComponentName
            .split('-')
            .map((e, i) => i > 0 ? e.charAt(0).toUpperCase() + e.slice(1) : e)
            .join('')
    }

    switch(blockType) {
        case 'components': {
            ejsFileContent = 
            `<%\n` +
            `// Пример вызова в шаблоне (EJS):\n` +
            `//\n` +
            `// <\\%- include('src/ejs/components/${componentName}.ejs', { \n` +
            `//\t${componentName}_component: {\n` +
            `//\t\tthis: {\n` +
            `//\t\t\tparent: 'parentClass',\n` +
            `//\t\t\tblock: 'childBlockClass',\n` +
            `//\t\t\tclass: ['childClass'],\n` +
            `//\t\t\tid: ['childID'],\n` +
            `//\t\t\ttag: 'div',\n` +
            `//\t\t\tstyle: ['customStyle'],\n` +
            `//\t\t\tdataAttribute: ['customDataAttributes'], \n` +
            `//\t\t}\n` +
            `//\t}\n` +
            `//\t}) %>\n` +
            `%>\n` +

            `<%\n` +
            `\tif(typeof ${componentName}_component === 'undefined' || !${componentName}_component) {\n` +
            `\t\treturn\n` +
            `\t}\n\n` +
            `\tvar {blockClass, thisClass, thisID, thisTag, thisStyles, thisDataAttributes} = externe.setupEJSComponent({...${componentName}_component, componentName: '${componentName}'})\n` +
            `%>\n\n` +

            `<<%=thisTag%> <%-thisDataAttributes%> class='<%=thisClass%>' <%-thisID%> <%-thisStyles%>>\n\n` +
            `</<%=thisTag%>>`
            break
        }
        case 'layout': {
            ejsFileContent = 
                `<%\n` + 
                `\tblockClass = '${componentName}'` + 
                `\n%>` +
                `\n\n<section class='layout__<%=blockClass%> <%=blockClass%>'>` +
                `\n\t<div class='<%=blockClass%>__container container'>` +
                `\n\n\t</div>\n</section>` 
            break
        }
        default:
            throw new Error(`Unknown blockType: ${blockType}`)
    }

    fs.mkdirSync(`${ejsDir}/${blockType}`, { recursive: true })
    fs.writeFileSync(ejsFile, ejsFileContent, 'utf-8')
}

export function createSCSSFile({scssDir, blockType, componentName, fs}: {
    scssDir: string,
    blockType: string,
    componentName: string,
    fs: typeof import('fs')
}) {
    const
        scssFile = `${scssDir}/${blockType}/_${componentName}.scss`,
        scssFileContent = 
        `
            @use 'sass:map';\n\n.${componentName} {\n\n}
        `.trim()

    fs.writeFileSync(scssFile, scssFileContent, 'utf-8')  
}

export function updateTestEJSFile({ejsDir, componentName, fs}: {
    ejsDir: string,
    componentName: string,
    fs: typeof import('fs')
}) {
    const
        data = fs.readFileSync(`${ejsDir}/views/test.ejs`, 'utf-8'),
        ejsFile = `${ejsDir}/views/test.ejs`,
        lastIndex = data.lastIndexOf('</section>')

    let formattedComponentName = componentName


    if(componentName.includes('-')) {
        formattedComponentName = formattedComponentName
            .split('-')
            .map((e, i) => i > 0 ? e.charAt(0).toUpperCase() + e.slice(1) : e)
            .join('')
    }

    const fileContent = 
        data.slice(0, lastIndex + '</section>'.length).trim() + '\n\t' +
        `
        <section class='${componentName}_component'>
        <div class="outer container">
            <div class="inner">
                <h6 class="text-center">${componentName.toUpperCase()} Component</h6>
                <div class="flex items-center gap-x-2">
                    <%- include('src/ejs/components/${componentName}.ejs', {
                        ${formattedComponentName}_component: {
                            
                        }
                    })%>
                </div>
            </div>
        </div>\n\t</section>
        `.trim() + '\n\t' +
        data.slice(lastIndex + '</section>'.length).trim()

    fs.writeFileSync(ejsFile, fileContent, 'utf-8')  
}

export function updateMainEJSFile({ejsDir, componentName, rootPage, fs}: {
    ejsDir: string,
    componentName: string,
    rootPage: string,
    fs: typeof import('fs')
}) {
    const
        data = fs.readFileSync(`${ejsDir}/views/${rootPage}`, 'utf-8'),
        ejsFile = `${ejsDir}/views/${rootPage}`,
        lastIndex = data.lastIndexOf('</main>'),
        fileContent = 
            data.slice(0, lastIndex).trim() + '\n\t' +
            `\t\t<%- include('src/ejs/layout/${componentName}.ejs')%>\n\t\t` +
            data.slice(lastIndex).trim()
            
        fs.writeFileSync(ejsFile, fileContent, 'utf-8')  
}