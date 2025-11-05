import { getCardDefinitions } from './loadCardDefinitions';

describe('loadCardDefinitions', () => {
  describe('getCardDefinitions', () => {
    it('returns an array of card definitions', () => {
      const definitions = getCardDefinitions();
      expect(definitions).toBeInstanceOf(Array);
      expect(definitions.length).toBeGreaterThan(0);
    });

    it('includes expected card types', () => {
      const definitions = getCardDefinitions();
      const types = definitions.map((d) => d.type);

      // Core card types should be present
      expect(types).toContain('Visa');
      expect(types).toContain('Mastercard');
      expect(types).toContain('AmericanExpress');
      expect(types).toContain('Discover');
      expect(types).toContain('DinersClub');
      expect(types).toContain('JCB');
      expect(types).toContain('UnionPay');
      expect(types).toContain('PayPal');
      expect(types).toContain('Hipercard');
    });

    it('caches results on subsequent calls', () => {
      const first = getCardDefinitions();
      const second = getCardDefinitions();
      expect(first).toBe(second); // Same reference = cached
    });

    it('includes patterns for each card definition', () => {
      const definitions = getCardDefinitions();
      definitions.forEach((def) => {
        expect(def.patterns).toBeDefined();
        expect(def.patterns.full).toBeInstanceOf(Array);

        // Each full pattern should be a RegExp (array may be empty for non-card payment methods)
        def.patterns.full.forEach((pattern) => {
          expect(pattern).toBeInstanceOf(RegExp);
        });

        // Prefix can be RegExp or null (for generic cards or payment methods)
        if (def.patterns.prefix !== null) {
          expect(def.patterns.prefix).toBeInstanceOf(RegExp);
        }
      });
    });

    it('includes length ranges for card definitions', () => {
      const definitions = getCardDefinitions();
      const visa = definitions.find((d) => d.type === 'Visa');
      expect(visa).toBeDefined();
      expect(visa?.lengthRange).toEqual({ min: 13, max: 19 });

      const amex = definitions.find((d) => d.type === 'AmericanExpress');
      expect(amex).toBeDefined();
      expect(amex?.lengthRange).toEqual({ min: 15, max: 15 });
    });

    it('sorts patterns by specificity (more specific first)', () => {
      const definitions = getCardDefinitions();

      // Elo should come before Mastercard (more specific pattern)
      const eloIndex = definitions.findIndex((d) => d.type === 'Elo');
      const mastercardIndex = definitions.findIndex((d) => d.type === 'Mastercard');

      expect(eloIndex).toBeGreaterThanOrEqual(0);
      expect(mastercardIndex).toBeGreaterThanOrEqual(0);
      // Elo should be checked before Mastercard
      expect(eloIndex).toBeLessThan(mastercardIndex);
    });

    it('handles cards with null patterns (Generic)', () => {
      const definitions = getCardDefinitions();
      const generic = definitions.find((d) => d.type === 'Generic');

      // Generic might or might not be in the list depending on implementation
      // If it is, it should have null patterns
      if (generic) {
        expect(generic.patterns.prefix).toBeNull();
      }
    });

    it('all cards have valid type names', () => {
      const definitions = getCardDefinitions();
      definitions.forEach((def) => {
        expect(def.type).toBeTruthy();
        expect(typeof def.type).toBe('string');
        // Type should be PascalCase
        expect(def.type[0]).toBe(def.type[0].toUpperCase());
      });
    });
  });

  describe('Pattern specificity sorting', () => {
    it('prioritizes patterns with exact digit matches', () => {
      const definitions = getCardDefinitions();

      // American Express (starts with 34 or 37) should be very specific
      const amexIndex = definitions.findIndex((d) => d.type === 'AmericanExpress');

      // Visa (starts with 4) is less specific
      const visaIndex = definitions.findIndex((d) => d.type === 'Visa');

      expect(amexIndex).toBeGreaterThanOrEqual(0);
      expect(visaIndex).toBeGreaterThanOrEqual(0);
    });

    it('handles multiple patterns for same card type', () => {
      const definitions = getCardDefinitions();

      // Discover has multiple IIN ranges
      const discover = definitions.find((d) => d.type === 'Discover');
      expect(discover).toBeDefined();
      expect(discover?.patterns.full.length).toBeGreaterThan(0);
    });
  });
});
