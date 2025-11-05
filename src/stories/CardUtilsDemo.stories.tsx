import type { Meta, StoryObj } from '@storybook/react-vite';
import CardUtilsDemo from './CardUtilsDemo';

const meta = {
  component: CardUtilsDemo,
  title: '3. Advanced Usage / Card Utilities',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Card Detection & Validation Utilities

A comprehensive set of utilities for detecting card types, validating card numbers, and formatting payment information.

## Features

- **Card Type Detection**: Automatically detect card type from number
- **Luhn Validation**: Validate card numbers using the Luhn algorithm
- **Number Formatting**: Format card numbers with appropriate spacing
- **Masking**: Mask sensitive card information
- **Validation**: Check if card numbers are potentially valid

## Available Functions

- \`detectCardType(cardNumber, useLegacy?)\` - Detect card type from number (set \`useLegacy=true\` for v4 type names)
- \`validateCardNumber(cardNumber)\` - Validate using Luhn algorithm
- \`formatCardNumber(cardNumber)\` - Format with spacing
- \`maskCardNumber(cardNumber)\` - Mask all but last 4 digits
- \`isCardNumberPotentiallyValid(cardNumber)\` - Check validity
- \`validateCardForType(cardNumber, type)\` - Validate for specific type
- \`getCardLengthRange(cardType)\` - Get valid length range
- \`sanitizeCardNumber(cardNumber)\` - Remove non-digits

## Breaking Changes in v5

In v5, \`detectCardType()\` returns canonical type names by default:
- \`'AmericanExpress'\` (not \`'Americanexpress'\`)
- \`'DinersClub'\` (not \`'Diners'\`)
- \`'Hipercard'\` (not \`'Hiper'\`)

For backward compatibility, use \`detectCardType(cardNumber, true)\` to get v4 type names.

Try entering different card numbers in the demo below!
        `,
      },
    },
  },
} satisfies Meta<typeof CardUtilsDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InteractiveDemo: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: `
Try these test card numbers:
- **Visa**: 4242424242424242
- **Mastercard**: 5555555555554444
- **American Express**: 378282246310005
- **Discover**: 6011111111111117
- **Diners Club**: 30569309025904
- **Elo**: 6362970000457013
        `,
      },
    },
  },
};
