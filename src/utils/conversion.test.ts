import { describe, expect, it } from 'vitest'
import { BASE_CURRENCY } from '../constants'
import {
  convertAmount,
  getCrossRate,
  getSupportedCurrencies,
} from './conversion'

describe('getCrossRate', () => {
  const rates = { GBP: 0.85, USD: 1.08 }

  it('returns 1 for the same currency', () => {
    expect(getCrossRate(rates, 'EUR', 'EUR')).toBe(1)
    expect(getCrossRate(rates, 'GBP', 'GBP')).toBe(1)
  })

  it('returns the direct rate from EUR to another currency', () => {
    expect(getCrossRate(rates, BASE_CURRENCY, 'GBP')).toBe(0.85)
  })

  it('returns the inverse rate to EUR', () => {
    expect(getCrossRate(rates, 'GBP', BASE_CURRENCY)).toBeCloseTo(1 / 0.85)
  })

  it('calculates cross rates between non-EUR currencies', () => {
    expect(getCrossRate(rates, 'GBP', 'USD')).toBeCloseTo(1.08 / 0.85)
  })

  it('throws when a rate is missing', () => {
    expect(() => getCrossRate(rates, 'EUR', 'JPY')).toThrow(
      'Missing exchange rate for EUR or JPY',
    )
  })
})

describe('convertAmount', () => {
  const rates = { GBP: 0.85 }

  it('deducts the fee before applying the rate', () => {
    const result = convertAmount(100, 'EUR', 'GBP', rates, 0.01)

    expect(result.netAmount).toBe(99)
    expect(result.convertedAmount).toBeCloseTo(84.15)
    expect(result.rate).toBe(0.85)
    expect(result.fee).toBe(0.01)
  })

  it('uses a zero fee when none is applied', () => {
    const result = convertAmount(100, 'EUR', 'GBP', rates, 0)

    expect(result.netAmount).toBe(100)
    expect(result.convertedAmount).toBe(85)
  })
})

describe('getSupportedCurrencies', () => {
  it('includes the base currency and sorted rate keys', () => {
    expect(getSupportedCurrencies({ USD: 1.08, GBP: 0.85 })).toEqual([
      'EUR',
      'GBP',
      'USD',
    ])
  })

  it('returns only the base currency when no rates exist', () => {
    expect(getSupportedCurrencies({})).toEqual(['EUR'])
  })
})
