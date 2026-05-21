import type { Meta, StoryObj } from '@storybook/react-vite'
import { DEFAULT_CURRENCIES } from '../../constants'
import { RhfStoryWrapper } from '../../stories/helpers/RhfStoryWrapper'
import { CurrencySelectField } from './CurrencySelectField'

const meta = {
  title: 'Form/CurrencySelectField',
  component: CurrencySelectField,
  tags: ['autodocs'],
} satisfies Meta<typeof CurrencySelectField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <RhfStoryWrapper defaultValues={{ fromCurrency: 'EUR' }}>
      {(register) => (
        <CurrencySelectField
          label="From"
          registration={register('fromCurrency')}
          currencies={DEFAULT_CURRENCIES}
        />
      )}
    </RhfStoryWrapper>
  ),
}

export const WithError: Story = {
  render: () => (
    <RhfStoryWrapper defaultValues={{ toCurrency: 'EUR' }}>
      {(register) => (
        <CurrencySelectField
          label="To"
          error="Source and target currency must be different."
          registration={register('toCurrency')}
          currencies={DEFAULT_CURRENCIES}
        />
      )}
    </RhfStoryWrapper>
  ),
}
