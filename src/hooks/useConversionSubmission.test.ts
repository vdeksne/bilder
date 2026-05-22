import { describe, expect, it } from 'vitest'
import { DEFAULT_CURRENCIES } from '../constants'
import {
  submissionReducer,
  type ConversionState,
} from './useConversionSubmission'

const initialState = {
  availableCurrencies: DEFAULT_CURRENCIES,
  result: null,
  submissionError: null,
}

const sampleResult: ConversionState = {
  convertedAmount: 85,
  netAmount: 99,
  rate: 0.85,
  fee: 0.01,
  rateDate: '2026-05-22',
  fromCurrency: 'EUR',
  toCurrency: 'GBP',
}

describe('submissionReducer', () => {
  it('clears result and error on reset', () => {
    const state = {
      ...initialState,
      result: sampleResult,
      submissionError: 'Previous error',
    }

    expect(submissionReducer(state, { type: 'reset' })).toEqual({
      ...state,
      result: null,
      submissionError: null,
    })
  })

  it('stores currencies and result on success', () => {
    const currencies = ['EUR', 'GBP', 'USD']

    expect(
      submissionReducer(initialState, {
        type: 'success',
        currencies,
        result: sampleResult,
      }),
    ).toEqual({
      availableCurrencies: currencies,
      result: sampleResult,
      submissionError: null,
    })
  })

  it('stores error and clears result on failure', () => {
    const state = {
      ...initialState,
      result: sampleResult,
    }

    expect(
      submissionReducer(state, { type: 'error', message: 'Conversion failed.' }),
    ).toEqual({
      ...state,
      result: null,
      submissionError: 'Conversion failed.',
    })
  })
})
