import { yupResolver } from '@hookform/resolvers/yup'
import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { DEFAULT_CURRENCIES, RATE_PROVIDER_OPTIONS } from '../constants'
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

type ConversionState = ConversionResult & {
  rateDate: string
  fromCurrency: string
  toCurrency: string
}

const defaultValues: ConversionFormValues = {
  amount: 100,
  fromCurrency: 'EUR',
  toCurrency: 'GBP',
  provider: 'ecb',
}

export function ConversionForm({ getFee }: ConversionFormProps) {
  const [availableCurrencies, setAvailableCurrencies] =
    useState<string[]>(DEFAULT_CURRENCIES)
  const [result, setResult] = useState<ConversionState | null>(null)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

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
    setSubmissionError(null)
    setResult(null)

    try {
      const exchangeRates = await fetchExchangeRates(values.provider)
      const currencies = getSupportedCurrencies(exchangeRates.rates)

      setAvailableCurrencies(currencies)

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

      setResult({
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
      setSubmissionError(message)
    }
  })

  return (
    <Panel
      title="Currency Conversion"
      description={
        <>
          The fee is deducted before conversion using the formula{' '}
          <code>(amount - amount * fee) * rate</code>. Unconfigured pairs use a
          default fee of 0.01.
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
            registration={register('fromCurrency')}
            currencies={availableCurrencies}
          />
          <CurrencySelectField
            label="To"
            error={errors.toCurrency?.message}
            registration={register('toCurrency')}
            currencies={availableCurrencies}
          />
          <SelectFormField
            label="Rate source"
            error={errors.provider?.message}
            registration={register('provider')}
            options={RATE_PROVIDER_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
          />
        </FieldRow>

        <FormRootError message={errors.root?.message} />

        <p className="meta">
          Configured fee for {fromCurrency} to {toCurrency}: {selectedFee}
        </p>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Converting...' : 'Convert'}
        </button>
      </StackedForm>

      <FormRootError message={submissionError ?? undefined} />

      {result ? <ConversionResultPanel {...result} /> : null}
    </Panel>
  )
}
