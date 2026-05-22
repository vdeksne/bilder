import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowRightLeftIcon, Loader2Icon } from 'lucide-react'
import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RATE_PROVIDER_OPTIONS } from '../constants'
import { useConversionSubmission } from '../hooks/useConversionSubmission'
import { fetchExchangeRates } from '../services/exchangeRates'
import type { ConversionResult } from '../types'
import { convertAmount, getSupportedCurrencies } from '../utils/conversion'
import {
  conversionFormSchema,
  type ConversionFormValues,
} from '../validation/schemas'
import { ConversionResultPanel } from './ConversionResultPanel'
import { CurrencySelectField } from './form/CurrencySelectField'
import { FieldRow } from './form/FieldRow'
import { FormRootError } from './form/FormRootError'
import { SelectFormField } from './form/SelectFormField'
import { StackedForm } from './form/StackedForm'
import { TextFormField } from './form/TextFormField'
import { Panel } from './Panel'

type ConversionFormProps = {
  getFee: (from: string, to: string) => number
}

const defaultValues: ConversionFormValues = {
  amount: 100,
  fromCurrency: 'EUR',
  toCurrency: 'GBP',
  provider: 'ecb',
}

export function ConversionForm({ getFee }: ConversionFormProps) {
  const {
    availableCurrencies,
    result,
    submissionError,
    resetSubmission,
    setSuccess,
    setError,
  } = useConversionSubmission()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ConversionFormValues>({
    resolver: yupResolver(conversionFormSchema),
    defaultValues,
    mode: 'onTouched',
  })

  const fromCurrency = useWatch({ control, name: 'fromCurrency' })
  const toCurrency = useWatch({ control, name: 'toCurrency' })

  const selectedFee = useMemo(
    () => getFee(fromCurrency, toCurrency),
    [fromCurrency, getFee, toCurrency],
  )

  const onSubmit = handleSubmit(async (values) => {
    resetSubmission()

    try {
      const exchangeRates = await fetchExchangeRates(values.provider)
      const currencies = getSupportedCurrencies(exchangeRates.rates)

      if (
        !currencies.includes(values.fromCurrency) ||
        !currencies.includes(values.toCurrency)
      ) {
        throw new Error(
          `Unsupported currency pair: ${values.fromCurrency} to ${values.toCurrency}`,
        )
      }

      const fee = getFee(values.fromCurrency, values.toCurrency)
      const conversion: ConversionResult = convertAmount(
        values.amount,
        values.fromCurrency,
        values.toCurrency,
        exchangeRates.rates,
        fee,
      )

      setSuccess(currencies, {
        ...conversion,
        rateDate: exchangeRates.date,
        fromCurrency: values.fromCurrency,
        toCurrency: values.toCurrency,
      })
    } catch (conversionError) {
      const message =
        conversionError instanceof Error
          ? conversionError.message
          : 'Conversion failed.'
      setError(message)
    }
  })

  return (
    <Panel
      title="Currency Conversion"
      description={
        <>
          The fee is deducted before conversion using{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            (amount - amount * fee) * rate
          </code>
          . Unconfigured pairs use a default fee of 0.01.
        </>
      }
    >
      <StackedForm onSubmit={onSubmit}>
        <FieldRow>
          <TextFormField
            label="Amount"
            error={errors.amount?.message}
            registration={register('amount', { valueAsNumber: true })}
            inputMode="decimal"
            step="any"
          />
          <CurrencySelectField
            label="From"
            error={errors.fromCurrency?.message}
            name="fromCurrency"
            control={control}
            currencies={availableCurrencies}
          />
          <CurrencySelectField
            label="To"
            error={errors.toCurrency?.message}
            name="toCurrency"
            control={control}
            currencies={availableCurrencies}
          />
          <SelectFormField
            label="Rate source"
            error={errors.provider?.message}
            name="provider"
            control={control}
            options={RATE_PROVIDER_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
          />
        </FieldRow>

        <FormRootError message={errors.root?.message} />

        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Configured fee for</span>
          <Badge variant="outline">{fromCurrency}</Badge>
          <ArrowRightLeftIcon className="size-3.5" />
          <Badge variant="outline">{toCurrency}</Badge>
          <span>:</span>
          <Badge variant="secondary" className="font-mono">
            {selectedFee}
          </Badge>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-fit">
          {isSubmitting ? (
            <>
              <Loader2Icon className="animate-spin" />
              Converting...
            </>
          ) : (
            'Convert'
          )}
        </Button>
      </StackedForm>

      <FormRootError message={submissionError ?? undefined} />

      {result ? <ConversionResultPanel {...result} /> : null}
    </Panel>
  )
}
