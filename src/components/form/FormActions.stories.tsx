import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormActions } from './FormActions'

const meta = {
  title: 'Form/FormActions',
  component: FormActions,
  tags: ['autodocs'],
} satisfies Meta<typeof FormActions>

export default meta
type Story = StoryObj<typeof meta>

export const AddFee: Story = {
  args: {
    children: <button type="submit">Add Fee</button>,
  },
}

export const EditFee: Story = {
  args: {
    children: (
      <>
        <button type="submit">Save Fee</button>
        <button type="button">Cancel</button>
      </>
    ),
  },
}

export const TableActions: Story = {
  args: {
    children: (
      <>
        <button type="button">Edit</button>
        <button type="button" className="danger">
          Remove
        </button>
      </>
    ),
  },
}
