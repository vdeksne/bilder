import { describe, expect, it, vi } from 'vitest'
import {
  conversionFormSchema,
  feeFormSchema,
  toConversionFee,
} from './schemas'

describe('feeFormSchema', () => {
  it('accepts valid fee configuration', async () => {
    await expect(
      feeFormSchema.validate({
        from: ' eur ',
        to: 'gbp',
        fee: '0.01',
      }),
    ).resolves.toEqual({
      from: 'EUR',
      to: 'GBP',
      fee: '0.01',
    })
  })

  it('rejects missing currency codes', async () => {
    await expect(
      feeFormSchema.validate({ from: '', to: 'GBP', fee: '0.01' }),
    ).rejects.toThrow('Currency is required.')
  })

  it('rejects invalid currency codes', async () => {
    await expect(
      feeFormSchema.validate({ from: 'EURO', to: 'GBP', fee: '0.01' }),
    ).rejects.toThrow('Currency must be a 3-letter ISO code.')
  })

  it('rejects negative fees', async () => {
    await expect(
      feeFormSchema.validate({ from: 'EUR', to: 'GBP', fee: '-1' }),
    ).rejects.toThrow('Fee must be a non-negative number.')
  })

  it('rejects identical source and target currencies', async () => {
    await expect(
      feeFormSchema.validate({ from: 'EUR', to: 'EUR', fee: '0.01' }),
    ).rejects.toThrow('Source and target currency must be different.')
  })
})

describe('toConversionFee', () => {
  it('parses the fee string into a number and preserves an existing id', () => {
    expect(
      toConversionFee({ from: 'EUR', to: 'GBP', fee: '0.02' }, 'fee-1'),
    ).toEqual({
      id: 'fee-1',
      from: 'EUR',
      to: 'GBP',
      fee: 0.02,
    })
  })

  it('generates an id for new fees', () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(
      '00000000-0000-4000-8000-000000000002',
    )

    expect(toConversionFee({ from: 'EUR', to: 'GBP', fee: '0.02' })).toEqual({
      id: '00000000-0000-4000-8000-000000000002',
      from: 'EUR',
      to: 'GBP',
      fee: 0.02,
    })
  })
})

describe('conversionFormSchema', () => {
  it('accepts valid conversion input', async () => {
    await expect(
      conversionFormSchema.validate({
        amount: 100,
        fromCurrency: 'EUR',
        toCurrency: 'GBP',
        provider: 'ecb',
      }),
    ).resolves.toEqual({
      amount: 100,
      fromCurrency: 'EUR',
      toCurrency: 'GBP',
      provider: 'ecb',
    })
  })

  it('coerces string amounts to numbers', async () => {
    await expect(
      conversionFormSchema.validate({
        amount: '250',
        fromCurrency: 'EUR',
        toCurrency: 'USD',
        provider: 'bol',
      }),
    ).resolves.toMatchObject({ amount: 250 })
  })

  it('rejects negative amounts', async () => {
    await expect(
      conversionFormSchema.validate({
        amount: -5,
        fromCurrency: 'EUR',
        toCurrency: 'GBP',
        provider: 'ecb',
      }),
    ).rejects.toThrow('Amount must be a non-negative number.')
  })

  it('rejects identical source and target currencies', async () => {
    await expect(
      conversionFormSchema.validate({
        amount: 100,
        fromCurrency: 'EUR',
        toCurrency: 'EUR',
        provider: 'ecb',
      }),
    ).rejects.toThrow('Source and target currency must be different.')
  })
})
