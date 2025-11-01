import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { fn } from 'storybook/test';
import { PaymentIcon } from '../index';

const meta = {
  component: PaymentIcon,
  title: '4. Testing / Interaction Tests',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Automated Interaction Tests

These stories include automated tests that verify component behavior.

Click the **Interactions** tab to see tests running in real-time.

Tests verify:
- Component renders correctly
- Props are applied properly
- Correct attributes are set
- Colors and styles are preserved
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['Visa', 'Mastercard', 'Americanexpress', 'Discover', 'Paypal', 'Generic'],
      table: {
        type: { summary: 'string' },
      },
    },
    format: {
      control: 'select',
      options: ['flat', 'flatRounded', 'logo', 'logoBorder', 'mono', 'monoOutline'],
      table: {
        type: { summary: 'string' },
      },
    },
    width: {
      control: 'number',
      table: {
        type: { summary: 'number' },
      },
    },
    height: {
      control: 'number',
      table: {
        type: { summary: 'number' },
      },
    },
    onClick: {
      action: 'clicked',
      table: {
        type: { summary: '(event: MouseEvent) => void' },
      },
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof PaymentIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VisaCard: Story = {
  args: {
    type: 'Visa',
    format: 'flat',
  },
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg');

    await expect(svg).toBeInTheDocument();
    await expect(svg).toHaveAttribute('viewBox', '0 0 780 500');
  },
};

export const MastercardWithCustomSize: Story = {
  args: {
    type: 'Mastercard',
    format: 'flatRounded',
    width: 100,
  },
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg');

    await expect(svg).toBeInTheDocument();
    await expect(svg).toHaveAttribute('width', '100');
  },
};

export const AmexAlias: Story = {
  args: {
    type: 'Amex',
    format: 'logo',
  },
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg');

    // Should render American Express when using Amex alias
    await expect(svg).toBeInTheDocument();
  },
};

export const DifferentFormats: Story = {
  args: {
    type: 'Visa',
  },
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <PaymentIcon type="Visa" format="flat" width={80} />
      <PaymentIcon type="Visa" format="flatRounded" width={80} />
      <PaymentIcon type="Visa" format="logo" width={80} />
      <PaymentIcon type="Visa" format="logoBorder" width={80} />
      <PaymentIcon type="Visa" format="mono" width={80} />
      <PaymentIcon type="Visa" format="monoOutline" width={80} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const svgs = canvasElement.querySelectorAll('svg');

    // Should render 6 different formats
    await expect(svgs).toHaveLength(6);

    // All should have the same viewBox
    svgs.forEach((svg) => {
      expect(svg).toHaveAttribute('viewBox', '0 0 780 500');
    });
  },
};

export const ResponsiveHeight: Story = {
  args: {
    type: 'Visa',
    height: 50,
  },
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg');

    await expect(svg).toBeInTheDocument();
    await expect(svg).toHaveAttribute('height');

    // Width should be calculated based on aspect ratio
    const height = svg?.getAttribute('height');
    await expect(height).toBe('50');
  },
};

export const HiperColors: Story = {
  args: {
    type: 'Hiper',
    format: 'flatRounded',
  },
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg');
    await expect(svg).toBeInTheDocument();

    // Check for orange background color (#F37421) - using computed style
    const paths = svg?.querySelectorAll('path');
    const orangePath = Array.from(paths || []).find((path) => {
      const fill = window.getComputedStyle(path).fill;
      // Check for both hex and rgb formats
      return fill?.toLowerCase() === '#f37421' || fill === 'rgb(243, 116, 33)';
    });
    await expect(orangePath).toBeTruthy();

    // Check for yellow accent color (#FFE700)
    const yellowPath = Array.from(paths || []).find((path) => {
      const fill = window.getComputedStyle(path).fill;
      return fill?.toLowerCase() === '#ffe700' || fill === 'rgb(255, 231, 0)';
    });
    await expect(yellowPath).toBeTruthy();
  },
};

export const JcbColors: Story = {
  args: {
    type: 'Jcb',
    format: 'flatRounded',
  },
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg');
    await expect(svg).toBeInTheDocument();

    // Check for blue background
    const bluePath = svg?.querySelector('path[fill="#0E4C96"]');
    await expect(bluePath).toBeInTheDocument();

    // Check for green gradient colors (stopColor is a React prop)
    const stops = svg?.querySelectorAll('stop');
    const greenStops = Array.from(stops || []).filter((stop) => {
      const color = stop.getAttribute('stop-color');
      return color === '#007B40' || color === '#55B330';
    });
    await expect(greenStops.length).toBeGreaterThan(0);
  },
};

export const MirColors: Story = {
  args: {
    type: 'Mir',
    format: 'flatRounded',
  },
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg');
    await expect(svg).toBeInTheDocument();

    // Check for green color (#37A72E) - using computed style
    const paths = svg?.querySelectorAll('path');
    const greenPath = Array.from(paths || []).find((path) => {
      const fill = window.getComputedStyle(path).fill;
      return fill?.toLowerCase() === '#37a72e' || fill === 'rgb(55, 167, 46)';
    });
    await expect(greenPath).toBeTruthy();
  },
};
