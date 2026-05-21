import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormRootError } from './FormRootError'

const meta = {
  title: 'Form/FormRootError',
  component: FormRootError,
  tags: ['autodocs'],
} satisfies Meta<typeof FormRootError>

export default meta
type Story = StoryObj<typeof meta>

export const Hidden: Story = {
  args: {
    message: undefined,
  },
}

export const Visible: Story = {
  args: {
    message: 'Source and target currency must be different.',
  },
}

export const SubmissionError: Story = {
  args: {
    message: 'Failed to fetch exchange rates (503).',
  },
}
