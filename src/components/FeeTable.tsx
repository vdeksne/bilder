import { useMemo } from 'react'
import type { ConversionFee } from '../types'

type FeeTableProps = {
  fees: ConversionFee[]
  onEdit: (fee: ConversionFee) => void
  onRemove: (id: string) => void
}

export function FeeTable({ fees, onEdit, onRemove }: FeeTableProps) {
  const sortedFees = useMemo(
    () =>
      [...fees].sort((left, right) =>
        `${left.from}-${left.to}`.localeCompare(`${right.from}-${right.to}`),
      ),
    [fees],
  )

  if (sortedFees.length === 0) {
    return <p className="empty-state">No custom fees configured yet.</p>
  }

  return (
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
          <tr key={fee.id}>
            <td>{fee.from}</td>
            <td>{fee.to}</td>
            <td>{fee.fee}</td>
            <td className="actions">
              <button type="button" onClick={() => onEdit(fee)}>
                Edit
              </button>
              <button
                type="button"
                className="danger"
                onClick={() => onRemove(fee.id)}
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
