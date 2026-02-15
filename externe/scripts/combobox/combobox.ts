/**
 * combobox.ts
 * Компонент динамического встраивания в target.
 *
 * Поддерживаемые атрибуты `data-fsc-combobox-*`:
 * 
 * Вешать на главный элемент
 * - data-fsc-combobox-id — уникальный идентификатор элемента
 * - data-fsc-combobox-collapsed — состояние открытия
 * - data-fsc-combobox-search-type — тип поиска default (любое нахождение) | firstLetter (по первой букве)
 * - data-fsc-combobox-prestyled — включение дефолтных стилей
 *      - 'list' список ul
 *      - 'input' элемент ввода + label
 *      - 'icons' иконки dispose + close
 *      - 'all' все стили
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

import { SearchType } from './types/plugin.enum'
import type { FilterList, HTMLCombobox } from './types/plugin.interface'

const 
    HTMLElements: HTMLCombobox[] = [],
    hoverSupported = window.matchMedia('(hover: hover) and (pointer: fine)').matches

export function comboboxAutoload() {
    const comboboxes = document.querySelectorAll<HTMLElement>('[data-fsc-combobox-id]')

    for(const combobox of comboboxes) {
        const   
            ul = combobox.querySelector('ul')

        if(!ul) return

        const
            list = ul.querySelectorAll('p'),
            convertedList = list ? Array.from(list) : [],
            insecureSearchType = combobox.getAttribute('data-fsc-combobox-search-type'),
            input = combobox.querySelector<HTMLInputElement>('input'),
            imgClose = combobox.querySelector<HTMLElement>("img[data-fsc-combobox-input-icon-close]")
        
        if(!input) return

        const searchType = ((el): SearchType => {
            const values = Object.values(SearchType) as string[]

            return el !== null && values.includes(el) ?
                SearchType[el as keyof typeof SearchType] : SearchType.default
        })(insecureSearchType)
        
        HTMLElements.push({
            combobox,
            originalList: convertedList,
            ul,
            input,
            searchType,
            imgClose
        })
    }
}
export const comboboxOnKeyUpArray = [comboboxOnKeyUp, 'input[data-fsc-combobox]']
export const comboboxClickArray = [comboboxClick, '[data-fsc-combobox-id]']

function comboboxOnKeyUp(event: KeyboardEvent) {
    const   
        root = (event.target as HTMLElement).closest('[data-fsc-combobox-id]')

    const combobox = HTMLElements.find(e => e.combobox === root)

    if(!combobox) return
    
    const filteredList: FilterList = {
        ul: combobox.ul,
        input: combobox.input,
        searchType: combobox.searchType,
        originalList: combobox.originalList
    }
    actionFilterList(filteredList)
}

function comboboxClick(_: HTMLElement, event: Event) {
    const 
        target = event.target as HTMLElement,
        liHTMLElement = target.closest('li[data-fsc-combobox-item]'),
        inputHTMLElement = target.closest<HTMLInputElement>('input[data-fsc-combobox]'),
        closeIconHTMLElement = target.closest('[data-fsc-combobox-input-icon-close]'),
        windowScreenHTMLElement = document.createElement('div'),
        root = inputHTMLElement?.closest('[data-fsc-combobox-id]'),
        ulHTMLElement = root?.querySelector('ul.combobox__list')
    
    if(!ulHTMLElement) return
        
    actionCloseComboBoxOnClick()
    
    if(inputHTMLElement && root && root?.getAttribute('data-fsc-combobox-collapsed') === 'false') {
        if(hoverSupported) return

        const combobox = HTMLElements.find(e => e.combobox === root)

        if(combobox)
            actionFilterList(combobox)
        
        windowScreenHTMLElement.setAttribute('data-fsc-combobox-blank', '')
        document.querySelector('body')?.append(windowScreenHTMLElement);
        (root as HTMLElement).dataset['fscComboboxCollapsed'] = 'true'

        windowScreenHTMLElement.addEventListener('click', actionCloseComboBoxOnClick)   
    }

    if(liHTMLElement) {
        const root = target.closest('[data-fsc-combobox-id]')

        if(!root) return

        const combobox = HTMLElements.find(e => e.combobox === root)

        if(!combobox) return
        
        if(combobox.imgClose) {
            combobox.imgClose.setAttribute('data-fsc-combobox-collapsed', '')
        }
        
        if(combobox.input) {
            combobox.input.value = liHTMLElement.textContent!.trim()
            combobox.input.setAttribute('data-fsc-combobox-result', '')
            actionCloseComboBoxOnClick()
        }
    }
    
    
    if(closeIconHTMLElement) {
        const 
            combo_box = closeIconHTMLElement?.closest('[data-fsc-combobox-id]'),
            input = combo_box?.querySelector<HTMLInputElement>('input[data-fsc-combobox]')
        
        if(input) {
            input.value = ''
        }

        actionCloseComboBoxOnClick()
    }

    function actionCloseComboBoxOnClick() {
        document.querySelectorAll("[data-fsc-combobox-collapsed='true']").forEach((combo_box) => {
            (combo_box as HTMLElement).dataset['fscComboboxCollapsed'] = 'false'
        }) 
        
        windowScreenHTMLElement.removeEventListener('click', actionCloseComboBoxOnClick)
        document.querySelector('[data-fsc-combobox-blank]')?.remove()
    }
}

function actionFilterList( { ul, input, searchType, originalList }: FilterList) {    
    const searchTerm = input && input.value.trim().toLowerCase()
    
    const filteredList = originalList
        .filter(e => {
            if(searchType == SearchType.firstLetter) 
                return e.textContent?.trim()?.toLowerCase()?.startsWith(searchTerm!)
            else if(searchType == SearchType.default) 
                return e.textContent?.trim()?.toLowerCase()?.includes(searchTerm!)
        })
        .map(e => {
            const 
                value = e.textContent

            let span: string | undefined = ''

            if(searchType == SearchType.firstLetter) 
                span = value?.replace(new RegExp(searchTerm!, "i"), match => {
                    return `<span data-fsc-combobox-highlited>${match}</span>`
                })
            else if(searchType == SearchType.default) 
                span = value?.replace(new RegExp(searchTerm!, "ig"), match => {
                    return `<span data-fsc-combobox-highlited>${match}</span>`
                })
            
            return {
                span,
                svg: e.querySelector('.combobox__p-icon-wrapper')
            }
            
        })

    ul.innerHTML = ''
    filteredList.forEach(e => {
        ul.insertAdjacentHTML('beforeend',
            `<li data-fsc-combobox-item>
                <p>
                    ${e.span}
                    ${e.svg?.outerHTML ?? ''}
                </p>
            </li>`
        )
    })     
}