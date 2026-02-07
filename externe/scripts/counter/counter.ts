/**
 * counter.ts
 * Компонент анимированного счетчика.
 *
 * Поддерживаемые атрибуты `data-fsc-counter-*`:
 * - data-fsc-counter — инициализирует элемент как счетчик
 * - data-fsc-counter-finalvalue — конечное значение счетчика
 * - data-fsc-counter-mode — режим выполнения счетчика: 'increment' или 'decrement' (по умолчанию 'increment')
 * - data-fsc-counter-duration — длительность выполнения счетчика в мс (по умолчанию '7000')
 * - data-fsc-counter-easing — определяют, как значение изменяется во времени (по умолчанию '2' - easeOutQuart)
 */

import type { CounterMode } from './types/plugin.type'

let animationId: number | undefined

export const counterObserverArray = [counterObserver, '[data-fsc-counter]']

function counterObserver(entry: IntersectionObserverEntry, observer: IntersectionObserver) {
    if(entry.isIntersecting) {
        requestAnimationFrame(animateCounter)
        observer.unobserve(entry.target)
    }
}

function animateCounter() {
    const 
        counters = document.querySelectorAll('[data-fsc-counter]')

    if(!counters)
        return
    
    for(const counter of counters) {
        const 
            finalValueAttr = counter.getAttribute('data-fsc-counter-finalvalue')

        if(!finalValueAttr)
            return

        const
            modeAttr = counter.getAttribute('data-fsc-counter-mode'),
            mode: CounterMode = 
                modeAttr === 'increment' || modeAttr === 'decrement'
                    ? modeAttr : 'increment',
            endValue = Number.parseFloat(finalValueAttr),
            duration = Number.parseInt(counter.getAttribute('data-fsc-counter-duration') || '7000'),
            easing = counter.getAttribute('data-fsc-counter-easing') || '2',
            easingObject: Record<string, (t: number) => number> = {
                // easeOutCubic — плавнее, более "тяжёлый" конец
                '1': (t) => 1 - Math.pow(1 - t, 3),
                // easeOutQuart — ещё мягче
                '2': (t) => 1 - Math.pow(1 - t, 4),
                // easeOutQuint — максимально плавное замедление
                '3': (t) => 1 - Math.pow(1 - t, 5)
            },
            isInteger = Number.isInteger(endValue)
            
        let 
            startValue = Number.parseFloat(counter.innerHTML),
            startTimestamp: number | null = null,
            floatToFixed = isInteger ? 0 : finalValueAttr.match(/\.(.+)$/)![1].length
        
            
        
        function step(timestamp: number) {
            if (!startTimestamp) startTimestamp = timestamp

            const 
                progress = Math.min((timestamp - startTimestamp) / duration, 1),
                easedProgress = easingObject[easing](progress)

            let currentValue

            if(mode === 'increment')
            {
                if(!isInteger)
                    currentValue = (startValue + (endValue - startValue) * easedProgress).toFixed(floatToFixed)
                else
                    currentValue = Math.round(startValue + (endValue - startValue) * easedProgress)
            }
            else
            {
                if(!isInteger)
                    currentValue = (startValue - (startValue - endValue) * easedProgress).toFixed(floatToFixed)
                else
                    currentValue = Math.round(startValue - (startValue - endValue) * easedProgress)
            }

            counter!.textContent = currentValue!.toString()
            
            if (progress < 1) {
                animationId = requestAnimationFrame(step)
            } else {
                cancelAnimationFrame(animationId!)
            }
        }
        
        animationId = requestAnimationFrame(step)
    }
}

