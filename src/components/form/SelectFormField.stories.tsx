import type { Meta, StoryObj } from '@storybook/react-vite'
import { RATE_PROVIDER_OPTIONS } from '../../constants'
import { RhfStoryWrapper } from '../../stories/helpers/RhfStoryWrapper'
import { SelectFormField } from './SelectFormField'

const meta = {
  title: 'Form/SelectFormField',
  component: SelectFormField,
  tags: ['autodocs'],
} satisfies Meta<typeof SelectFormField>

export default meta
type Story = StoryObj<typeof meta>

export const RateProvider: Story = {
  render: () => (
    <RhfStoryWrapper defaultValues={{ provider: 'ecb' }}>
      {(register) => (
        <SelectFormField
          label="Rate source"
          registration={register('provider')}
          options={RATE_PROVIDER_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
        />
      )}
    </RhfStoryWrapper>
  ),
}

export const WithError: Story = {
  render: () => (
    <RhfStoryWrapper defaultValues={{ provider: 'ecb' }}>
      {(register) => (
        <SelectFormField
          label="Rate source"
          error="Rate source is required."
          registration={register('provider')}
          options={RATE_PROVIDER_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
        />
      )}
    </RhfStoryWrapper>
  ),
}
