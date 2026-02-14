import '~/test.scss'
import '@/assets/styles/main.scss'
// @ts-ignore
import { BurgerMenu } from '~/components'
// @ts-ignore
import { autoloader } from '~/scripts/autoloader/autoloader'

window.addEventListener('click', function(e) {
    const 
        burger: HTMLElement | null = (e.target as HTMLElement).closest('.burger'),
        submenu = (e.target as HTMLElement).closest('.submenu-menu span')

    
    if(burger)
        BurgerMenu(burger)

    if(submenu)
        displaySubmenu(submenu)
    else 
        closeSubmenu()

})

document.fonts.ready.then(async() => {
    const loadedModules = new Map<string, any>()
    await autoloader(loadedModules)

    const
        autoloadedModules = Array.from(loadedModules)
            .map(([k, e]) => e?.[`${k}Autoload`])
            .filter(e => typeof e === 'function')
            .forEach(e => e())

    const
        onClickedModules = Array.from(loadedModules)
            .filter(([k, e]) => typeof e[`${k}ClickArray`] === 'object')
            .map(e => {
                return {
                    func: e[1][`${e[0]}ClickArray`][0],
                    elementSelector: e[1][`${e[0]}ClickArray`][1] || `[data-fsc-${e[0]}]`
                }
            })
    
    const
        onIntersectionModules = Object.fromEntries(
             Array.from(loadedModules)
            .filter(([k, e]) => typeof e[`${k}ObserverArray`] === 'object')
            .map(([k, e]) => {
                return [
                    k,
                    {
                        func: e[`${k}ObserverArray`][0],
                        elementSelector: e[`${k}ObserverArray`][1] || `[data-fsc-${k}]`
                    }
                ]
            })
        )

    const
        onSubmitModules = Array.from(loadedModules)
            .filter(([k, e]) => typeof e[`${k}OnSubmit`] === 'function')
            .map(e => [e[0], e[1][`${e[0]}OnSubmit`]])

    const
        onResizeModules = Array.from(loadedModules)
            .filter(([k, e]) => typeof e[`${k}OnResize`] === 'function')
            .map(e => [e[0], e[1][`${e[0]}OnResize`]])

    const
        onKeyUpModules = Array.from(loadedModules)
            .map(([k, e]) => {
                return Object.values(e).find(el => {
                    if(Array.isArray(el) && el[0].name === `${k}OnKeyUp`)
                        return true
                    
                })
            })
            .filter(e => typeof e !== 'undefined')
            
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const watchedModule = Array.from(entry.target.attributes)
                .map(a => a.name)
                .filter(name => /^data-fsc-[^-]+$/.test(name))
                .map(name => name.slice('data-fsc-'.length))[0]

            onIntersectionModules[watchedModule].func(entry, observer)
        })
    }, {
        
    })
    
    for(const element of Object.values(onIntersectionModules)) {
        document.querySelectorAll(element.elementSelector).forEach(el => observer.observe(el))
    }

    window.addEventListener('click', function(event) {
        onClickedModules.forEach(e => {
            const 
                DOMElement: HTMLElement | null = (event.target as HTMLElement).closest(e.elementSelector)
                
            if(DOMElement)
                e.func(DOMElement, event)
            
        })
    })
    
    window.addEventListener('resize', function(event) {
        onResizeModules.forEach(e => e[1]())
    })

    window.addEventListener('submit', function(event) {
        onSubmitModules.forEach(e => e[1](event))
    })
    

    onKeyUpModules.forEach(e => {
        if(!Array.isArray(e)) return 

        const HTMLElement = document.querySelectorAll(e[1]) 
        HTMLElement.forEach(el => el.addEventListener('keyup', function(event: KeyboardEvent) {
                e[0](event)
        }))
       
      
    })
    
})

function displaySubmenu(target) {
    const 
        parent = target.parentElement,
        ul = parent.querySelector('ul')

    closeSubmenu(target)
    
    target.classList.toggle('active')
    ul.classList.toggle('active')

    
    
}
function closeSubmenu(target = null) {
    if(!target) {
        document.querySelectorAll('ul.active').forEach(e => {
            e.classList.remove('active')
        })
        document.querySelectorAll('span.active').forEach(e => {
            e.classList.remove('active')
        })
        return
    }
    else {
        const 
            parent = target.parentElement,
            ul = parent.querySelector('ul')
            
        parent.querySelectorAll('.active').forEach(e => {
            if(!e.isSameNode(target) && !e.isSameNode(ul))
                e.classList.remove('active')
        })
        
    }
}