let isActive = false
let handler: ((this: HTMLElement, event: AnimationEvent) => void) | undefined = undefined

export function BurgerMenu(burger: HTMLElement) {
   if(isActive || !burger)
      return

   const 
        header = burger.closest('header'),
        menu = header?.querySelector('.menu'),
        body = burger.closest('body')

   isActive = true
  
    if(!burger.classList.contains('active')) {  
        handler = function(this: HTMLElement, event:AnimationEvent) {
            handleTransition.call(this, event, (menu as HTMLElement))
        }          
        burger.addEventListener('animationend', handler)
        burger.classList.add('active')
        menu?.classList.add('is-animating')
        menu?.classList.add('active')
        body?.classList.add('active')
    }        
    else {
        burger.classList.add('reverse')
        burger.classList.remove('active')
        menu?.classList.remove('active')
        body?.classList.remove('active')
    }
}

function handleTransition(this: HTMLElement, {animationName}: {animationName: string}, menu: HTMLElement) {   
    if(animationName.startsWith('burger-active-rotate-bottom')) isActive = false
    else if(animationName.startsWith('burger-reverse-opacity-middle'))  {
        this.removeEventListener('animationend', handler!)
        this.classList.remove('active', 'reverse')
        menu?.classList.remove('is-animating')
        isActive = false
    }             
}