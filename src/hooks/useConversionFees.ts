import { useCallback, useState } from 'react'
import { FEES_STORAGE_KEY } from '../constants'
import type { ConversionFee } from '../types'
import {
  getConfiguredFee,
  readStoredFeesFromRaw,
  removeFeeFromList,
  upsertFeeInList,
  writeStoredFees,
} from '../utils/feesStorage'

function readStoredFees(): ConversionFee[] {
  return readStoredFeesFromRaw(localStorage.getItem(FEES_STORAGE_KEY))
}

export function useConversionFees() {
  const [fees, setFees] = useState<ConversionFee[]>(() => readStoredFees())

  const getFee = useCallback(
    (from: string, to: string): number => getConfiguredFee(fees, from, to),
    [fees],
  )

  const upsertFee = useCallback((fee: ConversionFee) => {
    setFees((currentFees) => {
      const nextFees = upsertFeeInList(currentFees, fee)
      writeStoredFees(nextFees)
      return nextFees
    })
  }, [])

  const removeFee = useCallback((id: string) => {
    setFees((currentFees) => {
      const nextFees = removeFeeFromList(currentFees, id)
      writeStoredFees(nextFees)
      return nextFees
    })
  }, [])

  return {
    fees,
    getFee,
    upsertFee,
    removeFee,
  }
}
