
let tempParticle: HTMLElement[] = []

export const accordionIconClickArray = [accordionIconClick, '[data-fsc-accordion-touch]']

function accordionIconClick(element: HTMLElement) {
    const 
        hoverSupported = window.matchMedia('(hover: hover) and (pointer: fine)').matches,
        accordion = element.closest('[data-fsc-accordion]') as HTMLElement,
        dataBehaviourType = accordion?.getAttribute('data-fsc-accordion-behaviour'),
        dataMediaVisibility = accordion?.getAttribute('data-fsc-accordion-media-query')
        
    if((accordion && dataMediaVisibility && !window.matchMedia(`(${dataMediaVisibility})`).matches) || hoverSupported) return
    
    if(dataBehaviourType !== 'default') {
        tempParticle.forEach(e => {
            if(e.hasAttribute('style'))
                e.removeAttribute('style')
            if(!e.isSameNode(accordion) && e.hasAttribute('data-fsc-accordion-active') && !e.hasAttribute('data-fsc-accordion-behaviour'))
                e.removeAttribute('data-fsc-accordion-active')
        })
        tempParticle = []
        tempParticle.push(accordion)
    }

    const 
        hiddenPart = accordion.querySelector('[data-fsc-accordion-body]') as HTMLElement || element.querySelector('.accordion__body') as HTMLElement,
        clone = hiddenPart!.cloneNode(true) as HTMLElement
    
    accordion.toggleAttribute('data-fsc-accordion-active')

    clone.style.cssText = 
    `
        opacity: 1;
        visibility: visible;
        height: max-content;
        max-height: unset;
    `
    accordion!.append(clone)
    const cloneHeight = window.getComputedStyle(clone).height
    clone.remove()

    if(accordion.hasAttribute('data-fsc-accordion-active')) {
        hiddenPart.style.maxHeight = cloneHeight
        hiddenPart.style.height = 'max-content'

        if(dataBehaviourType !== 'default')
            tempParticle.push(hiddenPart!)
    }
    else {
        hiddenPart.removeAttribute('style')
    }
    
}