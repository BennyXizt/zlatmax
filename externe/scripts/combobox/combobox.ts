/**
 * combobox.ts
 * Компонент динамического встраивания в target.
 *
 * Поддерживаемые атрибуты `data-fsc-combobox-*`:
 * 
 * Вешать на главный элемент
 * - data-fsc-combobox-id — уникальный идентификатор элемента
 * - data-fsc-combobox-collapsed — состояние открытия
 * - data-fsc-combobox-prestyled — включение дефолтных стилей
 * - data-fsc-combobox-prestyledtype — полные либо базовые дефолтные стили
 * 
 * Вешать не на всплывающий список
 * - data-fsc-combobox (input, svg)
 * - data-fsc-combobox-input-icon-dispose (svg)
 * - data-fsc-combobox-input-icon-close (svg)
 *  
 * Вешать на список
 * - data-fsc-combobox-item (ul -> li, ul -> li -> svg)
 * - data-fsc-combobox-p-icon (svg)
 */


import type { ComboBoxSettings } from './types/plugin.interface'
import { SearchType } from './types/plugin.enum'

let 
    originalList: Element[] = [],
    isAutoCorrectExists = false

export const comboboxClickArray = [comboboxClick, '[data-fsc-combobox-id]']

function comboboxClick(_: HTMLElement, event: Event) {
    const 
        target = event.target as HTMLElement,
        liHTMLElement = target.closest('li[data-fsc-combobox-item]'),
        inputHTMLElement = target.closest('[data-fsc-combobox]'),
        closeIconHTMLElement = target.closest('[data-fsc-combobox-input-icon-close]'),
        windowScreenHTMLElement = document.createElement('div'),
        combo_box = inputHTMLElement?.closest('[data-fsc-combobox-id]')
    
    if(inputHTMLElement && combo_box?.getAttribute('data-fsc-combobox-collapsed') === 'false') {
        const   
            ul = combo_box?.querySelector('ul'),
            list = ul?.querySelectorAll('p'),
            convertedList = list ? Array.from(list) : []
            
        const finalParameters = {
            ul,
            list: Array.from(list!),
            searchType: SearchType.default,
            searchTerm: (inputHTMLElement as HTMLInputElement).value?.trim()?.toLowerCase()
        }

        if(originalList.length == 0)
            originalList.push(...convertedList)

        if(inputHTMLElement.hasAttribute('data-fsc-combobox-result'))
            actionFilterList(finalParameters)

        if(combo_box) 
        {
            windowScreenHTMLElement.setAttribute('data-fsc-combobox-blank', '')
            document.querySelector('body')?.append(windowScreenHTMLElement);
            (combo_box as HTMLElement).dataset['fscComboboxCollapsed'] = 'true'

            windowScreenHTMLElement.addEventListener('click', actionCloseComboBoxOnClick)

        }
    }

    if(liHTMLElement) {
        const 
            combo_box = target.closest('[data-fsc-combobox-id]'),
            input = combo_box?.querySelector('input'),
            close = combo_box?.querySelector('svg[data-fsc-combobox-input-icon-close]')
        
        if(close) {
            close.setAttribute('data-fsc-combobox-collapsed', '')
        }
        
        if(input) {
            input.value = liHTMLElement.textContent!.trim()
            input.setAttribute('data-fsc-combobox-result', '')
            actionCloseComboBoxOnClick()
        }
    }
    
    if(closeIconHTMLElement) {
        const 
            combo_box = target.closest('[data-fsc-combobox-id]'),
            input = combo_box?.querySelector('input'),
            ul = combo_box?.querySelector('ul'),
            list = ul?.querySelectorAll('p'),
            convertedList = list ? Array.from(list) : []
            
        if(input) {
            if(input.value !== '') {
                input.value = ''
                target.removeAttribute('data-fsc-combobox-collapsed')

                const finalParameters = {
                    ul,
                    list: Array.from(list!),
                    searchType: SearchType.default,
                    searchTerm: ''
                }
                
                actionFilterList(finalParameters)
            }
            else actionCloseComboBoxOnClick()
        }
       
    }

    function actionCloseComboBoxOnClick() {
        document.querySelectorAll("[data-fsc-combobox-collapsed='true']").forEach((combo_box) => {
            (combo_box as HTMLElement).dataset['fscComboboxCollapsed'] = 'false'
        }) 
        
        windowScreenHTMLElement.removeEventListener('click', actionCloseComboBoxOnClick)
        document.querySelector('[data-fsc-combobox-blank]')!.remove()
    }

    comboboxKeyUp()
}

function comboboxKeyUp() {
    if(isAutoCorrectExists) return
        isAutoCorrectExists = true

    const input = document.querySelector("[data-fsc-combobox-collapsed='true'] input")
    
    if(input) {
        input?.removeEventListener("keyup", autoCorrect)
        input?.addEventListener("keyup", autoCorrect)
    }
    
    function autoCorrect(this: HTMLInputElement) {        
        const combo_box = this.closest("article[data-fsc-combobox-id]"),
              ul = combo_box?.querySelector('ul'),
              searchTerm = this.value?.trim()?.toLowerCase(),
              list = [...originalList]
            
        const finalParameters = {
            list, searchTerm, ul,
            searchType: SearchType.default
        }

        actionFilterList(finalParameters)        
    }
}

function actionFilterList( { list, searchTerm, ul, searchType } : {
    list: Element[],
    searchTerm: string | null,
    ul: HTMLUListElement | null | undefined,
    searchType: SearchType 
}) {    
 const convertedList = list ? Array.from(list) : []    

 const 
    combo_box = ul?.closest("[data-fsc-combobox-id]"),
    imgClose = combo_box?.querySelector("img[data-fsc-combobox-input-icon-close]")
 
 if(convertedList.length > 0 && searchTerm && ul) {    

    (imgClose as HTMLElement)?.setAttribute('data-fsc-combobox-collapsed', '')

    const filteredList =
        convertedList
        .filter(e => {            
            if(searchType == SearchType.firstLetter) 
                return e.textContent?.trim()?.toLowerCase()?.startsWith(searchTerm)
            else if(searchType == SearchType.default) 
                return e.textContent?.trim()?.toLowerCase()?.includes(searchTerm)
        })
        .map(e => {
            const 
                value = e.textContent

            let span: string | undefined = ''

            if(searchType == SearchType.firstLetter) 
                span = value?.replace(new RegExp(searchTerm, "i"), match => {
                    return `<span data-fsc-combobox-highlited>${match}</span>`
                })
            else if(searchType == SearchType.default) 
                span = value?.replace(new RegExp(searchTerm, "ig"), match => {
                    return `<span data-fsc-combobox-highlited>${match}</span>`
                })
            
            return {
                span,
                image: e.querySelector('svg')
            }
            
        })
        
        ul.innerHTML = ''
        filteredList.forEach(e => {
            ul.insertAdjacentHTML('beforeend',
                `<li data-fsc-combobox-item>
                    <p>
                        ${e.span}
                        ${e.image?.outerHTML}
                    </p>
                </li>`
            )
            
        })     
 }
 else if(searchTerm == '' && ul) {
    imgClose?.removeAttribute('data-fsc-combobox-collapsed')
    
    ul.innerHTML = ''
    originalList.forEach(e => {     
        ul.insertAdjacentHTML('beforeend',
            `<li data-fsc-combobox-item>
                ${e.outerHTML}
            </li>`
        )                
    })    
    
    if(combo_box) 
        (combo_box as HTMLElement).dataset['fscComboboxCollapsed'] = 'true'
    
 }
}