import { SearchType } from "./plugin.enum"

export interface ComboBoxSettings {
    event: Event,
    searchType?: SearchType
}
export interface FilterList {
    ul: HTMLUListElement,
    input: HTMLInputElement,
    searchType: SearchType,
    originalList: HTMLParagraphElement[]
}
export interface HTMLCombobox {
    combobox: HTMLElement,
    originalList: HTMLParagraphElement[],
    ul: HTMLUListElement,
    input: HTMLInputElement,
    searchType: SearchType,
    imgClose: HTMLElement | null
}