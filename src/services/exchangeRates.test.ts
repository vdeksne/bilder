// @vitest-environment happy-dom

import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  fetchExchangeRates,
  parseBolXml,
  parseEcbXml,
} from './exchangeRates'

const ecbXml = `<?xml version="1.0" encoding="UTF-8"?>
<gesmes:Envelope xmlns:gesmes="http://www.gesmes.org/xml/2002-08-01">
  <Cube>
    <Cube time="2026-05-21">
      <Cube currency="GBP" rate="0.85000"/>
      <Cube currency="USD" rate="1.08000"/>
    </Cube>
  </Cube>
</gesmes:Envelope>`

const bolXml = `<?xml version="1.0" encoding="UTF-8"?>
<FxRates>
  <FxRate>
    <CcyAmt><Ccy>EUR</Ccy><Amt>1</Amt></CcyAmt>
    <CcyAmt><Ccy>GBP</Ccy><Amt>0.85000</Amt></CcyAmt>
    <Dt>2026-05-21</Dt>
  </FxRate>
  <FxRate>
    <CcyAmt><Ccy>EUR</Ccy><Amt>1</Amt></CcyAmt>
    <CcyAmt><Ccy>USD</Ccy><Amt>1.08000</Amt></CcyAmt>
    <Dt>2026-05-21</Dt>
  </FxRate>
</FxRates>`

describe('parseEcbXml', () => {
  it('extracts the date and currency rates', () => {
    expect(parseEcbXml(ecbXml)).toEqual({
      date: '2026-05-21',
      rates: {
        GBP: 0.85,
        USD: 1.08,
      },
    })
  })

  it('throws when the response has no rates', () => {
    expect(() => parseEcbXml('<Cube></Cube>')).toThrow(
      'ECB response did not contain exchange rates',
    )
  })

  it('throws when the XML is malformed', () => {
    expect(() => parseEcbXml('<not-xml')).toThrow(
      'Failed to parse exchange rate XML response',
    )
  })
})

describe('parseBolXml', () => {
  it('extracts the date and currency rates', () => {
    expect(parseBolXml(bolXml)).toEqual({
      date: '2026-05-21',
      rates: {
        GBP: 0.85,
        USD: 1.08,
      },
    })
  })

  it('throws when the response has no rates', () => {
    expect(() => parseBolXml('<FxRates></FxRates>')).toThrow(
      'Bank of Lithuania response did not contain exchange rates',
    )
  })
})

describe('fetchExchangeRates', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches and parses ECB rates', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => ecbXml,
      }),
    )

    await expect(fetchExchangeRates('ecb')).resolves.toEqual({
      date: '2026-05-21',
      rates: {
        GBP: 0.85,
        USD: 1.08,
      },
    })

    expect(fetch).toHaveBeenCalledWith('/api/ecb/eurofxref-daily.xml')
  })

  it('throws when the HTTP response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
      }),
    )

    await expect(fetchExchangeRates('bol')).rejects.toThrow(
      'Failed to fetch exchange rates (503)',
    )
  })
})
