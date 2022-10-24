export type NewUrlGroup = {
    matches: string[],
    name: string,
    closeTimeout: number,
}

export type UrlGroup = NewUrlGroup & {
    id: string,
}
