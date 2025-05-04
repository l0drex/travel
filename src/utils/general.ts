export function dateFormatter(
  date: Date,
  locale: Intl.LocalesArgument,
  short: boolean = false,
) {
  return date.toLocaleDateString(locale, {
    month: short ? "short" : "long",
    year: "numeric",
  });
}

export function formatHours(hours: number): string {
  if (isNaN(hours)) {
    throw new Error("Hours must be a number");
  }

  const fullHours = Math.floor(hours);
  const minutes = (60 * (hours % 1)).toFixed(0).padStart(2, "0");

  return `${fullHours}:${minutes}`;
}
