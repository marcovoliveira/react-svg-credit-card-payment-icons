import {
  sanitizeCardNumber,
  detectCardType,
  validateCardNumber,
  formatCardNumber,
  validateCardForType,
  getCardLengthRange,
  isCardNumberPotentiallyValid,
  maskCardNumber,
} from './cardUtils';

describe('cardUtils', () => {
  describe('sanitizeCardNumber', () => {
    it('should remove non-digit characters', () => {
      expect(sanitizeCardNumber('1234-5678-9012-3456')).toBe('1234567890123456');
      expect(sanitizeCardNumber('1234 5678 9012 3456')).toBe('1234567890123456');
      expect(sanitizeCardNumber('1234abcd5678')).toBe('12345678');
    });
  });

  describe('detectCardType', () => {
    const testCases = [
      { cardNumber: '4111111111111111', expected: 'Visa' },
      { cardNumber: '5111111111111111', expected: 'Mastercard' },
      { cardNumber: '2221111111111111', expected: 'Mastercard' },
      { cardNumber: '341111111111111', expected: 'Amex' },
      { cardNumber: '371111111111111', expected: 'Amex' },
      { cardNumber: '6011111111111117', expected: 'Discover' },
      { cardNumber: '30569309025904', expected: 'Diners' },
      { cardNumber: '3528111111111111', expected: 'Jcb' },
      { cardNumber: '6221261111111111', expected: 'Discover' },
      { cardNumber: '5018111111111111', expected: 'Maestro' },
      { cardNumber: '4011781111111111', expected: 'Elo' },
      { cardNumber: '6062821111111111', expected: 'Hipercard' },
      { cardNumber: '2200111111111111', expected: 'Mir' },
      { cardNumber: '1234567890', expected: 'Generic' },
    ];

    testCases.forEach(({ cardNumber, expected }) => {
      it(`should detect ${expected} for card number ${cardNumber}`, () => {
        expect(detectCardType(cardNumber)).toBe(expected);
      });
    });
  });

  describe('validateCardNumber', () => {
    it('should validate a correct card number', () => {
      expect(validateCardNumber('4242424242424242')).toBe(true);
    });

    it('should invalidate an incorrect card number', () => {
      expect(validateCardNumber('4242424242424243')).toBe(false);
    });
  });

  describe('formatCardNumber', () => {
    it('should format a standard card number', () => {
      expect(formatCardNumber('1234567890123456')).toBe('1234 5678 9012 3456');
    });

    it('should format an Amex card number', () => {
      expect(formatCardNumber('378282246310005')).toBe('3782 822463 10005');
    });

    it('should format a Diners card number', () => {
      expect(formatCardNumber('30569300090904')).toBe('3056 930009 0904');
    });
  });

  describe('validateCardForType', () => {
    it('should validate a correct card for its type', () => {
      expect(validateCardForType('4242424242424242', 'Visa')).toBe(true);
    });

    it('should not validate an incorrect card for its type', () => {
      expect(validateCardForType('5111111111111111', 'Visa')).toBe(false);
    });
  });

  describe('getCardLengthRange', () => {
    it('should return the correct length range for Amex', () => {
      expect(getCardLengthRange('Amex')).toEqual({ min: 15, max: 15 });
    });

    it('should return null for a generic card', () => {
      expect(getCardLengthRange('Generic')).toBeNull();
    });
  });

  describe('isCardNumberPotentiallyValid', () => {
    it('should return true for a potentially valid card number', () => {
      expect(isCardNumberPotentiallyValid('4111111111111')).toBe(true);
    });

    it('should return false for a number that is too short', () => {
      expect(isCardNumberPotentiallyValid('4111')).toBe(false);
    });

    it('should return false for a number that is too long', () => {
      expect(isCardNumberPotentiallyValid('411111111111111111111')).toBe(false);
    });
  });

  describe('maskCardNumber', () => {
    it('should mask a standard card number', () => {
      expect(maskCardNumber('1234567890123456')).toBe('**** **** **** 3456');
    });

    it('should mask an Amex card number', () => {
      expect(maskCardNumber('378282246310005')).toBe('**** ****** *0005');
    });

    it('should mask a Diners card number', () => {
      expect(maskCardNumber('30569300090904')).toBe('**** ****** 0904');
    });

    it('should not mask short numbers', () => {
      expect(maskCardNumber('123')).toBe('123');
    });
  });
});
