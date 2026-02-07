/**
 * watcher.ts
 * Компонент Intersection Observer, позволяющий следить за появлением элемента в viewport Браузера.
 *
 * Поддерживаемые атрибуты `data-fsc-watcher-*`:
 * - data-fsc-watcher — инициализирует элемент
 * - data-fsc-watcher-once — элемент будет отслеживаем лишь один раз
 */

import { settings } from "../../../settings"
export const watcherObserverArray = [watcherObserver, '[data-fsc-watcher]']

function watcherObserver(entry: IntersectionObserverEntry, observer: IntersectionObserver) {
  if(!settings.watcherNeeded)
    return

  const 
    el = entry.target as HTMLElement,
    isFinite = el.hasAttribute('data-fsc-watcher-once')
  
  if(entry.isIntersecting) 
  {
    el.classList.add('intersected')   

    if(isFinite) el.dataset.fscWatcherShowed = 'true'
  }  
  else 
  {
    el.classList.remove('intersected')   

    if(isFinite && el.hasAttribute('data-fsc-watcher-showed')) {
      el.removeAttribute('data-fsc-watcher')
      el.removeAttribute('data-fsc-watcher-once')
      el.removeAttribute('data-fsc-watcher-showed')
      observer.unobserve(el) 
    }
  }
   

   
}