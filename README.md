# Currency Conversion Service

A client-side React application for configuring direction-specific currency conversion fees and calculating conversions using live reference rates from the ECB or the Bank of Lithuania.

## Features

- Add, edit, and remove conversion fees for specific currency pairs and directions
- Persist configured fees in `localStorage`
- Convert between any supported currency using EUR-based cross rates
- Fetch latest rates from:
  - ECB: `eurofxref-daily.xml`
  - Bank of Lithuania: `getCurrentFxRates?tp=EU`
- Apply configured fees before conversion using `(amount - amount * fee) * rate`
- Use a default fee of `0.01` when no fee is configured for a pair

## Tech Stack

- React
- TypeScript
- Vite
- Vitest
- Storybook

## Prerequisites

- Node.js 18 or newer
- npm

## Setup

Install dependencies:

```bash
npm install
```

## Run the Development Server

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:3000`). The browser opens automatically.

The Vite dev server proxies external rate requests to avoid browser CORS restrictions:

- `/api/ecb/*` -> `https://www.ecb.europa.eu/stats/eurofxref/*`
- `/api/bol/*` -> `https://www.lb.lt/webservices/FxRates/*`

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Tests

Unit tests use [Vitest](https://vitest.dev/) and cover the core business logic:

- **Conversion math** — cross rates, fee deduction, supported currencies
- **Form validation** — fee and conversion Yup schemas
- **Fee persistence** — reading, filtering, upserting, and removing stored fees
- **Rate parsing** — ECB and Bank of Lithuania XML parsing (with mocked HTTP for fetch)

Run all unit tests:

```bash
npm test
```

Run unit tests in watch mode while developing:

```bash
npm run test:watch
```

Run Storybook browser tests (requires Playwright):

```bash
npm run test:storybook
```

Test files live next to the code they exercise:

```text
src/utils/conversion.test.ts
src/utils/feesStorage.test.ts
src/validation/schemas.test.ts
src/services/exchangeRates.test.ts
```

## Storybook

Run the component library locally:

```bash
npm run storybook
```

Open `http://localhost:6006`.

Build a static Storybook site:

```bash
npm run build-storybook
```

Stories are grouped as:

- `Pages/App` — full application
- `Features/*` — fee table, forms, conversion result
- `Form/*` — reusable form primitives
- `Layout/Panel` — panel wrapper

Storybook uses the same ECB/BoL proxy as the app, so live conversion works inside stories too.

## Usage

### Configure Fees

1. Enter a source currency, target currency, and fee fraction.
2. Click **Add Fee** or **Save Fee** when editing an existing entry.
3. Fees are direction-specific. For example, `EUR -> GBP` and `GBP -> EUR` are separate entries.

Example: a fee of `0.2` means 20%.

Configured fees are stored in the browser under the key `currency-conversion-fees`.

### Convert Currency

1. Enter the amount to convert.
2. Choose the source and target currencies.
3. Choose a rate source (`ECB` or `Bank of Lithuania`).
4. Click **Convert**.

The app:

1. Fetches the latest XML rates from the selected provider
2. Looks up the configured fee for the selected direction
3. Deducts the fee from the amount
4. Derives the cross rate through EUR when needed
5. Displays the converted amount and calculation details

## Project Structure

```text
src/
  components/
    ConversionForm.tsx
    FeeConfigForm.tsx
  hooks/
    useConversionFees.ts
  services/
    exchangeRates.ts
  utils/
    conversion.ts
    feesStorage.ts
  validation/
    schemas.ts
  App.tsx
  constants.ts
  types.ts
```

## Notes

- Both rate providers return XML, which is parsed in the browser with `DOMParser`.
- Rates are EUR-based. Cross-currency conversion is calculated as `toRate / fromRate`.
- The app is fully client-side. Only the dev-server proxy is used during local development to reach the external XML endpoints.
