/**
 * scroll.ts
 * Прокручивает страницу так, чтобы элемент оказался в нужной позиции,
 * с поддержкой offset, block и поведения прокрутки.
 *
 * Поддерживаемые атрибуты `data-fsc-scroll-*`:
 * - data-fsc-scroll — инициализирует элемент для скролла
 * - data-fsc-scroll-to — селектор элемента назначения (по умолчанию 'main')
 * - data-fsc-scroll-behaviour — определяет поведение прокрутки:
 *     'auto'    — мгновенная прокрутка
 *     'smooth'  — плавная прокрутка
 *     'instant' — мгновенная прокрутка (синоним auto)
 * - data-fsc-scroll-block — определяет вертикальное положение элемента после скролла:
 *     'start'   — верх элемента у верхнего края окна
 *     'center'  — элемент по центру окна
 *     'end'     — нижний край элемента у нижнего края окна
 *     'nearest' — элемент прокручивается к ближайшему краю окна (по умолчанию)
 * - data-fsc-scroll-offset — смещение в px от выбранного положения (может быть отрицательным)
 *
 * Параметры прокрутки:
 * - block:
 *     'nearest' (по умолчанию) — прокручивает элемент к ближайшему краю окна, если он ещё не виден
 *     'center'                  — центрирует элемент по вертикали
 *     'end'                     — прокручивает элемент так, чтобы его низ совпадал с низом окна
 *     'start'                   — прокручивает элемент так, чтобы его верх совпадал с верхом окна
 * - behavior:
 *     'auto'    — мгновенная прокрутка
 *     'smooth'  — плавная анимация
 *     'instant' — мгновенная прокрутка
 */

import { ScrollBehavior, ScrollLogicalPosition } from "./types/plugin.type"

export const scrollClickArray = [scrollClick, '[data-fsc-scroll]']

function scrollClick(element: HTMLElement) {
    const
        destinationSelector = element.getAttribute('data-fsc-scroll-to') || 'main',
        destination = document.querySelector<HTMLElement>(destinationSelector),
        behaviourAttr = element.getAttribute('data-fsc-scroll-behaviour'),
        blockAttr = element.getAttribute('data-fsc-scroll-block'),
        offsetAttr = element.getAttribute('data-fsc-scroll-offset')

    if (!destination) {
        console.warn('[SCROLL]: Destination not found', destinationSelector)
        return
    }

    // Определяем поведение прокрутки
    const behavior: ScrollBehavior =
        behaviourAttr === 'auto' ||
        behaviourAttr === 'smooth' ||
        behaviourAttr === 'instant'
            ? behaviourAttr
            : 'smooth'

    // Определяем вертикальное положение элемента после скролла
    const block: ScrollLogicalPosition =
        blockAttr === 'start' ||
        blockAttr === 'center' ||
        blockAttr === 'end' ||
        blockAttr === 'nearest'
            ? blockAttr
            : 'start'

    // Считываем offset в px
    const offset = offsetAttr ? parseInt(offsetAttr, 10) : 0

    // Получаем координаты элемента относительно документа
    const rect = destination.getBoundingClientRect()
    const elementTop = rect.top + window.pageYOffset
    const elementHeight = rect.height
    const viewportHeight = window.innerHeight

    let targetY: number

    switch (block) {
        case 'center':
            // центрируем элемент по вертикали
            targetY = elementTop - viewportHeight / 2 + elementHeight / 2
            break

        case 'end':
            // нижний край элемента у нижнего края окна
            targetY = elementTop - viewportHeight + elementHeight
            break

        case 'nearest': {
            // ближайший край к текущему положению
            const currentTop = window.pageYOffset
            const currentBottom = currentTop + viewportHeight
            const elementBottom = elementTop + elementHeight

            // если элемент полностью виден — не скроллим
            if (elementTop >= currentTop && elementBottom <= currentBottom) {
                return
            }

            const distanceToTop = Math.abs(elementTop - currentTop)
            const distanceToBottom = Math.abs(elementBottom - currentBottom)

            targetY = distanceToTop < distanceToBottom
                ? elementTop
                : elementBottom - viewportHeight
            break
        }

        case 'start':
        default:
            // верхний край элемента у верхнего края окна
            targetY = elementTop
    }

    // применяем offset
    targetY -= offset

    // скроллим к рассчитанной позиции
    window.scrollTo({
        top: targetY,
        behavior
    })
}
