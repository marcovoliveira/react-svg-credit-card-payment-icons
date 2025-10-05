import { PaymentIcon } from '../index';

export default {
  component: PaymentIcon,
  title: 'Test Your Card',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
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
      description: 'Payment card type',
    },
    format: {
      control: 'select',
      options: ['flat', 'flatRounded', 'logo', 'logoBorder', 'mono', 'monoOutline'],
      description: 'Icon format style',
    },
    width: {
      control: { type: 'range', min: 50, max: 800, step: 10 },
      description: 'Icon width in pixels',
    },
    height: {
      control: { type: 'range', min: 50, max: 500, step: 10 },
      description: 'Icon height in pixels',
    },
  },
};
export const Default = {
  args: {
    width: 400,
    type: 'Mastercard',
    format: 'monoOutline',
  },
};
