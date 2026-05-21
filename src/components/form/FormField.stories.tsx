import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormField } from './FormField'

const meta = {
  title: 'Form/FormField',
  component: FormField,
  tags: ['autodocs'],
  args: {
    label: 'From',
  },
} satisfies Meta<typeof FormField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: <input placeholder="EUR" maxLength={3} />,
  },
}

export const WithError: Story = {
  args: {
    error: 'Currency must be a 3-letter ISO code.',
    children: <input placeholder="EURO" aria-invalid />,
  },
}
