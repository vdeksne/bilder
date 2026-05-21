import { describe, expect, it, vi } from 'vitest'
import { DEFAULT_FEE } from '../constants'
import type { ConversionFee } from '../types'
import {
  createFeeId,
  filterValidFees,
  getConfiguredFee,
  readStoredFeesFromRaw,
  removeFeeFromList,
  upsertFeeInList,
} from './feesStorage'

const sampleFees: ConversionFee[] = [
  { id: 'fee-eur-gbp', from: 'EUR', to: 'GBP', fee: 0.01 },
  { id: 'fee-gbp-eur', from: 'GBP', to: 'EUR', fee: 0.02 },
]

describe('createFeeId', () => {
  it('returns unique identifiers', () => {
    expect(createFeeId()).not.toBe(createFeeId())
  })
})

describe('readStoredFeesFromRaw', () => {
  it('returns an empty list when storage is missing', () => {
    expect(readStoredFeesFromRaw(null)).toEqual([])
  })

  it('returns an empty list for invalid JSON', () => {
    expect(readStoredFeesFromRaw('{not-json')).toEqual([])
  })

  it('returns an empty list when JSON is not an array', () => {
    expect(readStoredFeesFromRaw('{"from":"EUR"}')).toEqual([])
  })

  it('assigns ids to legacy entries without one', () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('generated-id')

    expect(
      readStoredFeesFromRaw(
        JSON.stringify([{ from: 'EUR', to: 'GBP', fee: 0.01 }]),
      ),
    ).toEqual([{ id: 'generated-id', from: 'EUR', to: 'GBP', fee: 0.01 }])
  })
})

describe('filterValidFees', () => {
  it('keeps only valid fee entries and preserves ids', () => {
    expect(
      filterValidFees([
        { id: 'fee-1', from: 'EUR', to: 'GBP', fee: 0.01 },
        { from: '', to: 'GBP', fee: 0.01 },
        { id: 'fee-2', from: 'EUR', to: 'USD', fee: -1 },
        { id: 'fee-3', from: 'EUR', to: 'USD', fee: '0.01' },
        null,
      ]),
    ).toEqual([{ id: 'fee-1', from: 'EUR', to: 'GBP', fee: 0.01 }])
  })
})

describe('upsertFeeInList', () => {
  it('adds a new fee when the direction does not exist', () => {
    expect(
      upsertFeeInList(sampleFees, {
        id: 'fee-eur-usd',
        from: 'EUR',
        to: 'USD',
        fee: 0.03,
      }),
    ).toEqual([
      ...sampleFees,
      { id: 'fee-eur-usd', from: 'EUR', to: 'USD', fee: 0.03 },
    ])
  })

  it('replaces an existing fee by id', () => {
    expect(
      upsertFeeInList(sampleFees, {
        id: 'fee-eur-gbp',
        from: 'EUR',
        to: 'GBP',
        fee: 0.05,
      }),
    ).toEqual([
      { id: 'fee-gbp-eur', from: 'GBP', to: 'EUR', fee: 0.02 },
      { id: 'fee-eur-gbp', from: 'EUR', to: 'GBP', fee: 0.05 },
    ])
  })
})

describe('removeFeeFromList', () => {
  it('removes the matching fee by id', () => {
    expect(removeFeeFromList(sampleFees, 'fee-eur-gbp')).toEqual([
      { id: 'fee-gbp-eur', from: 'GBP', to: 'EUR', fee: 0.02 },
    ])
  })
})

describe('getConfiguredFee', () => {
  it('returns the configured fee for a direction', () => {
    expect(getConfiguredFee(sampleFees, 'GBP', 'EUR')).toBe(0.02)
  })

  it('falls back to the default fee when no direction is configured', () => {
    expect(getConfiguredFee(sampleFees, 'EUR', 'USD')).toBe(DEFAULT_FEE)
  })
})
