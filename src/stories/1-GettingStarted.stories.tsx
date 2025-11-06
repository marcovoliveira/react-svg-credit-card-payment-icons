import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import {
  PaymentIcon,
  VisaIcon,
  MastercardIcon,
  VisaFlatRoundedIcon,
  MastercardLogoIcon,
} from '../index';

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

A simple, flexible React component for displaying payment card icons with multiple import methods for optimal bundle size.

## Features
- 18+ card types with variant support
- 6 visual styles (flat, flatRounded, logo, logoBorder, mono, monoOutline)
- 4 flexible import methods
- Tree-shakeable exports
- TypeScript support with full IntelliSense
- Card detection utilities
- Vendor-specific imports

## Quick Example
\`\`\`tsx
// Method 1: Universal component (supports format and variant props)
import { PaymentIcon } from 'react-svg-credit-card-payment-icons';
<PaymentIcon type="Visa" format="flatRounded" width={100} />
<PaymentIcon type="Hipercard" variant="hiper" format="flatRounded" width={100} />

// Method 2: Unified icon with format prop
import { VisaIcon } from 'react-svg-credit-card-payment-icons';
<VisaIcon format="flatRounded" width={100} />

// Method 3: Format-specific (smallest bundle, supports variants)
import { VisaFlatRoundedIcon, HipercardFlatRoundedIcon } from 'react-svg-credit-card-payment-icons';
<VisaFlatRoundedIcon width={100} />
<HipercardFlatRoundedIcon variant="Hiper" width={100} />

// Method 4: Vendor-specific imports
import { VisaFlatRoundedIcon, VisaLogoIcon } from 'react-svg-credit-card-payment-icons/visa';
<VisaFlatRoundedIcon width={100} />
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
        'Select a variant for cards that support them. Works with: Hipercard (variant: "hiper"), Generic (variant: "code" or "code-front"). Leave empty for default style.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
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
  render: (args) => {
    const { type, variant, ...rest } = args;

    // Validate variant compatibility
    const isHipercardType = type === 'Hipercard' || type === 'Hiper';
    const isGenericType = type === 'Generic' || type === 'Code' || type === 'CodeFront';
    const isHiperVariant = variant === 'hiper';
    const isCodeVariant = variant === 'code' || variant === 'code-front';

    let effectiveVariant = variant;
    let warningMessage = '';

    if (isHiperVariant && !isHipercardType) {
      effectiveVariant = undefined;
      warningMessage = '⚠️ Variant "hiper" only works with Hipercard type. Using default instead.';
    } else if (isCodeVariant && !isGenericType) {
      effectiveVariant = undefined;
      warningMessage =
        '⚠️ Variant "code" and "code-front" only work with Generic type. Using default instead.';
    }

    return (
      <div>
        {warningMessage && (
          <div
            style={{
              padding: '12px',
              marginBottom: '16px',
              background: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '4px',
              fontSize: '13px',
              color: '#856404',
            }}
          >
            {warningMessage}
          </div>
        )}
        <PaymentIcon type={type} variant={effectiveVariant} {...rest} />
      </div>
    );
  },
  argTypes: {
    variant: {
      control: {
        type: 'select',
        labels: {
          '': 'None (default)',
          hiper: 'hiper (for Hipercard only)',
          code: 'code (for Generic only - back CVV)',
          'code-front': 'code-front (for Generic only - front CVV)',
        },
      },
      options: ['', 'hiper', 'code', 'code-front'],
      description:
        'Select a variant. Only works with specific card types: "hiper" → Hipercard, "code"/"code-front" → Generic. Invalid combinations show a warning.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
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

export const PaymentIconWithVariants: Story = {
  args: {
    type: 'Hipercard',
    format: 'flatRounded',
    width: 120,
  },
  render: () => (
    <div>
      <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '16px' }}>
        PaymentIcon Component with Variant Support
      </h3>
      <p style={{ fontSize: '12px', marginBottom: '24px', maxWidth: '600px' }}>
        The universal <code>PaymentIcon</code> component supports the <code>variant</code> prop for
        cards with multiple visual styles:
      </p>

      <div style={{ marginBottom: '32px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>
          Hipercard Variants
        </h4>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <PaymentIcon type="Hipercard" format="flatRounded" width={100} />
            <div style={{ fontSize: '11px', marginTop: '6px' }}>Default</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <PaymentIcon type="Hipercard" variant="hiper" format="flatRounded" width={100} />
            <div style={{ fontSize: '11px', marginTop: '6px' }}>variant=&quot;hiper&quot;</div>
          </div>
        </div>
        <pre
          style={{ fontSize: '11px', background: '#f5f5f5', padding: '12px', borderRadius: '4px' }}
        >
          {`<PaymentIcon type="Hipercard" format="flatRounded" />
