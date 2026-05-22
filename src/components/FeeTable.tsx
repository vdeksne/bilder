import { useMemo } from 'react'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
    return (
      <p className="rounded-lg border border-dashed bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
        No custom fees configured yet. Add a direction-specific fee below to
        override the default of 0.01.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Fee</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedFees.map((fee) => (
          <TableRow key={fee.id}>
            <TableCell>
              <Badge variant="secondary">{fee.from}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">{fee.to}</Badge>
            </TableCell>
            <TableCell className="font-mono">{fee.fee}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(fee)}
                >
                  <PencilIcon />
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemove(fee.id)}
                >
                  <Trash2Icon />
                  Remove
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
