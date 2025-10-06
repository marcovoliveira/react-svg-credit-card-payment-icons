import React from 'react';
import { render } from '@testing-library/react';
import { PaymentIcon } from './index';

describe('PaymentIcon', () => {
  it('renders a payment icon with default props', () => {
    const { container } = render(<PaymentIcon type="Visa" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders with custom width', () => {
    const { container } = render(<PaymentIcon type="Mastercard" width={100} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '100');
  });

  it('renders with custom height and calculates width', () => {
    const { container } = render(<PaymentIcon type="Amex" height={50} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('height', '50');
  });

  it('renders different payment types', () => {
    const { container, rerender } = render(<PaymentIcon type="Visa" />);
    expect(container.querySelector('svg')).toBeInTheDocument();

    rerender(<PaymentIcon type="Mastercard" />);
    expect(container.querySelector('svg')).toBeInTheDocument();

    rerender(<PaymentIcon type="Americanexpress" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders different formats', () => {
    const { container, rerender } = render(<PaymentIcon type="Visa" format="flat" />);
    expect(container.querySelector('svg')).toBeInTheDocument();

    rerender(<PaymentIcon type="Visa" format="flatRounded" />);
    expect(container.querySelector('svg')).toBeInTheDocument();

    rerender(<PaymentIcon type="Visa" format="logo" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('handles Amex alias for American Express', () => {
    const { container } = render(<PaymentIcon type="Amex" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('applies custom SVG props', () => {
    const { container } = render(<PaymentIcon type="Visa" className="custom-class" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-class');
  });

  it('sets correct viewBox', () => {
    const { container } = render(<PaymentIcon type="Visa" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 780 500');
  });

  it('throws error for invalid category', () => {
    // Use console.error mock to suppress error boundary warnings
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      // @ts-expect-error - Testing invalid category
      render(<PaymentIcon type="Visa" format="invalid" />);
    }).toThrow(/Invalid category/);

    consoleSpy.mockRestore();
  });

  it('renders fallback Generic icon for unknown types', () => {
    // @ts-expect-error - Testing unknown type
    const { container } = render(<PaymentIcon type="UnknownCard" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('handles empty string type', () => {
    // @ts-expect-error - Testing edge case
    const { container } = render(<PaymentIcon type="" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('handles undefined type', () => {
    // @ts-expect-error - Testing edge case
    const { container } = render(<PaymentIcon type={undefined} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('handles types with hyphens and underscores', () => {
    // @ts-expect-error - Testing edge case with non-standard formatting
    const { container } = render(<PaymentIcon type="master-card" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
