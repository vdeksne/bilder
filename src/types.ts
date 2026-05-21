export type ConversionFee = {
  from: string
  to: string
  fee: number
}

export type RateProvider = 'ecb' | 'bol'

export type RateMap = Record<string, number>

export type ExchangeRates = {
  date: string
  rates: RateMap
}

export type ConversionResult = {
  convertedAmount: number
  netAmount: number
  rate: number
  fee: number
}
