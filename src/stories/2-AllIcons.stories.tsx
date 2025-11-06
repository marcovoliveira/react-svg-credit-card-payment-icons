import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as Flat from '../../generated/icons/flat';
import * as FlatRounded from '../../generated/icons/flat-rounded';
import * as Logo from '../../generated/icons/logo';
import * as LogoBorder from '../../generated/icons/logo-border';
import * as Mono from '../../generated/icons/mono';
import * as MonoOutline from '../../generated/icons/mono-outline';
import CustomGrid from './CustomGrid';
import { CARD_METADATA } from '../../generated/cardMetadata';

type Format = 'flat' | 'flatRounded' | 'logo' | 'logoBorder' | 'mono' | 'monoOutline';

const formatMap = {
  flat: Flat,
  flatRounded: FlatRounded,
  logo: Logo,
  logoBorder: LogoBorder,
  mono: Mono,
  monoOutline: MonoOutline,
};

// Get non-variant aliases for a given type (for display under the card name)
const getAliases = (typeName: string): string[] => {
  // Check if this is a primary type
  const card = CARD_METADATA.find((c) => c.type === typeName);
  if (card) {
    const aliases: string[] = [...card.aliases];
    if (card.legacyType) aliases.unshift(card.legacyType);
    // Add "Icon" suffix alias
    aliases.push(`${typeName}Icon`);
    return aliases;
  }

  // Check if this is a variant - show which variant it is
  for (const cardData of CARD_METADATA) {
    if (cardData.variants) {
      const variantEntry = Object.entries(cardData.variants).find(([alias]) => alias === typeName);
      if (variantEntry) {
        const [, variantDef] = variantEntry;
        const variantAliases = [...(variantDef.aliases || [])];
        // Add "Icon" suffix alias for variant
        variantAliases.push(`${typeName}Icon`);
        return variantAliases;
      }
    }
  }

  return [];
};

const getComponentsForFormat = (format: Format) => {
  const icons = formatMap[format];

  // Get all canonical types
  const canonicalTypes = CARD_METADATA.map((card) => card.type);

  // Get all variant aliases (like Hiper, Code, CodeFront)
  const variantAliases: string[] = [];
  CARD_METADATA.forEach((card) => {
    if (card.variants) {
      Object.keys(card.variants).forEach((variantAlias) => {
        variantAliases.push(variantAlias);
      });
    }
  });

  // Include both canonical types and variants, but exclude regular aliases
  const allowedNames = [...canonicalTypes, ...variantAliases];

  const primaryComponents = Object.fromEntries(
    Object.entries(icons)
      .filter(([name]) => allowedNames.includes(name))
      .sort(([a], [b]) => a.localeCompare(b))
  );

  return primaryComponents;
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
    return <CustomGrid Components={Components} getAliases={getAliases} />;
  },
};
