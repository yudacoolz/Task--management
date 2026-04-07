export function dateFormat(date: string) {
    const d = new Date(date)
    return d.toLocaleDateString()
}

export function dateTimeFormat(date: string) {
    const d = new Date(date)
    return d.toLocaleString()
}