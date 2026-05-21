import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { ConversionForm } from './ConversionForm'

const meta = {
  title: 'Features/ConversionForm',
  component: ConversionForm,
  tags: ['autodocs'],
  args: {
    getFee: fn((from: string, to: string) => {
      if (from === 'EUR' && to === 'GBP') {
        return 0.01
      }

      if (from === 'GBP' && to === 'USD') {
        return 0.015
      }

      return 0.01
    }),
  },
} satisfies Meta<typeof ConversionForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithCustomFees: Story = {
  args: {
    getFee: fn(() => 0.2),
  },
}
