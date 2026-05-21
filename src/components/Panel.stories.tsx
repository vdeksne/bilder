import type { Meta, StoryObj } from '@storybook/react-vite'
import { Panel } from './Panel'

const meta = {
  title: 'Layout/Panel',
  component: Panel,
  tags: ['autodocs'],
  args: {
    title: 'Conversion Fees',
    description:
      'Fees are direction-specific fractions. For example, enter 0.2 for a 20% fee.',
  },
} satisfies Meta<typeof Panel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: <p>Panel content goes here.</p>,
  },
}

export const WithFormContent: Story = {
  args: {
    title: 'Currency Conversion',
    description: (
      <>
        The fee is deducted before conversion using the formula{' '}
        <code>(amount - amount * fee) * rate</code>.
      </>
    ),
    children: (
      <form className="stacked-form">
        <div className="field-row">
          <label>
            Amount
            <input defaultValue="100" />
          </label>
        </div>
        <button type="button">Convert</button>
      </form>
    ),
  },
}
