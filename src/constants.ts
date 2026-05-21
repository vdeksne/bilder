export const DEFAULT_FEE = 0.01
export const BASE_CURRENCY = 'EUR'
export const FEES_STORAGE_KEY = 'currency-conversion-fees'

export const RATE_PROVIDER_OPTIONS = [
  { value: 'ecb', label: 'ECB' },
  { value: 'bol', label: 'Bank of Lithuania' },
] as const

export const DEFAULT_CURRENCIES = ['EUR', 'GBP', 'USD']
