import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
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
        'AmericanExpress',
        'Code',
        'CodeFront',
        'Diners',
        'DinersClub',
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
    variant: {
      control: { type: 'select' },
      options: ['', 'hiper', 'code', 'code-front'],
      description:
        '⚠️ Only works with certain types: "hiper" → Hipercard only. "code"/"code-front" → Generic only. See dedicated variant stories for better controls.',
      table: {
        type: { summary: 'string' },
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
  argTypes: {
    variant: {
      table: { disable: true }, // Hide variant from main playground
    },
  },
};

export const HipercardVariants: Story = {
  args: {
    type: 'Hipercard',
    format: 'flatRounded',
    width: 120,
  },
  argTypes: {
    type: {
      table: { disable: true }, // Lock to Hipercard
    },
    variant: {
      control: {
        type: 'radio',
        labels: {
          '': 'Default Hipercard branding',
          hiper: 'Hiper branding',
        },
      },
      options: ['', 'hiper'],
      description: 'Choose between Hipercard (default) or Hiper branded variant',
    },
  },
  parameters: {
    docs: {
      source: {
        code: `// Default Hipercard branding
<PaymentIcon type="Hipercard" />

// Hiper branding (using variant prop)
<PaymentIcon type="Hipercard" variant="hiper" />

// Hiper branding (using alias - recommended)
<PaymentIcon type="Hiper" />`,
      },
      description: {
        story:
          'Hipercard supports two visual variants: default Hipercard branding or Hiper branding (orange/yellow colors). Both represent the same card network but with different visual identities.',
      },
    },
  },
};

export const GenericVariants: Story = {
  args: {
    type: 'Generic',
    format: 'flatRounded',
    width: 120,
  },
  argTypes: {
    type: {
      table: { disable: true }, // Lock to Generic
    },
    variant: {
      control: {
        type: 'radio',
        labels: {
          '': 'Card front (default)',
          code: 'Card back with CVV',
          'code-front': 'Card front with CVV',
        },
      },
      options: ['', 'code', 'code-front'],
      description: 'Choose which side of the generic card to display',
    },
  },
  parameters: {
    docs: {
      source: {
        code: `// Card front (default)
<PaymentIcon type="Generic" />

// Card back with CVV (using variant prop)
<PaymentIcon type="Generic" variant="code" />

// Card back with CVV (using alias - recommended)
<PaymentIcon type="Code" />

// Card front with CVV (using variant prop)
<PaymentIcon type="Generic" variant="code-front" />

// Card front with CVV (using alias - recommended)
<PaymentIcon type="CodeFront" />`,
      },
      description: {
        story:
          'Generic card supports three variants: front (default), back with CVV/security code, or front with CVV. Useful for showing where customers should find their security code.',
      },
    },
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

export const CardVariants: Story = {
  args: {
    type: 'Hiper',
    format: 'flatRounded',
    width: 120,
  },
  render: (args) => {
    const { format = 'flatRounded', width = 120 } = args;
    return (
      <div>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
            Hiper vs Hipercard Variants
          </h3>
          <p style={{ fontSize: '12px', marginBottom: '16px', maxWidth: '600px' }}>
            Some card networks have multiple visual styles. Hiper and Hipercard share the same card
            number ranges but have different branding. Use the variant alias directly or the
            explicit variant prop.
          </p>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <PaymentIcon type="Hiper" format={format} width={width} />
              <div style={{ fontSize: '12px', marginTop: '8px', fontWeight: '500' }}>Hiper</div>
              <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
                type=&quot;Hiper&quot;
              </div>
              <div
                style={{
                  fontSize: '9px',
                  color: '#999',
                  marginTop: '2px',
                  fontFamily: 'monospace',
                }}
              >
                (variant alias)
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <PaymentIcon type="Hipercard" format={format} width={width} />
              <div style={{ fontSize: '12px', marginTop: '8px', fontWeight: '500' }}>Hipercard</div>
              <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
                type=&quot;Hipercard&quot;
              </div>
              <div
                style={{
                  fontSize: '9px',
                  color: '#999',
                  marginTop: '2px',
                  fontFamily: 'monospace',
                }}
              >
                (default)
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <PaymentIcon type="Hipercard" variant="hiper" format={format} width={width} />
              <div style={{ fontSize: '12px', marginTop: '8px', fontWeight: '500' }}>
                Hiper (explicit)
              </div>
              <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
                type=&quot;Hipercard&quot;
              </div>
              <div style={{ fontSize: '10px', color: '#666' }}>variant=&quot;hiper&quot;</div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
            Generic Card Variants
          </h3>
          <p style={{ fontSize: '12px', marginBottom: '16px', maxWidth: '600px' }}>
            Generic card has variants for showing the security code on back (Code) or front
            (CodeFront).
          </p>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <PaymentIcon type="Generic" format={format} width={width} />
              <div style={{ fontSize: '12px', marginTop: '8px', fontWeight: '500' }}>Generic</div>
              <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
                type=&quot;Generic&quot;
              </div>
              <div
                style={{
                  fontSize: '9px',
                  color: '#999',
                  marginTop: '2px',
                  fontFamily: 'monospace',
                }}
              >
                (card front)
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <PaymentIcon type="Code" format={format} width={width} />
              <div style={{ fontSize: '12px', marginTop: '8px', fontWeight: '500' }}>Code</div>
              <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
                type=&quot;Code&quot;
              </div>
              <div
                style={{
                  fontSize: '9px',
                  color: '#999',
                  marginTop: '2px',
                  fontFamily: 'monospace',
                }}
              >
                (back CVV)
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <PaymentIcon type="CodeFront" format={format} width={width} />
              <div style={{ fontSize: '12px', marginTop: '8px', fontWeight: '500' }}>CodeFront</div>
              <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
                type=&quot;CodeFront&quot;
              </div>
              <div
                style={{
                  fontSize: '9px',
                  color: '#999',
                  marginTop: '2px',
                  fontFamily: 'monospace',
                }}
              >
                (front CVV)
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
            Type Aliases
          </h3>
          <p style={{ fontSize: '12px', marginBottom: '16px', maxWidth: '600px' }}>
            Common card names are automatically resolved to their canonical types.
          </p>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <PaymentIcon type="Amex" format={format} width={width} />
              <div style={{ fontSize: '12px', marginTop: '8px', fontWeight: '500' }}>Amex</div>
              <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
                type=&quot;Amex&quot;
              </div>
              <div style={{ fontSize: '10px', color: '#999', marginTop: '2px' }}>
                → AmericanExpress
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <PaymentIcon type="Diners" format={format} width={width} />
              <div style={{ fontSize: '12px', marginTop: '8px', fontWeight: '500' }}>Diners</div>
              <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
                type=&quot;Diners&quot;
              </div>
              <div style={{ fontSize: '10px', color: '#999', marginTop: '2px' }}>→ DinersClub</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <PaymentIcon type="Cvv" format={format} width={width} />
              <div style={{ fontSize: '12px', marginTop: '8px', fontWeight: '500' }}>CVV</div>
              <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
                type=&quot;Cvv&quot;
              </div>
              <div style={{ fontSize: '10px', color: '#999', marginTop: '2px' }}>→ Code</div>
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'The package supports both type aliases (alternative names) and variant aliases (different visual styles). Variant aliases like "Hiper" automatically select the appropriate variant of a card type.',
      },
    },
  },
};
