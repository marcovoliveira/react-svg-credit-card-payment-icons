import *  as FlatRounded from '../icons/flat-rounded/components/index';
import type { Meta, StoryObj } from '@storybook/react';
import CustomGrid from './CustomGrid';

const meta = {
  component: CustomGrid,
  title: 'Payment Cards',
  tags: ['autodocs'],
} satisfies Meta<typeof CustomGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Card: Story  = {
  args: {
    Components: FlatRounded,
  },
};