<PaymentIcon type="Hipercard" variant="hiper" format="flatRounded" />`}
        </pre>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>
          Generic Card Variants
        </h4>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <PaymentIcon type="Generic" format="flatRounded" width={100} />
            <div style={{ fontSize: '11px', marginTop: '6px' }}>Default (front)</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <PaymentIcon type="Generic" variant="code" format="flatRounded" width={100} />
            <div style={{ fontSize: '11px', marginTop: '6px' }}>variant=&quot;code&quot;</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <PaymentIcon type="Generic" variant="code-front" format="flatRounded" width={100} />
            <div style={{ fontSize: '11px', marginTop: '6px' }}>variant=&quot;code-front&quot;</div>
          </div>
        </div>
        <pre
          style={{ fontSize: '11px', background: '#f5f5f5', padding: '12px', borderRadius: '4px' }}
        >
          {`<PaymentIcon type="Generic" format="flatRounded" />
<PaymentIcon type="Generic" variant="code" format="flatRounded" />
<PaymentIcon type="Generic" variant="code-front" format="flatRounded" />`}
        </pre>
      </div>

      <div style={{ fontSize: '12px', color: '#666', marginTop: '16px' }}>
        💡 Tip: You can also use variant aliases directly as the type:{' '}
        <code>&lt;PaymentIcon type=&quot;Hiper&quot; /&gt;</code> or{' '}
        <code>&lt;PaymentIcon type=&quot;Code&quot; /&gt;</code>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The PaymentIcon component accepts a variant prop to select between different visual styles of the same card network. This is useful for cards like Hipercard/Hiper or Generic card with CVV variations.',
      },
    },
  },
};

export const NewImportMethods: Story = {
  args: {
    type: 'Visa',
    width: 100,
  },
  render: () => (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
          Method 1: PaymentIcon Component (Universal)
        </h3>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <PaymentIcon type="Visa" format="flatRounded" width={100} />
          <PaymentIcon type="Mastercard" format="logo" width={100} />
          <PaymentIcon type="Hipercard" variant="hiper" format="flatRounded" width={100} />
        </div>
        <pre
          style={{ fontSize: '11px', background: '#f5f5f5', padding: '12px', borderRadius: '4px' }}
        >
          {`import { PaymentIcon } from 'react-svg-credit-card-payment-icons';

<PaymentIcon type="Visa" format="flatRounded" width={100} />
<PaymentIcon type="Mastercard" format="logo" width={100} />
<PaymentIcon type="Hipercard" variant="hiper" format="flatRounded" width={100} />`}
        </pre>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
          ✨ Supports format and variant props for complete flexibility
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
          Method 2: Unified Icon Components with Format Prop
        </h3>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '8px' }}>
          <VisaIcon format="flatRounded" width={100} />
          <MastercardIcon format="logo" width={100} />
        </div>
        <pre
          style={{ fontSize: '11px', background: '#f5f5f5', padding: '12px', borderRadius: '4px' }}
        >
          {`import { VisaIcon, MastercardIcon } from 'react-svg-credit-card-payment-icons';

<VisaIcon format="flatRounded" width={100} />
<MastercardIcon format="logo" width={100} />`}
        </pre>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
          Method 3: Format-Specific Components (Recommended)
        </h3>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '8px' }}>
          <VisaFlatRoundedIcon width={100} />
          <MastercardLogoIcon width={100} />
        </div>
        <pre
          style={{ fontSize: '11px', background: '#f5f5f5', padding: '12px', borderRadius: '4px' }}
        >
          {`import { VisaFlatRoundedIcon, MastercardLogoIcon } from 'react-svg-credit-card-payment-icons';

<VisaFlatRoundedIcon width={100} />
<MastercardLogoIcon width={100} />`}
        </pre>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
          ✨ Best for bundle size - includes only the specific format you need
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
          Method 4: Vendor-Specific Imports
        </h3>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '8px' }}>
          <VisaFlatRoundedIcon width={100} />
          <VisaIcon format="logo" width={100} />
        </div>
        <pre
          style={{ fontSize: '11px', background: '#f5f5f5', padding: '12px', borderRadius: '4px' }}
        >
          {`import { VisaFlatRoundedIcon, VisaLogoIcon } from 'react-svg-credit-card-payment-icons/visa';

<VisaFlatRoundedIcon width={100} />
<VisaLogoIcon width={100} />`}
        </pre>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
          📦 Organize imports by payment network instead of format
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'v5.1.0 introduces four flexible import methods. Choose the one that best fits your use case. Format-specific components (Method 3) offer the smallest bundle size.',
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
              <PaymentIcon type="CvvBack" format={format} width={width} />
              <div style={{ fontSize: '12px', marginTop: '8px', fontWeight: '500' }}>CVV</div>
              <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
                type=&quot;CvvBack&quot;
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
