import { useCallback, useEffect, useState } from 'react'
import { FEES_STORAGE_KEY } from '../constants'
import type { ConversionFee } from '../types'
import {
  getConfiguredFee,
  readStoredFeesFromRaw,
  removeFeeFromList,
  upsertFeeInList,
} from '../utils/feesStorage'

function readStoredFees(): ConversionFee[] {
  return readStoredFeesFromRaw(localStorage.getItem(FEES_STORAGE_KEY))
}

export function useConversionFees() {
  const [fees, setFees] = useState<ConversionFee[]>(() => readStoredFees())

  useEffect(() => {
    localStorage.setItem(FEES_STORAGE_KEY, JSON.stringify(fees))
  }, [fees])

  const getFee = useCallback(
    (from: string, to: string): number => getConfiguredFee(fees, from, to),
    [fees],
  )

  const upsertFee = useCallback((fee: ConversionFee) => {
    setFees((currentFees) => upsertFeeInList(currentFees, fee))
  }, [])

  const removeFee = useCallback((id: string) => {
    setFees((currentFees) => removeFeeFromList(currentFees, id))
  }, [])

  return {
    fees,
    getFee,
    upsertFee,
    removeFee,
  }
}
