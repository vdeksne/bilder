import { ArrowRightLeftIcon } from 'lucide-react'
import { ConversionForm } from './components/ConversionForm'
import { FeeConfigForm } from './components/FeeConfigForm'
import { useConversionFees } from './hooks/useConversionFees'

function App() {
  const { fees, getFee, upsertFee, removeFee } = useConversionFees()

  return (
    <div className="min-h-svh bg-muted/40">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <header className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <ArrowRightLeftIcon className="size-5" />
            <span className="text-sm font-medium">Reference rates</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Currency Conversion Service
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Configure direction-specific conversion fees and calculate
            cross-currency conversions using ECB or Bank of Lithuania reference
            rates.
          </p>
        </header>

        <FeeConfigForm
          fees={fees}
          onUpsertFee={upsertFee}
          onRemoveFee={removeFee}
        />
        <ConversionForm getFee={getFee} />
      </main>
    </div>
  )
}

export default App
