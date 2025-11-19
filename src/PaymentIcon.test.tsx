import React from 'react';
import { render } from '@testing-library/react';
import { PaymentIcon } from './index';
import { CARD_METADATA, type CardMetadata } from '../generated/cardMetadata';
import { AVAILABLE_FORMATS } from '../generated/unifiedIcons';

describe('PaymentIcon', () => {
  const allFormats = AVAILABLE_FORMATS;

  describe('Basic rendering', () => {
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
      const { container } = render(<PaymentIcon type="AmericanExpress" height={50} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('height', '50');
    });

    it('sets correct viewBox', () => {
      const { container } = render(<PaymentIcon type="Visa" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 780 500');
    });

    it('applies custom SVG props', () => {
      const { container } = render(<PaymentIcon type="Visa" className="custom-class" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('custom-class');
    });
  });

  describe('All canonical card types', () => {
    // Dynamically test all canonical card types from YAML definitions
    CARD_METADATA.forEach((card: CardMetadata) => {
      it(`renders ${card.type}`, () => {
        const { container } = render(<PaymentIcon type={card.type} />);
        expect(container.querySelector('svg')).toBeInTheDocument();
      });
    });
  });

  describe('All formats', () => {
    // Dynamically test all formats for a sample card type
    allFormats.forEach((format) => {
      it(`renders ${format} format`, () => {
        const { container } = render(<PaymentIcon type="Visa" format={format} />);
        expect(container.querySelector('svg')).toBeInTheDocument();
      });
    });
  });

  describe('Aliases', () => {
    // Dynamically test all aliases from YAML definitions
    CARD_METADATA.forEach((card: CardMetadata) => {
      if (card.aliases && card.aliases.length > 0) {
        card.aliases.forEach((alias: string) => {
          it(`resolves ${alias} alias to ${card.type}`, () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { container } = render(<PaymentIcon type={alias as any} />);
            expect(container.querySelector('svg')).toBeInTheDocument();
          });
        });
      }
    });
  });

  describe('Variants', () => {
    // Dynamically test all variants from YAML definitions
    CARD_METADATA.forEach((card: CardMetadata) => {
      if (card.variants && Object.keys(card.variants).length > 0) {
        describe(`${card.type} variants`, () => {
          Object.entries(card.variants).forEach(([variantKey, variantDef]) => {
            it(`renders ${variantKey} variant using explicit variant prop`, () => {
              const { container } = render(
                <PaymentIcon type={card.type} variant={variantDef.slug} />
              );
              expect(container.querySelector('svg')).toBeInTheDocument();
            });

            it(`renders ${variantKey} variant using type alias`, () => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const { container } = render(<PaymentIcon type={variantKey as any} />);
              expect(container.querySelector('svg')).toBeInTheDocument();
            });

            // Test variant-specific aliases (e.g., Cvv, Cvc for Code variant)
            if (variantDef.aliases && variantDef.aliases.length > 0) {
              variantDef.aliases.forEach((alias: string) => {
                it(`renders ${variantKey} variant using ${alias} alias`, () => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const { container } = render(<PaymentIcon type={alias as any} />);
                  expect(container.querySelector('svg')).toBeInTheDocument();
                });
              });
            }

            // Test variant in all formats
            it(`renders ${variantKey} variant in all formats`, () => {
              allFormats.forEach((format) => {
                const { container } = render(
                  <PaymentIcon type={card.type} variant={variantDef.slug} format={format} />
                );
                expect(container.querySelector('svg')).toBeInTheDocument();
              });
            });
          });
        });
      }
    });
  });

  describe('Edge cases and error handling', () => {
    it('throws error for invalid format', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        // @ts-expect-error - Testing invalid format
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

    it('handles variant with hyphens and underscores', () => {
      const { container } = render(<PaymentIcon type="Hipercard" variant="hi-per" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('falls back to default when variant does not exist', () => {
      const { container } = render(<PaymentIcon type="Visa" variant="nonexistent" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('falls back to Generic when both type and variant do not exist', () => {
      // @ts-expect-error - Testing fallback behavior
      const { container } = render(<PaymentIcon type="UnknownCard" variant="unknown" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });
});
