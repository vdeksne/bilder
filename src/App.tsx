import { ConversionForm } from './components/ConversionForm'
import { FeeConfigForm } from './components/FeeConfigForm'
import { useConversionFees } from './hooks/useConversionFees'
import './App.css'

function App() {
  const { fees, getFee, upsertFee, removeFee } = useConversionFees()

  return (
    <main className="app">
      <header>
        <h1>Currency Conversion Service</h1>
        <p>
          Configure direction-specific conversion fees and calculate cross-currency
          conversions using ECB or Bank of Lithuania reference rates.
        </p>
      </header>

      <FeeConfigForm
        fees={fees}
        onUpsertFee={upsertFee}
        onRemoveFee={removeFee}
      />
      <ConversionForm getFee={getFee} />
    </main>
  )
}

export default App
