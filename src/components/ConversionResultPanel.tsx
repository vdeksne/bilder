import { ArrowRightIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

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
    <div className="rounded-lg border bg-muted/30 p-4">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-medium">Conversion result</h3>
        <Badge variant="outline">{rateDate}</Badge>
      </div>

      <div className="mb-4 flex flex-wrap items-baseline gap-2">
        <span className="text-3xl font-semibold tracking-tight">
          {convertedAmount.toFixed(4)}
        </span>
        <span className="text-lg text-muted-foreground">{toCurrency}</span>
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <ArrowRightIcon className="size-3.5" />
          from {fromCurrency}
        </span>
      </div>

      <Separator className="my-4" />

      <dl className="grid gap-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Applied fee</dt>
          <dd className="font-mono">{fee}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Amount after fee</dt>
          <dd className="font-mono">
            {netAmount.toFixed(4)} {fromCurrency}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Exchange rate</dt>
          <dd className="font-mono">{rate.toFixed(6)}</dd>
        </div>
      </dl>
    </div>
  )
}
