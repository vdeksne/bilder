import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { fetchExchangeRates } from '../services/exchangeRates'
import type { ConversionResult, RateProvider } from '../types'
import { convertAmount, getSupportedCurrencies } from '../utils/conversion'

type ConversionFormProps = {
  getFee: (from: string, to: string) => number
}

type ConversionState = {
  convertedAmount: number
  netAmount: number
  rate: number
  fee: number
  rateDate: string
}

export function ConversionForm({ getFee }: ConversionFormProps) {
  const [amount, setAmount] = useState('100')
  const [fromCurrency, setFromCurrency] = useState('EUR')
  const [toCurrency, setToCurrency] = useState('GBP')
  const [provider, setProvider] = useState<RateProvider>('ecb')
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([
    'EUR',
    'GBP',
    'USD',
  ])
  const [result, setResult] = useState<ConversionState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const selectedFee = useMemo(
    () => getFee(fromCurrency, toCurrency),
    [fromCurrency, getFee, toCurrency],
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setResult(null)

    const parsedAmount = Number.parseFloat(amount)

    if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
      setError('Amount must be a non-negative number.')
      return
    }

    if (fromCurrency === toCurrency) {
      setError('Source and target currency must be different.')
      return
    }

    setIsLoading(true)

    try {
      const exchangeRates = await fetchExchangeRates(provider)
      const currencies = getSupportedCurrencies(exchangeRates.rates)

      setAvailableCurrencies(currencies)

      if (!currencies.includes(fromCurrency) || !currencies.includes(toCurrency)) {
        throw new Error(
          `Unsupported currency pair: ${fromCurrency} to ${toCurrency}`,
        )
      }

      const conversion: ConversionResult = convertAmount(
        parsedAmount,
        fromCurrency,
        toCurrency,
        exchangeRates.rates,
        selectedFee,
      )

      setResult({
        ...conversion,
        rateDate: exchangeRates.date,
      })
    } catch (conversionError) {
      const message =
        conversionError instanceof Error
          ? conversionError.message
          : 'Conversion failed.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="panel">
      <h2>Currency Conversion</h2>
      <p className="hint">
        The fee is deducted before conversion using the formula{' '}
        <code>(amount - amount * fee) * rate</code>. Unconfigured pairs use a
        default fee of 0.01.
      </p>

      <form className="stacked-form" onSubmit={handleSubmit}>
        <div className="field-row">
          <label>
            Amount
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              inputMode="decimal"
            />
          </label>
          <label>
            From
            <select
              value={fromCurrency}
              onChange={(event) => setFromCurrency(event.target.value)}
            >
              {availableCurrencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </label>
          <label>
            To
            <select
              value={toCurrency}
              onChange={(event) => setToCurrency(event.target.value)}
            >
              {availableCurrencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </label>
          <label>
            Rate source
            <select
              value={provider}
              onChange={(event) =>
                setProvider(event.target.value as RateProvider)
              }
            >
              <option value="ecb">ECB</option>
              <option value="bol">Bank of Lithuania</option>
            </select>
          </label>
        </div>

        <p className="meta">
          Configured fee for {fromCurrency} to {toCurrency}: {selectedFee}
        </p>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Converting...' : 'Convert'}
        </button>
      </form>

      {error ? <p className="error">{error}</p> : null}

      {result ? (
        <div className="result">
          <h3>Result</h3>
          <dl>
            <div>
              <dt>Rate date</dt>
              <dd>{result.rateDate}</dd>
            </div>
            <div>
              <dt>Applied fee</dt>
              <dd>{result.fee}</dd>
            </div>
            <div>
              <dt>Amount after fee</dt>
              <dd>
                {result.netAmount.toFixed(4)} {fromCurrency}
              </dd>
            </div>
            <div>
              <dt>Exchange rate</dt>
              <dd>{result.rate.toFixed(6)}</dd>
            </div>
            <div>
              <dt>Converted amount</dt>
              <dd>
                {result.convertedAmount.toFixed(4)} {toCurrency}
              </dd>
            </div>
          </dl>
        </div>
      ) : null}
    </section>
  )
}
