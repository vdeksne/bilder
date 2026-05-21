import type { Meta, StoryObj } from '@storybook/react-vite'
import { RhfStoryWrapper } from '../../stories/helpers/RhfStoryWrapper'
import { TextFormField } from './TextFormField'

const meta = {
  title: 'Form/TextFormField',
  component: TextFormField,
  tags: ['autodocs'],
} satisfies Meta<typeof TextFormField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <RhfStoryWrapper defaultValues={{ from: '' }}>
      {(register) => (
        <TextFormField
          label="From"
          registration={register('from')}
          placeholder="EUR"
          maxLength={3}
        />
      )}
    </RhfStoryWrapper>
  ),
}

export const WithError: Story = {
  render: () => (
    <RhfStoryWrapper defaultValues={{ fee: '' }}>
      {(register) => (
        <TextFormField
          label="Fee"
          error="Fee must be a non-negative number."
          registration={register('fee')}
          placeholder="0.01"
          inputMode="decimal"
        />
      )}
    </RhfStoryWrapper>
  ),
}

export const DecimalAmount: Story = {
  render: () => (
    <RhfStoryWrapper defaultValues={{ amount: 100 }}>
      {(register) => (
        <TextFormField
          label="Amount"
          registration={register('amount', { valueAsNumber: true })}
          inputMode="decimal"
          step="any"
        />
      )}
    </RhfStoryWrapper>
  ),
}
