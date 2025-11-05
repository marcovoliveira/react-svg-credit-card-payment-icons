import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Visa, Mastercard, AmericanExpress } from '../../generated/icons/flat-rounded';
import { getCardType } from '../utils/cardUtils';

const meta = {
  title: '3. Advanced Usage / Tree-Shakeable Imports',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Tree-Shakeable Icon Imports

Starting in **v5.0.0**, you can import individual icons directly for optimal bundle size.

## Why Use Direct Imports?

The \`PaymentIcon\` component bundles **all 108 icons** (~700KB). If you only need a few card types, use direct imports to reduce bundle size by ~90%.

## Bundle Size Comparison

| Import Method | Bundle Size | Use Case |
|--------------|-------------|----------|
| \`PaymentIcon\` component | ~700KB | Dynamic card detection, many card types |
| Direct imports | ~5-10KB per icon | Known card types (3-10 cards) |

## Available Import Paths

- \`react-svg-credit-card-payment-icons/icons/flat\`
- \`react-svg-credit-card-payment-icons/icons/flat-rounded\`
- \`react-svg-credit-card-payment-icons/icons/logo\`
- \`react-svg-credit-card-payment-icons/icons/logo-border\`
- \`react-svg-credit-card-payment-icons/icons/mono\`
- \`react-svg-credit-card-payment-icons/icons/mono-outline\`

**Recommendation:** Use direct imports when you support 10 or fewer card types.
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const BasicUsage: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px' }}>
      <Visa width={100} />
      <Mastercard width={100} />
      <AmericanExpress width={100} />
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `import { Visa, Mastercard, AmericanExpress } from 'react-svg-credit-card-payment-icons/icons/flat-rounded';

function App() {
  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <Visa width={100} />
      <Mastercard width={100} />
      <AmericanExpress width={100} />
    </div>
  );
}`,
      },
      description: {
        story: 'Import only the icons you need. This example bundles only ~20KB instead of 700KB.',
      },
    },
  },
};

export const WithCardDetection: Story = {
  render: () => {
    const [cardNumber, setCardNumber] = useState('');
    const cardType = getCardType(cardNumber);

    return (
      <div style={{ maxWidth: '400px' }}>
        <input
          data-testid="card-input"
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder="Enter card number"
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginBottom: '20px',
          }}
        />

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {cardType === 'Visa' && <Visa width={60} data-testid="visa-icon" />}
          {cardType === 'Mastercard' && <Mastercard width={60} data-testid="mastercard-icon" />}
          {cardType === 'AmericanExpress' && <AmericanExpress width={60} data-testid="amex-icon" />}
          {cardType && (
            <span style={{ fontSize: '18px', fontWeight: 'bold' }} data-testid="card-type">
              {cardType}
            </span>
          )}
        </div>
      </div>
    );
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByTestId('card-input');

    // Test Visa detection
    await userEvent.clear(input);
    await userEvent.type(input, '4242424242424242');
    await expect(canvas.getByTestId('visa-icon')).toBeInTheDocument();
    await expect(canvas.getByTestId('card-type')).toHaveTextContent('Visa');

    // Test Mastercard detection
    await userEvent.clear(input);
    await userEvent.type(input, '5555555555554444');
    await expect(canvas.getByTestId('mastercard-icon')).toBeInTheDocument();
    await expect(canvas.getByTestId('card-type')).toHaveTextContent('Mastercard');

    // Test Amex detection
    await userEvent.clear(input);
    await userEvent.type(input, '378282246310005');
    await expect(canvas.getByTestId('amex-icon')).toBeInTheDocument();
    await expect(canvas.getByTestId('card-type')).toHaveTextContent('AmericanExpress');
  },
  parameters: {
    docs: {
      source: {
        code: `import { getCardType } from 'react-svg-credit-card-payment-icons';
import { Visa, Mastercard, AmericanExpress } from 'react-svg-credit-card-payment-icons/icons/flat-rounded';

function PaymentForm() {
  const [cardNumber, setCardNumber] = useState('');
  const cardType = getCardType(cardNumber);

  return (
    <div>
      <input
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        placeholder="Enter card number"
      />

      {cardType === 'Visa' && <Visa width={60} />}
      {cardType === 'Mastercard' && <Mastercard width={60} />}
      {cardType === 'AmericanExpress' && <AmericanExpress width={60} />}
    </div>
  );
}`,
      },
      description: {
        story:
          'Combine card detection with direct imports. Click the "Interactions" tab to see automated tests. Try entering: 4242424242424242 (Visa), 5555555555554444 (Mastercard), or 378282246310005 (Amex)',
      },
    },
  },
};

export const AllAvailableIcons: Story = {
  render: () => (
    <div>
      <p style={{ marginBottom: '20px' }}>
        All icons are available for direct import from any style path:
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '10px',
        }}
      >
        {[
          'Alipay',
          'AmericanExpress',
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
        ].map((name) => (
          <code
            key={name}
            style={{ padding: '5px', background: '#f5f5f5', borderRadius: '3px', fontSize: '12px' }}
          >
            {name}
          </code>
        ))}
      </div>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `// Import any combination of icons you need
import {
  Visa,
  Mastercard,
  AmericanExpress,
  Discover,
  // ... etc
} from 'react-svg-credit-card-payment-icons/icons/flat-rounded';`,
      },
      description: {
        story: 'All 18 card types are available as named exports from each style path.',
      },
    },
  },
};
