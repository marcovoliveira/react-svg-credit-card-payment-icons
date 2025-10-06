import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import * as Flat from '../../generated/icons/flat';
import * as FlatRounded from '../../generated/icons/flat-rounded';
import * as Logo from '../../generated/icons/logo';
import * as LogoBorder from '../../generated/icons/logo-border';
import * as Mono from '../../generated/icons/mono';
import * as MonoOutline from '../../generated/icons/mono-outline';
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
  const componentsWithAmex = {
    ...icons,
    Amex: icons.Americanexpress,
  };

  return Object.fromEntries(
    Object.entries(componentsWithAmex).sort(([a], [b]) => a.localeCompare(b))
  );
};

const meta = {
  title: '2. Browse Icons / Icon Gallery',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# All Available Icons

Browse all 18 payment card icons in different visual styles.

**Available Cards:**
Alipay, American Express, Code, Diners, Discover, Elo, Generic, Hiper, Hipercard, JCB, Maestro, Mastercard, Mir, PayPal, Swish, UnionPay, Visa

**Available Styles:**
flat, flatRounded, logo, logoBorder, mono, monoOutline
        `,
      },
    },
  },
  argTypes: {
    format: {
      control: 'select',
      options: ['flat', 'flatRounded', 'logo', 'logoBorder', 'mono', 'monoOutline'],
      description: 'Icon format style',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'flatRounded' },
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<{ format: Format }>;

export const AllCards: Story = {
  args: {
    format: 'flatRounded',
  },
  render: ({ format = 'flatRounded' }) => {
    const Components = getComponentsForFormat(format);
    return <CustomGrid Components={Components} />;
  },
};
