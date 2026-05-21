import type { Meta, StoryObj } from '@storybook/react-vite'
import { FieldRow } from './FieldRow'

const meta = {
  title: 'Form/FieldRow',
  component: FieldRow,
  tags: ['autodocs'],
} satisfies Meta<typeof FieldRow>

export default meta
type Story = StoryObj<typeof meta>

export const ThreeFields: Story = {
  args: {
    children: (
      <>
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
      </>
    ),
  },
}

export const FourFields: Story = {
  args: {
    children: (
      <>
        <label>
          Amount
          <input defaultValue="100" />
        </label>
        <label>
          From
          <select defaultValue="EUR">
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </label>
        <label>
          To
          <select defaultValue="GBP">
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </label>
        <label>
          Rate source
          <select defaultValue="ecb">
            <option value="ecb">ECB</option>
            <option value="bol">Bank of Lithuania</option>
          </select>
        </label>
      </>
    ),
  },
}
