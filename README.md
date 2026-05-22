# Bilder

Configure per-direction conversion fees, then convert amounts using live reference rates from the ECB or the Bank of Lithuania. The UI is client-only: fees live in `localStorage`, rates are fetched as XML and parsed in the browser.

Node 18+ and npm.

```bash
npm install
npm run dev          # http://localhost:3000 (opens automatically)
npm run build
npm run lint
npm test             # unit tests (Vitest)
npm run test:watch
npm run storybook    # http://localhost:6006
npm run build-storybook
npm run test:storybook   # Storybook + Playwright; install browsers first if needed
```

## Dev proxy

`npm run dev` proxies rate requests so the browser is not blocked by CORS:

- `/api/ecb/*` → `https://www.ecb.europa.eu/stats/eurofxref/*` (e.g. `eurofxref-daily.xml`)
- `/api/bol/*` → `https://www.lb.lt/webservices/FxRates/*` (e.g. `getCurrentFxRates?tp=EU`)

Storybook uses the same paths, so conversion in stories hits real endpoints too.

## Using the app

**Fees.** Set source currency, target currency, and a fee fraction, then add or save. `EUR → GBP` and `GBP → EUR` are separate rows. A fee of `0.2` is 20%. Stored under `currency-conversion-fees`. If nothing matches the pair, the app uses `0.01`.

**Convert.** Enter an amount, pick currencies and a rate source (ECB or Bank of Lithuania), then convert. The fee is taken off the amount first, then the cross rate is applied (rates are EUR-based; non-EUR pairs use `toRate / fromRate`).

Formula: `(amount - amount * fee) * rate`.

## Code layout

Rough map of `src/`:

- `components/` — forms, fee table, result panel
- `hooks/` — fee list state, conversion submit flow
- `services/` — fetch and parse ECB / BoL XML
- `utils/` — conversion math and `localStorage` helpers
- `validation/` — Yup schemas for fees and conversion

Tests sit beside the modules they cover (`*.test.ts`).
