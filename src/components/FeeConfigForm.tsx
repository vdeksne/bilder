import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { ConversionFee } from '../types'
import {
  feeFormResolver,
  toConversionFee,
  type FeeFormValues,
} from '../validation/schemas'
import { FeeTable } from './FeeTable'
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

  return (
    <Panel
      title="Conversion Fees"
      description={
        <>
          Fees are direction-specific fractions. For example, enter 0.2 for a 20%
          fee on EUR to GBP conversions.
        </>
      }
    >
      <FeeTable fees={fees} onEdit={startEditing} onRemove={onRemoveFee} />

      <StackedForm onSubmit={onSubmit}>
        <h3>{editingId ? 'Edit Fee' : 'Add Fee'}</h3>
        <FieldRow>
          <TextFormField
            label="From"
            error={errors.from?.message}
            registration={register('from')}
            placeholder="EUR"
            maxLength={3}
            autoComplete="off"
          />
          <TextFormField
            label="To"
            error={errors.to?.message}
            registration={register('to')}
            placeholder="GBP"
            maxLength={3}
            autoComplete="off"
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
          <button type="submit">{editingId ? 'Save Fee' : 'Add Fee'}</button>
          {editingId ? (
            <button type="button" onClick={cancelEditing}>
              Cancel
            </button>
          ) : null}
        </FormActions>
      </StackedForm>
    </Panel>
  )
}
