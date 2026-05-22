import { useReducer } from 'react'
import { DEFAULT_CURRENCIES } from '../constants'
import type { ConversionResult } from '../types'

export type ConversionState = ConversionResult & {
  rateDate: string
  fromCurrency: string
  toCurrency: string
}

type SubmissionState = {
  availableCurrencies: string[]
  result: ConversionState | null
  submissionError: string | null
}

type SubmissionAction =
  | { type: 'reset' }
  | { type: 'success'; currencies: string[]; result: ConversionState }
  | { type: 'error'; message: string }

const initialState: SubmissionState = {
  availableCurrencies: DEFAULT_CURRENCIES,
  result: null,
  submissionError: null,
}

export function submissionReducer(
  state: SubmissionState,
  action: SubmissionAction,
): SubmissionState {
  switch (action.type) {
    case 'reset':
      return { ...state, result: null, submissionError: null }
    case 'success':
      return {
        availableCurrencies: action.currencies,
        result: action.result,
        submissionError: null,
      }
    case 'error':
      return { ...state, result: null, submissionError: action.message }
  }
}

export function useConversionSubmission() {
  const [state, dispatch] = useReducer(submissionReducer, initialState)

  return {
    availableCurrencies: state.availableCurrencies,
    result: state.result,
    submissionError: state.submissionError,
    resetSubmission: () => dispatch({ type: 'reset' }),
    setSuccess: (currencies: string[], result: ConversionState) =>
      dispatch({ type: 'success', currencies, result }),
    setError: (message: string) => dispatch({ type: 'error', message }),
  }
}
