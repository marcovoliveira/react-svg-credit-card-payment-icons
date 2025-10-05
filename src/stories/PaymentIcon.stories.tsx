import *  as FlatRounded from '../../generated/icons/flat-rounded';
import type { Meta, StoryObj } from '@storybook/react';
import CustomGrid from './CustomGrid';

// Add Amex as an alias for Americanexpress and sort alphabetically
const componentsWithAmex = {
  ...FlatRounded,
  Amex: FlatRounded.Americanexpress,
};

const ComponentsWithAliases = Object.fromEntries(
  Object.entries(componentsWithAmex).sort(([a], [b]) => a.localeCompare(b))
) as typeof componentsWithAmex;

const meta = {
  component: CustomGrid,
  title: 'Payment Cards',
  tags: ['autodocs'],
} satisfies Meta<typeof CustomGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Card: Story  = {
  args: {
    Components: ComponentsWithAliases,
  },
};

