import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { PaymentIcon } from '../index';

const meta = {
  title: '1. Getting Started / Quick Start',
  component: PaymentIcon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Payment Icon Component

A simple, flexible React component for displaying payment card icons.

## Features
- 18 card types
- 6 visual styles
- Tree-shakeable direct imports
- TypeScript support
- Card detection utilities

## Quick Example
\`\`\`tsx
import { PaymentIcon } from 'react-svg-credit-card-payment-icons';

<PaymentIcon type="visa" format="flatRounded" width={100} />
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: [
        'Alipay',
        'Amex',
        'Americanexpress',
        'Code',
        'CodeFront',
        'Diners',
        'Discover',
        'Elo',
        'Generic',
        'Hiper',
        'Hipercard',
        'Jcb',
        'Maestro',
        'Mastercard',
        'Mir',
        'Paypal',
        'Swish',
        'Unionpay',
        'Visa',
      ],
      description: 'The payment card type to display',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Generic' },
      },
    },
    format: {
      control: 'select',
      options: ['flat', 'flatRounded', 'logo', 'logoBorder', 'mono', 'monoOutline'],
      description: 'Visual style of the icon',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'flat' },
      },
    },
    width: {
      control: { type: 'range', min: 40, max: 400, step: 10 },
      description: 'Icon width in pixels',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '40' },
      },
    },
    height: {
      control: { type: 'range', min: 25, max: 256, step: 5 },
      description: 'Icon height in pixels (auto-calculated from width if not provided)',
      table: {
        type: { summary: 'number' },
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler',
      table: {
        type: { summary: '(event: MouseEvent) => void' },
      },
    },
    className: {
      control: 'text',
      description: 'CSS class name',
      table: {
        type: { summary: 'string' },
      },
    },
    style: {
      control: 'object',
      description: 'Inline styles',
      table: {
        type: { summary: 'CSSProperties' },
      },
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof PaymentIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    type: 'Visa',
    format: 'flatRounded',
    width: 120,
  },
};

export const AllFormats: Story = {
  args: {
    type: 'Visa',
    width: 80,
  },
  render: ({ type = 'Visa', width = 80 }) => (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <PaymentIcon type={type} width={width} format="flat" />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>flat</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <PaymentIcon type={type} width={width} format="flatRounded" />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>flatRounded</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <PaymentIcon type={type} width={width} format="logo" />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>logo</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <PaymentIcon type={type} width={width} format="logoBorder" />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>logoBorder</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <PaymentIcon type={type} width={width} format="mono" />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>mono</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <PaymentIcon type={type} width={width} format="monoOutline" />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>monoOutline</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All 6 visual styles available for each card type.',
      },
    },
  },
};

export const PopularCards: Story = {
  args: {
    type: 'Visa',
    format: 'flatRounded',
    width: 100,
  },
  render: ({ format = 'flatRounded', width = 100 }) => (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      <PaymentIcon type="Visa" format={format} width={width} />
      <PaymentIcon type="Mastercard" format={format} width={width} />
      <PaymentIcon type="Amex" format={format} width={width} />
      <PaymentIcon type="Discover" format={format} width={width} />
      <PaymentIcon type="Paypal" format={format} width={width} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Most commonly used payment card types.',
      },
    },
  },
};

export const WithClickHandler: Story = {
  args: {
    type: 'Visa',
    format: 'flatRounded',
    width: 120,
    onClick: fn(),
    style: { cursor: 'pointer' },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Icons support all standard SVG props including onClick. Check the Actions tab to see click events.',
      },
    },
  },
};

export const ResponsiveSizing: Story = {
  args: {
    type: 'Visa',
    format: 'flatRounded',
    width: 100,
  },
  render: () => (
    <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
      <div>
        <PaymentIcon type="Visa" format="flatRounded" width={60} />
        <div style={{ fontSize: '10px', marginTop: '4px' }}>60px</div>
      </div>
      <div>
        <PaymentIcon type="Visa" format="flatRounded" width={100} />
        <div style={{ fontSize: '10px', marginTop: '4px' }}>100px</div>
      </div>
      <div>
        <PaymentIcon type="Visa" format="flatRounded" width={150} />
        <div style={{ fontSize: '10px', marginTop: '4px' }}>150px</div>
      </div>
      <div>
        <PaymentIcon type="Visa" format="flatRounded" width={200} />
        <div style={{ fontSize: '10px', marginTop: '4px' }}>200px</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Icons scale proportionally. Specify width or height, the other dimension is calculated automatically.',
      },
    },
  },
};
