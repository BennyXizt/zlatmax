

export interface Component {
    this?: {
        parent?: string,
        block?: string,
        class?: string | string[],
        id?: string | string[],
        tag?: string,
        style?: string | string[],
        dataAttribute?: string | string[]
    },
    componentName: string
} 