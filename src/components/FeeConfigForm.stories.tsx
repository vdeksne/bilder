import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { FeeConfigForm } from './FeeConfigForm'

const sampleFees = [
  { id: 'fee-eur-gbp', from: 'EUR', to: 'GBP', fee: 0.01 },
  { id: 'fee-gbp-eur', from: 'GBP', to: 'EUR', fee: 0.02 },
]

const meta = {
  title: 'Features/FeeConfigForm',
  component: FeeConfigForm,
  tags: ['autodocs'],
  args: {
    fees: sampleFees,
    onUpsertFee: fn(),
    onRemoveFee: fn(),
  },
} satisfies Meta<typeof FeeConfigForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = {
  args: {
    fees: [],
  },
}
