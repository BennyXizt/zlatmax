import readline from 'node:readline';
import fs from 'fs'
import { readdir } from 'fs/promises'
import { resolve } from 'path';
import { createEJSFile, createSCSSFile, updateMainEJSFile, updateMainSCSS, updateTestEJSFile } from './utils/utils';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const 
  files = await readdir(process.cwd()),
  pages = files
    .filter(e => /^.+\.html$/.test(e))
    .map(e => `${e.slice(0, -5)}.ejs`)

let 
  questionChoosePage = 'Выберите файл для записи('

  pages.forEach((e, i) => {
    if(i === 0)
      questionChoosePage += `${i} - ${e}(по умолчанию), `
    else if(i !== pages.length - 1) 
      questionChoosePage += `${i} - ${e}, `
    else
      questionChoosePage += `${i} - ${e}): `
  })

const
  indexChoosePage = await new Promise<string>(resolve => rl.question(questionChoosePage, resolve)),
  page = pages[Number.parseInt(indexChoosePage) || 0]


if(!page)
{
  console.log(`Ошибка: Такого элемента не существует!`)
  rl.close()
}

rl.question('Придумайте название секции: ', (componentName) => {
  const 
    ejsDir = resolve(process.cwd(), "src/ejs"),
    scssDir = resolve(process.cwd(), "src/assets/styles"),
    blockType = 'layout'
   
    if(fs.existsSync(`${ejsDir}/${blockType}/${componentName}`)) 
    {
        console.log(`Ошибка: Секция ${componentName} уже существует!`)
        
        rl.close()
        return
    }

    createSCSSFile({scssDir, blockType, componentName, fs})
    createEJSFile({ejsDir, blockType, componentName, fs})
    updateMainSCSS({scssDir, blockType, componentName, fs})
    updateMainEJSFile({ejsDir, componentName, rootPage: page, fs})
    
    console.log(`Секция ${componentName} создана!`)
    rl.close()
});