// Locale Argentina para fechas y moneda
const LOCALE = 'es-AR'
const TZ = 'America/Argentina/Mendoza'

export const formatCurrency = (amount: number, currency: 'USD' | 'ARS' = 'USD'): string =>
  new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)

export const formatNumber = (value: number): string =>
  new Intl.NumberFormat(LOCALE).format(value)

export const formatPercent = (value: number): string =>
  new Intl.NumberFormat(LOCALE, { style: 'percent', maximumFractionDigits: 1 }).format(value / 100)

export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string =>
  new Intl.DateTimeFormat(LOCALE, {
    timeZone: TZ,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(new Date(date))
