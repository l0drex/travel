export function dateFormatter(date: Date, locale: Intl.LocalesArgument, short: boolean = false) {
    return date.toLocaleDateString(locale, {
        month: short ? 'short' : 'long',
        year: 'numeric'
    })
}
