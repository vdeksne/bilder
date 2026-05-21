export function normalizeCurrency(value: string): string {
  return value.trim().toUpperCase()
}

export const currencyCodePattern = /^[A-Z]{3}$/
