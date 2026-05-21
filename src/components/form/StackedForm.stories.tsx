import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { FieldRow } from './FieldRow'
import { FormActions } from './FormActions'
import { StackedForm } from './StackedForm'

const meta = {
  title: 'Form/StackedForm',
  component: StackedForm,
  tags: ['autodocs'],
  args: {
    onSubmit: fn((event) => event.preventDefault()),
  },
} satisfies Meta<typeof StackedForm>

export default meta
type Story = StoryObj<typeof meta>

export const FeeFormExample: Story = {
  args: {
    children: (
      <>
        <h3>Add Fee</h3>
        <FieldRow>
          <label>
            From
            <input placeholder="EUR" />
          </label>
          <label>
            To
            <input placeholder="GBP" />
          </label>
          <label>
            Fee
            <input placeholder="0.01" />
          </label>
        </FieldRow>
        <FormActions>
          <button type="submit">Add Fee</button>
        </FormActions>
      </>
    ),
  },
}
