export type NewUrlGroup = {
    matches: string[],
    exclude?: string[],
    name: string,
    closeTimeout: number,
}

export type UrlGroup = NewUrlGroup & {
    id: string,
}
