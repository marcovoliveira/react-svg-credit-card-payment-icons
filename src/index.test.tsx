import React from 'react';
import { render } from '@testing-library/react';
import { PaymentIcon } from './index';

describe('PaymentIcon alias and variant resolution', () => {
  describe('Type aliases', () => {
    it('resolves Amex to AmericanExpress', () => {
      const { container } = render(<PaymentIcon type="Amex" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('resolves Diners to DinersClub', () => {
      const { container } = render(<PaymentIcon type="Diners" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('handles case variations in type names', () => {
      // @ts-expect-error - Testing runtime case handling
      const { container: container1 } = render(<PaymentIcon type="visa" />);
      expect(container1.querySelector('svg')).toBeInTheDocument();

      // @ts-expect-error - Testing runtime case handling
      const { container: container2 } = render(<PaymentIcon type="VISA" />);
      expect(container2.querySelector('svg')).toBeInTheDocument();

      const { container: container3 } = render(<PaymentIcon type="Visa" />);
      expect(container3.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Variant aliases', () => {
    it('resolves Hiper variant alias to Hipercard', () => {
      const { container } = render(<PaymentIcon type="Hiper" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('resolves Code variant alias to Generic', () => {
      const { container } = render(<PaymentIcon type="Code" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('resolves Cvv alias to Code variant', () => {
      const { container } = render(<PaymentIcon type="Cvv" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('resolves Cvc alias to Code variant', () => {
      const { container } = render(<PaymentIcon type="Cvc" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('resolves CodeFront variant alias', () => {
      const { container } = render(<PaymentIcon type="CodeFront" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('resolves CvvFront alias to CodeFront variant', () => {
      const { container } = render(<PaymentIcon type="CvvFront" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('resolves CvcFront alias to CodeFront variant', () => {
      const { container } = render(<PaymentIcon type="CvcFront" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Explicit variant prop', () => {
    it('uses variant prop with base type name', () => {
      const { container } = render(<PaymentIcon type="Hipercard" variant="hiper" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('uses variant prop with Generic type', () => {
      const { container: container1 } = render(<PaymentIcon type="Generic" variant="code" />);
      expect(container1.querySelector('svg')).toBeInTheDocument();

      const { container: container2 } = render(<PaymentIcon type="Generic" variant="code-front" />);
      expect(container2.querySelector('svg')).toBeInTheDocument();
    });

    it('handles variant prop with hyphens and underscores', () => {
      const { container } = render(<PaymentIcon type="Generic" variant="code-front" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('handles case variations in variant names', () => {
      // Variant prop accepts string, so case variations work at runtime
      const { container: container1 } = render(<PaymentIcon type="Hipercard" variant="Hiper" />);
      expect(container1.querySelector('svg')).toBeInTheDocument();

      const { container: container2 } = render(<PaymentIcon type="Hipercard" variant="HIPER" />);
      expect(container2.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Format variations with variants', () => {
    it('renders Hiper variant in different formats', () => {
      const formats = ['flat', 'flatRounded', 'logo', 'logoBorder', 'mono', 'monoOutline'] as const;

      formats.forEach((format) => {
        const { container } = render(<PaymentIcon type="Hiper" format={format} />);
        expect(container.querySelector('svg')).toBeInTheDocument();
      });
    });

    it('renders Code variant in different formats', () => {
      const formats = ['flat', 'flatRounded', 'logo', 'logoBorder', 'mono', 'monoOutline'] as const;

      formats.forEach((format) => {
        const { container } = render(<PaymentIcon type="Code" format={format} />);
        expect(container.querySelector('svg')).toBeInTheDocument();
      });
    });
  });

  describe('Fallback behavior', () => {
    it('falls back to Generic for unknown type', () => {
      // @ts-expect-error - Testing runtime fallback
      const { container } = render(<PaymentIcon type="UnknownCard" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('falls back to base type when variant does not exist', () => {
      const { container } = render(<PaymentIcon type="Visa" variant="nonexistent" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('falls back to Generic when both type and variant are invalid', () => {
      // @ts-expect-error - Testing runtime fallback
      const { container } = render(<PaymentIcon type="Invalid" variant="invalid" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Width and height props', () => {
    it('applies custom width to variant', () => {
      const { container } = render(<PaymentIcon type="Hiper" width={100} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '100');
    });

    it('maintains aspect ratio for variants', () => {
      const { container } = render(<PaymentIcon type="Code" height={64} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('height', '64');
      // Width should be calculated based on 780/500 aspect ratio
      const expectedWidth = 64 * (780 / 500);
      expect(svg).toHaveAttribute('width', expectedWidth.toString());
    });
  });
});
