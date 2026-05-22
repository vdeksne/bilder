import type { ExchangeRates, RateProvider } from '../types'

const CACHE_TTL_MS = 15 * 60 * 1000

type CachedExchangeRates = ExchangeRates & {
  fetchedAt: number
}

const exchangeRateCache = new Map<RateProvider, CachedExchangeRates>()
const inFlightRequests = new Map<RateProvider, Promise<ExchangeRates>>()

function getElementText(parent: Element, tagName: string): string | null {
  return parent.getElementsByTagName(tagName)[0]?.textContent?.trim() ?? null
}

function readCachedExchangeRates(provider: RateProvider): ExchangeRates | null {
  const cachedRates = exchangeRateCache.get(provider)

  if (!cachedRates) {
    return null
  }

  if (Date.now() - cachedRates.fetchedAt > CACHE_TTL_MS) {
    exchangeRateCache.delete(provider)
    return null
  }

  return {
    date: cachedRates.date,
    rates: cachedRates.rates,
  }
}

function writeCachedExchangeRates(
  provider: RateProvider,
  exchangeRates: ExchangeRates,
): ExchangeRates {
  exchangeRateCache.set(provider, {
    ...exchangeRates,
    fetchedAt: Date.now(),
  })

  return exchangeRates
}

function parseXml(xml: string): Document {
  const doc = new DOMParser().parseFromString(xml, 'text/xml')

  if (doc.querySelector('parsererror')) {
    throw new Error('Failed to parse exchange rate XML response')
  }

  return doc
}

export function parseEcbXml(xml: string): ExchangeRates {
  const doc = parseXml(xml)
  const date = doc.querySelector('Cube[time]')?.getAttribute('time') ?? ''
  const rateCubes = Array.from(doc.querySelectorAll('Cube[currency][rate]'))
  const rates: ExchangeRates['rates'] = {}

  for (const cube of rateCubes) {
    const currency = cube.getAttribute('currency')
    const rate = cube.getAttribute('rate')

    if (currency && rate) {
      rates[currency] = Number.parseFloat(rate)
    }
  }

  if (!date || Object.keys(rates).length === 0) {
    throw new Error('ECB response did not contain exchange rates')
  }

  return { date, rates }
}

export function parseBolXml(xml: string): ExchangeRates {
  const doc = parseXml(xml)
  const fxRates = Array.from(doc.getElementsByTagName('FxRate'))
  const rates: ExchangeRates['rates'] = {}
  let date = ''

  for (const fxRate of fxRates) {
    const quoteCurrencyEntry = Array.from(fxRate.getElementsByTagName('CcyAmt')).find(
      (ccyAmt) => getElementText(ccyAmt, 'Ccy') !== 'EUR',
    )

    if (quoteCurrencyEntry) {
      const currency = getElementText(quoteCurrencyEntry, 'Ccy')
      const amountText = getElementText(quoteCurrencyEntry, 'Amt')
      const amount = Number.parseFloat(amountText ?? '')

      if (currency && !Number.isNaN(amount)) {
        rates[currency] = amount
      }
    }

    const rateDate = getElementText(fxRate, 'Dt')
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
  const cachedRates = readCachedExchangeRates(provider)

  if (cachedRates) {
    return cachedRates
  }

  const existingRequest = inFlightRequests.get(provider)

  if (existingRequest) {
    return existingRequest
  }

  const url =
    provider === 'ecb'
      ? '/api/ecb/eurofxref-daily.xml'
      : '/api/bol/FxRates.asmx/getCurrentFxRates?tp=EU'

  const request = (async () => {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates (${response.status})`)
    }

    const xml = await response.text()
    const exchangeRates = provider === 'ecb' ? parseEcbXml(xml) : parseBolXml(xml)

    return writeCachedExchangeRates(provider, exchangeRates)
  })()

  inFlightRequests.set(provider, request)

  try {
    return await request
  } finally {
    inFlightRequests.delete(provider)
  }
}
