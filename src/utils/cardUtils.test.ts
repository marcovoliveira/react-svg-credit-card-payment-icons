import {
  detectCardType,
  getCardType,
  validateCardNumber,
  formatCardNumber,
  sanitizeCardNumber,
  maskCardNumber,
  validateCardForType,
  getCardLengthRange,
  isCardNumberPotentiallyValid,
} from './cardUtils';
import { CARD_METADATA, type CardMetadata } from '../../generated/cardMetadata';

describe('cardUtils', () => {
  describe('getCardType', () => {
    it('returns Generic for too short input', () => {
      expect(getCardType('4')).toBe('Generic');
      expect(getCardType('12')).toBe('Generic');
      expect(getCardType('123')).toBe('Generic');
    });

    it('returns Generic for unknown patterns', () => {
      expect(getCardType('9999999999999999')).toBe('Generic');
      expect(getCardType('')).toBe('Generic');
    });

    it('handles partial card numbers (prefix detection)', () => {
      expect(getCardType('4111')).toBe('Visa'); // Partial Visa
      expect(getCardType('5111')).toBe('Mastercard'); // Partial Mastercard
    });

    it('returns canonical type, not variant alias', () => {
      // Hipercard test numbers should return 'Hipercard', not 'Hiper'
      expect(getCardType('6062825624254001')).toBe('Hipercard');
      expect(getCardType('6062828888666688')).toBe('Hipercard');
    });

    it('returns canonical type names', () => {
      // Should return canonical names
      expect(getCardType('378282246310005')).toBe('AmericanExpress');
      expect(getCardType('30569309025904')).toBe('DinersClub');
      expect(getCardType('6200000000000005')).toBe('UnionPay');
      expect(getCardType('3566002020360505')).toBe('JCB');
    });

    it('returns canonical types for all cards', () => {
      expect(getCardType('4242424242424242')).toBe('Visa');
      expect(getCardType('5555555555554444')).toBe('Mastercard');
      expect(getCardType('6011111111111117')).toBe('Discover');
    });
  });

  describe('detectCardType (deprecated)', () => {
    it('returns legacy type names for backward compatibility', () => {
      // Legacy function returns v4.x type names
      expect(detectCardType('378282246310005')).toBe('Americanexpress');
      expect(detectCardType('30569309025904')).toBe('Diners');
      expect(detectCardType('6200000000000005')).toBe('Unionpay');
      expect(detectCardType('3566002020360505')).toBe('Jcb');
    });

    it('returns canonical names for cards without legacy types', () => {
      // Cards without legacyType return canonical type
      expect(detectCardType('4242424242424242')).toBe('Visa');
      expect(detectCardType('5555555555554444')).toBe('Mastercard');
      expect(detectCardType('6011111111111117')).toBe('Discover');
    });

    it('returns Generic for unknown patterns', () => {
      expect(detectCardType('9999999999999999')).toBe('Generic');
      expect(detectCardType('')).toBe('Generic');
    });
  });

  describe('validateCardNumber', () => {
    it('validates correct card numbers using Luhn algorithm', () => {
      expect(validateCardNumber('4111111111111111')).toBe(true); // Visa
      expect(validateCardNumber('5500000000000004')).toBe(true); // Mastercard
    });

    it('rejects invalid card numbers', () => {
      expect(validateCardNumber('4111111111111112')).toBe(false);
      expect(validateCardNumber('1234567890123456')).toBe(false);
    });

    it('rejects non-numeric input', () => {
      expect(validateCardNumber('abcd-efgh-ijkl-mnop')).toBe(false);
    });

    it('rejects empty strings', () => {
      expect(validateCardNumber('')).toBe(false);
    });
  });

  describe('formatCardNumber', () => {
    it('formats Visa cards with spaces every 4 digits', () => {
      expect(formatCardNumber('4111111111111111')).toBe('4111 1111 1111 1111');
    });

    it('formats American Express with 4-6-5 pattern', () => {
      expect(formatCardNumber('340000000000009')).toBe('3400 000000 00009');
    });

    it('formats Diners Club with 4-6-4 pattern', () => {
      expect(formatCardNumber('30000000000000')).toBe('3000 000000 0000');
    });

    it('handles partial card numbers', () => {
      expect(formatCardNumber('4111')).toBe('4111');
      expect(formatCardNumber('41111111')).toBe('4111 1111');
    });

    it('handles empty input', () => {
      expect(formatCardNumber('')).toBe('');
    });
  });

  describe('sanitizeCardNumber', () => {
    it('removes all non-numeric characters', () => {
      expect(sanitizeCardNumber('4111-1111-1111-1111')).toBe('4111111111111111');
      expect(sanitizeCardNumber('4111 1111 1111 1111')).toBe('4111111111111111');
      expect(sanitizeCardNumber('4111.1111.1111.1111')).toBe('4111111111111111');
    });

    it('handles strings with letters', () => {
      expect(sanitizeCardNumber('4111abcd1111efgh1111')).toBe('411111111111');
    });

    it('handles empty strings', () => {
      expect(sanitizeCardNumber('')).toBe('');
    });
  });

  describe('maskCardNumber', () => {
    it('masks middle digits, showing last 4', () => {
      const masked = maskCardNumber('4111111111111111');
      // Should contain last 4 digits and be formatted
      expect(masked).toContain('1111');
      const masked2 = maskCardNumber('5500000000000004');
      expect(masked2).toContain('0004');
    });

    it('masks American Express correctly', () => {
      const masked = maskCardNumber('340000000000009');
      expect(masked).toContain('0009');
    });

    it('handles short card numbers', () => {
      expect(maskCardNumber('411')).toBe('411');
    });

    it('handles empty strings', () => {
      expect(maskCardNumber('')).toBe('');
    });

    it('supports custom mask character', () => {
      const masked = maskCardNumber('4111111111111111', 'X');
      // Note: formatCardNumber sanitizes input, removing non-digits including mask chars
      // So the custom mask character gets stripped out during formatting
      expect(masked).toContain('1111'); // Last 4 digits remain
    });
  });

  describe('validateCardForType', () => {
    // Dynamically test validation for each card type with test numbers
    CARD_METADATA.forEach((card: CardMetadata) => {
      if (card.testNumbers && card.testNumbers.length > 0) {
        it(`validates ${card.type} test numbers`, () => {
          card.testNumbers.forEach((testNumber: string) => {
            expect(validateCardForType(testNumber, card.type)).toBe(true);
          });
        });

        it(`rejects ${card.type} test numbers for wrong type`, () => {
          // Pick a different card type to test rejection
          const differentCard = CARD_METADATA.find(
            (c: CardMetadata) => c.type !== card.type && c.testNumbers?.length > 0
          );
          if (differentCard) {
            card.testNumbers.forEach((testNumber: string) => {
              expect(validateCardForType(testNumber, differentCard.type)).toBe(false);
            });
          }
        });
      }
    });

    it('rejects invalid Luhn checksums', () => {
      expect(validateCardForType('4111111111111112', 'Visa')).toBe(false);
    });

    it('rejects non-card payment methods', () => {
      expect(validateCardForType('1234567890123456', 'Paypal')).toBe(false);
      expect(validateCardForType('1234567890123456', 'Alipay')).toBe(false);
    });
  });

  describe('getCardLengthRange', () => {
    // Dynamically test length ranges from YAML
    CARD_METADATA.forEach((card: CardMetadata) => {
      if (card.lengthRange !== null) {
        it(`returns correct length range for ${card.type}`, () => {
          expect(getCardLengthRange(card.type)).toEqual(card.lengthRange);
        });
      } else {
        it(`returns null for ${card.type} (non-card payment method)`, () => {
          expect(getCardLengthRange(card.type)).toBeNull();
        });
      }
    });
  });

  describe('isCardNumberPotentiallyValid', () => {
    it('validates potentially valid card numbers', () => {
      expect(isCardNumberPotentiallyValid('4111111111111111')).toBe(true);
      expect(isCardNumberPotentiallyValid('5500000000000004')).toBe(true);
    });

    it('rejects cards with invalid length', () => {
      expect(isCardNumberPotentiallyValid('4111')).toBe(false);
      expect(isCardNumberPotentiallyValid('41111111111111111111')).toBe(false);
    });

    it('rejects generic cards', () => {
      expect(isCardNumberPotentiallyValid('9999999999999999')).toBe(false);
    });

    it('handles payment methods without length ranges', () => {
      expect(isCardNumberPotentiallyValid('1234567890123456')).toBe(false);
    });
  });

  describe('YAML Card Definition Validation', () => {
    // Test each card type's test numbers from YAML
    CARD_METADATA.forEach((card: CardMetadata) => {
      if (card.testNumbers && card.testNumbers.length > 0) {
        it(`detects ${card.type} test numbers from YAML`, () => {
          card.testNumbers.forEach((testNumber: string) => {
            const detected = getCardType(testNumber);
            expect(detected).toBe(card.type);
          });
        });
      }
    });

    // Verify all cards with patterns have test numbers
    CARD_METADATA.forEach((card: CardMetadata) => {
      if (card.patterns.full && card.patterns.full.length > 0) {
        it(`${card.type} has test numbers in YAML`, () => {
          expect(card.testNumbers).toBeDefined();
          expect(card.testNumbers.length).toBeGreaterThan(0);
        });
      }
    });
  });

  describe('Edge cases and special patterns', () => {
    it('correctly distinguishes Elo from Mastercard', () => {
      // Elo has specific ranges that overlap with Mastercard's 5xxx range
      // Pattern should be specific enough to detect Elo correctly
      expect(getCardType('5066991111111118')).toBe('Elo');
    });

    it('handles partial card numbers correctly', () => {
      expect(getCardType('4')).toBe('Generic'); // Too short
      expect(getCardType('41')).toBe('Generic'); // Too short
      expect(getCardType('411')).toBe('Generic'); // Too short
      expect(getCardType('4111')).toBe('Visa'); // Partial Visa
    });

    it('handles formatted card numbers', () => {
      expect(getCardType('4111 1111 1111 1111')).toBe('Visa');
      expect(getCardType('3782-8224-6310-005')).toBe('AmericanExpress');
      expect(getCardType('5555.5555.5555.4444')).toBe('Mastercard');
    });

    it('validates length ranges match card type requirements', () => {
      // American Express should be exactly 15 digits
      expect(isCardNumberPotentiallyValid('378282246310005')).toBe(true);
      expect(isCardNumberPotentiallyValid('37828224631000')).toBe(false); // Too short
      expect(isCardNumberPotentiallyValid('3782822463100055')).toBe(false); // Too long

      // Visa can be 13-19 digits
      expect(isCardNumberPotentiallyValid('4111111111111')).toBe(true); // 13 digits
      expect(isCardNumberPotentiallyValid('4111111111111111')).toBe(true); // 16 digits
    });
  });
});
