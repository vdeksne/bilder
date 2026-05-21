import { BASE_CURRENCY } from '../constants'
import type { ConversionResult, RateMap } from '../types'

export function getCrossRate(
  rates: RateMap,
  from: string,
  to: string,
): number {
  if (from === to) {
    return 1
  }

  const fromRate = from === BASE_CURRENCY ? 1 : rates[from]
  const toRate = to === BASE_CURRENCY ? 1 : rates[to]

  if (fromRate === undefined || toRate === undefined) {
    throw new Error(`Missing exchange rate for ${from} or ${to}`)
  }

  return toRate / fromRate
}

export function convertAmount(
  amount: number,
  from: string,
  to: string,
  rates: RateMap,
  fee: number,
): ConversionResult {
  const rate = getCrossRate(rates, from, to)
  const netAmount = amount - amount * fee
  const convertedAmount = netAmount * rate

  return {
    convertedAmount,
    netAmount,
    rate,
    fee,
  }
}

export function getSupportedCurrencies(rates: RateMap): string[] {
  return [BASE_CURRENCY, ...Object.keys(rates).sort()]
}
