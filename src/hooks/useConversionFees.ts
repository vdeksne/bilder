import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_FEE, FEES_STORAGE_KEY } from '../constants'
import type { ConversionFee } from '../types'

function readStoredFees(): ConversionFee[] {
  const raw = localStorage.getItem(FEES_STORAGE_KEY)

  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw) as ConversionFee[]

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(
      (fee) =>
        typeof fee.from === 'string' &&
        typeof fee.to === 'string' &&
        typeof fee.fee === 'number' &&
        fee.from.length > 0 &&
        fee.to.length > 0 &&
        fee.fee >= 0,
    )
  } catch {
    return []
  }
}

function hasSameDirection(
  left: ConversionFee,
  right: ConversionFee,
): boolean {
  return left.from === right.from && left.to === right.to
}

export function useConversionFees() {
  const [fees, setFees] = useState<ConversionFee[]>(() => readStoredFees())

  useEffect(() => {
    localStorage.setItem(FEES_STORAGE_KEY, JSON.stringify(fees))
  }, [fees])

  const getFee = useCallback(
    (from: string, to: string): number => {
      const configuredFee = fees.find(
        (fee) => fee.from === from && fee.to === to,
      )

      return configuredFee?.fee ?? DEFAULT_FEE
    },
    [fees],
  )

  const upsertFee = useCallback((fee: ConversionFee) => {
    setFees((currentFees) => {
      const withoutExisting = currentFees.filter(
        (currentFee) => !hasSameDirection(currentFee, fee),
      )

      return [...withoutExisting, fee]
    })
  }, [])

  const removeFee = useCallback((from: string, to: string) => {
    setFees((currentFees) =>
      currentFees.filter((fee) => !(fee.from === from && fee.to === to)),
    )
  }, [])

  return {
    fees,
    getFee,
    upsertFee,
    removeFee,
  }
}
