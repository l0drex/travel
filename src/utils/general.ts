export function dateFormatter(date: Date, short: boolean = false) {
  return date.toLocaleDateString(undefined, {
    month: short ? 'short' : 'long',
    year: 'numeric'
  })
}
