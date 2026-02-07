import readline from 'node:readline'
import fs from 'fs'
import { resolve } from 'path'
import { createEJSFile, createSCSSFile, updateMainSCSS, updateTestEJSFile } from './utils/utils'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('Придумайте название компонента: ', (componentName: string) => {
  const 
    ejsDir = resolve(process.cwd(), "src/ejs"),
    scssDir = resolve(process.cwd(), "src/assets/styles"),
    blockType = 'components'
   
    if(fs.existsSync(`${ejsDir}/components/${componentName}`)) 
    {
        console.log(`Ошибка: Компонент ${componentName} уже существует!`);
        
        rl.close()
        return
    }

    createEJSFile({ejsDir, blockType, componentName, fs})
    createSCSSFile({scssDir, blockType, componentName, fs})
    updateMainSCSS({scssDir, blockType, componentName, fs})
    updateTestEJSFile({ejsDir, componentName, fs})
    
    console.log(`Компонент ${componentName} создан!`)
    rl.close()
})