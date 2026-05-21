import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { FeeTable } from './FeeTable'

const sampleFees = [
  { id: 'fee-eur-gbp', from: 'EUR', to: 'GBP', fee: 0.01 },
  { id: 'fee-eur-usd', from: 'EUR', to: 'USD', fee: 0.02 },
  { id: 'fee-gbp-usd', from: 'GBP', to: 'USD', fee: 0.015 },
]

const meta = {
  title: 'Features/FeeTable',
  component: FeeTable,
  tags: ['autodocs'],
  args: {
    onEdit: fn(),
    onRemove: fn(),
  },
} satisfies Meta<typeof FeeTable>

export default meta
type Story = StoryObj<typeof meta>

export const WithFees: Story = {
  args: {
    fees: sampleFees,
  },
}

export const Empty: Story = {
  args: {
    fees: [],
  },
}
