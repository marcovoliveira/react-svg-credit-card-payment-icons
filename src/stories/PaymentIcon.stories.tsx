import React from 'react';
import * as Flat from '../../generated/icons/flat';
import * as FlatRounded from '../../generated/icons/flat-rounded';
import * as Logo from '../../generated/icons/logo';
import * as LogoBorder from '../../generated/icons/logo-border';
import * as Mono from '../../generated/icons/mono';
import * as MonoOutline from '../../generated/icons/mono-outline';
import type { Meta, StoryObj } from '@storybook/react';
import CustomGrid from './CustomGrid';

type Format = 'flat' | 'flatRounded' | 'logo' | 'logoBorder' | 'mono' | 'monoOutline';

const formatMap = {
  flat: Flat,
  flatRounded: FlatRounded,
  logo: Logo,
  logoBorder: LogoBorder,
  mono: Mono,
  monoOutline: MonoOutline,
};

const getComponentsForFormat = (format: Format) => {
  const icons = formatMap[format];
  // Add Amex as an alias for Americanexpress and sort alphabetically
  const componentsWithAmex = {
    ...icons,
    Amex: icons.Americanexpress,
  };

  return Object.fromEntries(
    Object.entries(componentsWithAmex).sort(([a], [b]) => a.localeCompare(b))
  );
};

const meta = {
  title: 'Payment Cards',
  tags: ['autodocs'],
  argTypes: {
    format: {
      control: 'select',
      options: ['flat', 'flatRounded', 'logo', 'logoBorder', 'mono', 'monoOutline'],
      description: 'Icon format style',
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<{ format: Format }>;

export const Card: Story = {
  args: {
    format: 'flatRounded',
  },
  render: ({ format = 'flatRounded' }) => {
    const Components = getComponentsForFormat(format);
    return <CustomGrid Components={Components} />;
  },
};
