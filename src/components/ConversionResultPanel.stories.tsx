import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConversionResultPanel } from './ConversionResultPanel'

const meta = {
  title: 'Features/ConversionResultPanel',
  component: ConversionResultPanel,
  tags: ['autodocs'],
  args: {
    rateDate: '2026-05-21',
    fee: 0.01,
    netAmount: 99,
    rate: 0.86433,
    convertedAmount: 85.5687,
    fromCurrency: 'EUR',
    toCurrency: 'GBP',
  },
} satisfies Meta<typeof ConversionResultPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const GbpToUsd: Story = {
  args: {
    fee: 0.015,
    netAmount: 98.5,
    rate: 1.34189,
    convertedAmount: 132.1762,
    fromCurrency: 'GBP',
    toCurrency: 'USD',
  },
}
