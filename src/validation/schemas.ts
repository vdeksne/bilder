import { yupResolver } from '@hookform/resolvers/yup'
import type { Resolver } from 'react-hook-form'
import * as yup from 'yup'
import { createFeeId } from '../utils/feesStorage'
import { currencyCodePattern, normalizeCurrency } from './currency'

const currencyCodeSchema = yup
  .string()
  .trim()
  .required('Currency is required.')
  .transform(normalizeCurrency)
  .matches(currencyCodePattern, 'Currency must be a 3-letter ISO code.')

const differentCurrenciesMessage =
  'Source and target currency must be different.'

export type FeeFormValues = {
  from: string
  to: string
  fee: string
}

export const feeFormSchema: yup.ObjectSchema<FeeFormValues> = yup.object({
  from: currencyCodeSchema,
  to: currencyCodeSchema.test(
    'different-currencies',
    differentCurrenciesMessage,
    function (value) {
      const from = this.parent.from as string | undefined

      if (!from || !value) {
        return true
      }

      return from !== value
    },
  ),
  fee: yup
    .string()
    .required('Fee is required.')
    .test('valid-fee', 'Fee must be a non-negative number.', (value) => {
      const fee = Number.parseFloat(value ?? '')

      return !Number.isNaN(fee) && fee >= 0
    }),
})

export const feeFormResolver: Resolver<FeeFormValues> =
  yupResolver(feeFormSchema)

export type ConversionFormValues = {
  amount: number
  fromCurrency: string
  toCurrency: string
  provider: 'ecb' | 'bol'
}

export const conversionFormSchema: yup.ObjectSchema<ConversionFormValues> =
  yup.object({
    amount: yup
      .number()
      .transform((_value, originalValue) => {
        if (originalValue === '' || originalValue === null) {
          return undefined
        }

        return Number(originalValue)
      })
      .typeError('Amount must be a number.')
      .required('Amount is required.')
      .min(0, 'Amount must be a non-negative number.'),
    fromCurrency: yup.string().required('Source currency is required.'),
    toCurrency: yup.string().required('Target currency is required.'),
    provider: yup
      .string()
      .oneOf(['ecb', 'bol'], 'Rate source is required.')
      .required('Rate source is required.'),
  }).test('different-currencies', differentCurrenciesMessage, (value) => {
    if (!value?.fromCurrency || !value?.toCurrency) {
      return true
    }

    return value.fromCurrency !== value.toCurrency
  })

export function toConversionFee(values: FeeFormValues, id?: string) {
  return {
    id: id ?? createFeeId(),
    from: values.from,
    to: values.to,
    fee: Number.parseFloat(values.fee),
  }
}
