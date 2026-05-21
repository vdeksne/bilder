import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ConversionFee } from '../types'

type FeeConfigFormProps = {
  fees: ConversionFee[]
  onUpsertFee: (fee: ConversionFee) => void
  onRemoveFee: (from: string, to: string) => void
}

type FeeDraft = {
  from: string
  to: string
  fee: string
}

const emptyDraft: FeeDraft = {
  from: '',
  to: '',
  fee: '',
}

function normalizeCurrency(value: string): string {
  return value.trim().toUpperCase()
}

function validateDraft(draft: FeeDraft): string | null {
  const from = normalizeCurrency(draft.from)
  const to = normalizeCurrency(draft.to)
  const fee = Number.parseFloat(draft.fee)

  if (!from || !to) {
    return 'Both currencies are required.'
  }

  if (from === to) {
    return 'Source and target currency must be different.'
  }

  if (Number.isNaN(fee) || fee < 0) {
    return 'Fee must be a non-negative number.'
  }

  return null
}

export function FeeConfigForm({
  fees,
  onUpsertFee,
  onRemoveFee,
}: FeeConfigFormProps) {
  const [draft, setDraft] = useState<FeeDraft>(emptyDraft)
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const sortedFees = [...fees].sort((left, right) => {
    const leftKey = `${left.from}-${left.to}`
    const rightKey = `${right.from}-${right.to}`
    return leftKey.localeCompare(rightKey)
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationError = validateDraft(draft)

    if (validationError) {
      setError(validationError)
      return
    }

    onUpsertFee({
      from: normalizeCurrency(draft.from),
      to: normalizeCurrency(draft.to),
      fee: Number.parseFloat(draft.fee),
    })

    setDraft(emptyDraft)
    setEditingKey(null)
    setError(null)
  }

  function startEditing(fee: ConversionFee) {
    setEditingKey(`${fee.from}-${fee.to}`)
    setDraft({
      from: fee.from,
      to: fee.to,
      fee: String(fee.fee),
    })
    setError(null)
  }

  function cancelEditing() {
    setEditingKey(null)
    setDraft(emptyDraft)
    setError(null)
  }

  return (
    <section className="panel">
      <h2>Conversion Fees</h2>
      <p className="hint">
        Fees are direction-specific fractions. For example, enter 0.2 for a 20%
        fee on EUR to GBP conversions.
      </p>

      {sortedFees.length > 0 ? (
        <table className="fee-table">
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Fee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedFees.map((fee) => (
              <tr key={`${fee.from}-${fee.to}`}>
                <td>{fee.from}</td>
                <td>{fee.to}</td>
                <td>{fee.fee}</td>
                <td className="actions">
                  <button type="button" onClick={() => startEditing(fee)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => onRemoveFee(fee.from, fee.to)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="empty-state">No custom fees configured yet.</p>
      )}

      <form className="stacked-form" onSubmit={handleSubmit}>
        <h3>{editingKey ? 'Edit Fee' : 'Add Fee'}</h3>
        <div className="field-row">
          <label>
            From
            <input
              value={draft.from}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  from: event.target.value,
                }))
              }
              placeholder="EUR"
              maxLength={3}
            />
          </label>
          <label>
            To
            <input
              value={draft.to}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  to: event.target.value,
                }))
              }
              placeholder="GBP"
              maxLength={3}
            />
          </label>
          <label>
            Fee
            <input
              value={draft.fee}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  fee: event.target.value,
                }))
              }
              placeholder="0.01"
              inputMode="decimal"
            />
          </label>
        </div>

        {error ? <p className="error">{error}</p> : null}

        <div className="actions">
          <button type="submit">{editingKey ? 'Save Fee' : 'Add Fee'}</button>
          {editingKey ? (
            <button type="button" onClick={cancelEditing}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </section>
  )
}
