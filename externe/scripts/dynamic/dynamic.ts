/**
 * dynamic.ts
 * Компонент динамического встраивания в target.
 *
 * Поддерживаемые атрибуты `data-fsc-dynamic-*`:
 * - data-fsc-dynamic — инициализирует элемент, который при определенном media встраивается в target
 * - data-fsc-dynamic-target — цель для вставки
 * - data-fsc-dynamic-media-query — медиа запрос, по которому будет идти встраивание
 */


export function dynamicAutoload() {
    (document.querySelectorAll('[data-fsc-dynamic]') as NodeListOf<HTMLElement>).forEach(HTMLElement => {
        const 
            target = HTMLElement.getAttribute('data-fsc-dynamic-target'),
            condition = HTMLElement.getAttribute('data-fsc-dynamic-media-query')

        if(!target || !condition) return

        const 
            targetHTML = document.querySelector(target),
            cloneHTML = HTMLElement.cloneNode(true) as HTMLElement,
            mediaQuery = window.matchMedia(`(${condition})`)


        if(!targetHTML) return

        cloneHTML.setAttribute('data-fsc-dynamic-clone', '')
        targetHTML.append(cloneHTML)

        if(!mediaQuery.matches) {
            cloneHTML.style.display = 'none'
        }
        else {
            HTMLElement.style.display = 'none'
        }
        
        mediaQuery.addEventListener('change', e => {
            if(e.matches) {
                cloneHTML.removeAttribute('style')
                HTMLElement.style.display = 'none'
            }
            else {
                cloneHTML.style.display = 'none'
                HTMLElement.removeAttribute('style')
            }
        })
        
    })
    
}