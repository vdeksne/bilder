import { DEFAULT_FEE } from '../constants'
import type { ConversionFee } from '../types'

export function createFeeId(): string {
  return crypto.randomUUID()
}

function isValidFeeEntry(
  fee: unknown,
): fee is { id?: string; from: string; to: string; fee: number } {
  return (
    typeof fee === 'object' &&
    fee !== null &&
    typeof fee.from === 'string' &&
    typeof fee.to === 'string' &&
    typeof fee.fee === 'number' &&
    fee.from.length > 0 &&
    fee.to.length > 0 &&
    fee.fee >= 0 &&
    (fee.id === undefined ||
      (typeof fee.id === 'string' && fee.id.length > 0))
  )
}

export function filterValidFees(parsed: unknown): ConversionFee[] {
  if (!Array.isArray(parsed)) {
    return []
  }

  return parsed.filter(isValidFeeEntry).map((fee) => ({
    id: fee.id ?? createFeeId(),
    from: fee.from,
    to: fee.to,
    fee: fee.fee,
  }))
}

export function readStoredFeesFromRaw(raw: string | null): ConversionFee[] {
  if (!raw) {
    return []
  }

  try {
    return filterValidFees(JSON.parse(raw))
  } catch {
    return []
  }
}

export function hasSameDirection(
  left: ConversionFee,
  right: ConversionFee,
): boolean {
  return left.from === right.from && left.to === right.to
}

export function upsertFeeInList(
  fees: ConversionFee[],
  fee: ConversionFee,
): ConversionFee[] {
  const feeWithId: ConversionFee = {
    ...fee,
    id: fee.id || createFeeId(),
  }

  const withoutConflicts = fees.filter(
    (currentFee) =>
      currentFee.id !== feeWithId.id &&
      !hasSameDirection(currentFee, feeWithId),
  )

  return [...withoutConflicts, feeWithId]
}

export function removeFeeFromList(
  fees: ConversionFee[],
  id: string,
): ConversionFee[] {
  return fees.filter((fee) => fee.id !== id)
}

export function getConfiguredFee(
  fees: ConversionFee[],
  from: string,
  to: string,
): number {
  const configuredFee = fees.find((fee) => fee.from === from && fee.to === to)

  return configuredFee?.fee ?? DEFAULT_FEE
}
