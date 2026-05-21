type ConversionResultPanelProps = {
  rateDate: string
  fee: number
  netAmount: number
  rate: number
  convertedAmount: number
  fromCurrency: string
  toCurrency: string
}

export function ConversionResultPanel({
  rateDate,
  fee,
  netAmount,
  rate,
  convertedAmount,
  fromCurrency,
  toCurrency,
}: ConversionResultPanelProps) {
  return (
    <div className="result">
      <h3>Result</h3>
      <dl>
        <div>
          <dt>Rate date</dt>
          <dd>{rateDate}</dd>
        </div>
        <div>
          <dt>Applied fee</dt>
          <dd>{fee}</dd>
        </div>
        <div>
          <dt>Amount after fee</dt>
          <dd>
            {netAmount.toFixed(4)} {fromCurrency}
          </dd>
        </div>
        <div>
          <dt>Exchange rate</dt>
          <dd>{rate.toFixed(6)}</dd>
        </div>
        <div>
          <dt>Converted amount</dt>
          <dd>
            {convertedAmount.toFixed(4)} {toCurrency}
          </dd>
        </div>
      </dl>
    </div>
  )
}
