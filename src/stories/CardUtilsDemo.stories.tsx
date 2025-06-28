import type { Meta, StoryObj } from '@storybook/react';
import CardUtilsDemo from './CardUtilsDemo';

const meta = {
  component: CardUtilsDemo,
  title: 'Card Utilities Demo',
  tags: ['autodocs'],
} satisfies Meta<typeof CardUtilsDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Demo: Story = {
  args: {},
};
