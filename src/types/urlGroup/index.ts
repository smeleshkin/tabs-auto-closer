export type NewUrlGroup = {
    matches: string[],
    excludeMatches?: string[],
    name: string,
    closeTimeout: number,
}

export type UrlGroup = NewUrlGroup & {
    id: string,
}
