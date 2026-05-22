import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DEFAULT_CURRENCIES } from '../constants'
import type { ConversionFee } from '../types'
import {
  feeFormResolver,
  toConversionFee,
  type FeeFormValues,
} from '../validation/schemas'
import { FeeTable } from './FeeTable'
import { CurrencyComboboxField } from './form/CurrencyComboboxField'
import { FormActions } from './form/FormActions'
import { FieldRow } from './form/FieldRow'
import { FormRootError } from './form/FormRootError'
import { StackedForm } from './form/StackedForm'
import { TextFormField } from './form/TextFormField'
import { Panel } from './Panel'

type FeeConfigFormProps = {
  fees: ConversionFee[]
  onUpsertFee: (fee: ConversionFee) => void
  onRemoveFee: (id: string) => void
}

const emptyValues: FeeFormValues = {
  from: '',
  to: '',
  fee: '',
}

export function FeeConfigForm({
  fees,
  onUpsertFee,
  onRemoveFee,
}: FeeConfigFormProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FeeFormValues>({
    resolver: feeFormResolver,
    defaultValues: emptyValues,
    mode: 'onTouched',
  })

  const onSubmit = handleSubmit((values) => {
    onUpsertFee(toConversionFee(values, editingId ?? undefined))
    setEditingId(null)
    reset(emptyValues)
  })

  function startEditing(fee: ConversionFee) {
    setEditingId(fee.id)
    reset({
      from: fee.from,
      to: fee.to,
      fee: String(fee.fee),
    })
  }

  function cancelEditing() {
    setEditingId(null)
    reset(emptyValues)
  }

  const currencyOptions = useMemo(() => {
    const fromFees = fees.flatMap((fee) => [fee.from, fee.to])

    return [...new Set([...DEFAULT_CURRENCIES, ...fromFees])].sort()
  }, [fees])

  return (
    <Panel
      title="Conversion Fees"
      description={
        <>
          Fees are direction-specific fractions. Choose a currency from the list
          or type a 3-letter ISO code. For example, enter{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            0.2
          </code>{' '}
          for a 20% fee on EUR to GBP conversions.
        </>
      }
    >
      <FeeTable fees={fees} onEdit={startEditing} onRemove={onRemoveFee} />

      <Separator />

      <StackedForm onSubmit={onSubmit}>
        <h3 className="text-sm font-medium">
          {editingId ? 'Edit fee' : 'Add fee'}
        </h3>
        <FieldRow className="lg:grid-cols-3">
          <CurrencyComboboxField
            label="From"
            error={errors.from?.message}
            name="from"
            control={control}
            currencies={currencyOptions}
            placeholder="EUR"
          />
          <CurrencyComboboxField
            label="To"
            error={errors.to?.message}
            name="to"
            control={control}
            currencies={currencyOptions}
            placeholder="GBP"
          />
          <TextFormField
            label="Fee"
            error={errors.fee?.message}
            registration={register('fee')}
            placeholder="0.01"
            inputMode="decimal"
            step="any"
          />
        </FieldRow>

        <FormRootError message={errors.root?.message} />

        <FormActions>
          <Button type="submit">
            {editingId ? 'Save fee' : 'Add fee'}
          </Button>
          {editingId ? (
            <Button type="button" variant="outline" onClick={cancelEditing}>
              Cancel
            </Button>
          ) : null}
        </FormActions>
      </StackedForm>
    </Panel>
  )
}
