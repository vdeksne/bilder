import type { Meta, StoryObj } from '@storybook/react-vite'
import { DEFAULT_CURRENCIES } from '../../constants'
import { RhfStoryWrapper } from '../../stories/helpers/RhfStoryWrapper'
import { CurrencyComboboxField } from './CurrencyComboboxField'

const meta = {
  title: 'Form/CurrencyComboboxField',
  component: CurrencyComboboxField,
  tags: ['autodocs'],
} satisfies Meta<typeof CurrencyComboboxField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <RhfStoryWrapper defaultValues={{ from: '' }}>
      {({ control }) => (
        <CurrencyComboboxField
          label="From"
          name="from"
          control={control}
          currencies={DEFAULT_CURRENCIES}
          placeholder="EUR"
        />
      )}
    </RhfStoryWrapper>
  ),
}

export const WithError: Story = {
  render: () => (
    <RhfStoryWrapper defaultValues={{ to: '' }}>
      {({ control }) => (
        <CurrencyComboboxField
          label="To"
          error="Currency is required."
          name="to"
          control={control}
          currencies={DEFAULT_CURRENCIES}
          placeholder="GBP"
        />
      )}
    </RhfStoryWrapper>
  ),
}

export const WithPrefilledValue: Story = {
  render: () => (
    <RhfStoryWrapper defaultValues={{ from: 'USD' }}>
      {({ control }) => (
        <CurrencyComboboxField
          label="From"
          name="from"
          control={control}
          currencies={DEFAULT_CURRENCIES}
        />
      )}
    </RhfStoryWrapper>
  ),
}
