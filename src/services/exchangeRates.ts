import type { ExchangeRates, RateProvider } from '../types'

function parseXml(xml: string): Document {
  const doc = new DOMParser().parseFromString(xml, 'text/xml')

  if (doc.querySelector('parsererror')) {
    throw new Error('Failed to parse exchange rate XML response')
  }

  return doc
}

function parseEcbXml(xml: string): ExchangeRates {
  const doc = parseXml(xml)
  const cubes = Array.from(doc.getElementsByTagName('Cube'))
  const rates: ExchangeRates['rates'] = {}
  let date = ''

  for (const cube of cubes) {
    const time = cube.getAttribute('time')
    const currency = cube.getAttribute('currency')
    const rate = cube.getAttribute('rate')

    if (time && !currency) {
      date = time
    }

    if (currency && rate) {
      rates[currency] = Number.parseFloat(rate)
    }
  }

  if (!date || Object.keys(rates).length === 0) {
    throw new Error('ECB response did not contain exchange rates')
  }

  return { date, rates }
}

function parseBolXml(xml: string): ExchangeRates {
  const doc = parseXml(xml)
  const fxRates = Array.from(doc.getElementsByTagName('FxRate'))
  const rates: ExchangeRates['rates'] = {}
  let date = ''

  for (const fxRate of fxRates) {
    const ccyAmts = Array.from(fxRate.getElementsByTagName('CcyAmt'))
    let quoteCurrency = ''
    let quoteAmount = 0

    for (const ccyAmt of ccyAmts) {
      const currency = ccyAmt.getElementsByTagName('Ccy')[0]?.textContent?.trim()
      const amountText = ccyAmt.getElementsByTagName('Amt')[0]?.textContent?.trim()
      const amount = Number.parseFloat(amountText ?? '')

      if (!currency || Number.isNaN(amount)) {
        continue
      }

      if (currency === 'EUR') {
        continue
      }

      quoteCurrency = currency
      quoteAmount = amount
    }

    if (quoteCurrency) {
      rates[quoteCurrency] = quoteAmount
    }

    const rateDate = fxRate.getElementsByTagName('Dt')[0]?.textContent?.trim()
    if (rateDate) {
      date = rateDate
    }
  }

  if (!date || Object.keys(rates).length === 0) {
    throw new Error('Bank of Lithuania response did not contain exchange rates')
  }

  return { date, rates }
}

export async function fetchExchangeRates(
  provider: RateProvider,
): Promise<ExchangeRates> {
  const url =
    provider === 'ecb'
      ? '/api/ecb/eurofxref-daily.xml'
      : '/api/bol/FxRates.asmx/getCurrentFxRates?tp=EU'

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch exchange rates (${response.status})`)
  }

  const xml = await response.text()

  return provider === 'ecb' ? parseEcbXml(xml) : parseBolXml(xml)
}
