import type { PaymentType } from '../index';
import type { CanonicalCardType } from '../../generated/cardMetadata';
import { getCardDefinitions } from './loadCardDefinitions';

/**
 * Removes all non-digit characters from a card number (spaces, dashes, etc.).
 *
 * @param cardNumber - Card number string, formatted or unformatted
 * @returns String containing only numeric digits
 * @example
 * sanitizeCardNumber('4242 4242 4242 4242')  // '4242424242424242'
 * sanitizeCardNumber('4242-4242-4242-4242')  // '4242424242424242'
 */
export function sanitizeCardNumber(cardNumber: string): string {
  return cardNumber.replace(/\D/g, '');
}

/**
 * Detects card type by testing against regex patterns for each card type.
 *
 * For partial card numbers (< 13 digits), tests prefix compatibility.
 * For complete card numbers, validates against full patterns.
 *
 * Returns 'Generic' for unknown or invalid cards.
 *
 * @param cardNumber - Card number (formatted or unformatted)
 * @param useLegacy - If true, returns v4.x type names for backward compatibility (default: false)
 * @returns Detected card type name
 * @example
 * detectCardType('4242424242424242')           // 'Visa'
 * detectCardType('5555 5555 5555 4444')        // 'Mastercard'
 * detectCardType('3782 822463 10005')          // 'AmericanExpress' (new in v5)
 * detectCardType('3782 822463 10005', true)    // 'Americanexpress' (v4 compatible)
 * detectCardType('30569309025904')             // 'DinersClub' (new in v5)
 * detectCardType('30569309025904', true)       // 'Diners' (v4 compatible)
 */
export function detectCardType(cardNumber: string, useLegacy: boolean = false): PaymentType {
  const sanitized = sanitizeCardNumber(cardNumber);

  if (sanitized.length < 4) {
    return 'Generic';
  }

  const isPartial = sanitized.length < 13;

  for (const { type, legacyType, patterns } of getCardDefinitions()) {
    if (isPartial) {
      if (patterns.prefix?.test(sanitized)) {
        return (useLegacy && legacyType ? legacyType : type) as PaymentType;
      }
    } else {
      if (patterns.full.some((p) => p.test(sanitized))) {
        return (useLegacy && legacyType ? legacyType : type) as PaymentType;
      }
    }
  }

  return 'Generic';
}

/**
 * Validates card number using Luhn algorithm (mod-10 checksum) and length check (13-19 digits).
 *
 * Note: Only validates mathematical correctness, not whether the card is active or funded.
 *
 * @param cardNumber - Card number (formatted or unformatted)
 * @returns true if valid, false otherwise
 * @example
 * validateCardNumber('4242424242424242')  // true
 * validateCardNumber('4242424242424243')  // false (invalid checksum)
 * validateCardNumber('123')               // false (too short)
 * @see https://en.wikipedia.org/wiki/Luhn_algorithm
 */
export function validateCardNumber(cardNumber: string): boolean {
  const sanitized = sanitizeCardNumber(cardNumber);

  if (sanitized.length < 13 || sanitized.length > 19) {
    return false;
  }

  // Luhn algorithm
  let sum = 0;
  let alternate = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized[i]);

    if (alternate) {
      digit *= 2;
      if (digit > 9) {
        digit = (digit % 10) + 1;
      }
    }

    sum += digit;
    alternate = !alternate;
  }

  return sum % 10 === 0;
}

/**
 * Formats a card number with appropriate spacing for the detected card type.
 *
 * This function automatically detects the card type and applies the industry-standard
 * spacing format for that card brand. Formatting patterns are defined in the card's YAML configuration:
 * - American Express: 4-6-5 format (e.g., "3782 822463 10005")
 * - Diners Club: 4-6-4 for 14-digit, 4-4-4-4 for 16-digit (e.g., "3056 930902 5904" or "3056 9300 0902 0004")
 * - Most others (Visa, Mastercard, etc.): 4-4-4-4 format (e.g., "4242 4242 4242 4242")
 *
 * @param cardNumber - The card number to format (can be formatted or unformatted)
 * @returns The card number formatted with appropriate spacing
 *
 * @example
 * ```ts
 * formatCardNumber('4242424242424242')       // Returns: '4242 4242 4242 4242' (Visa)
 * formatCardNumber('378282246310005')        // Returns: '3782 822463 10005' (Amex)
 * formatCardNumber('30569309025904')         // Returns: '3056 930902 5904' (Diners 14-digit)
 * formatCardNumber('3056930009020004')       // Returns: '3056 9300 0902 0004' (Diners 16-digit)
 * formatCardNumber('5555555555554444')       // Returns: '5555 5555 5555 4444' (Mastercard)
 * formatCardNumber('4242 4242 4242 4242')    // Returns: '4242 4242 4242 4242' (already formatted)
 * ```
 *
 * @remarks
 * - Input is automatically sanitized, so pre-formatted numbers are handled correctly
 * - The format is determined by the detected card type's YAML configuration
 * - Partial card numbers will be formatted as much as possible
 * - For variable-length cards (e.g., Diners Club), format varies by actual card length
 */
export function formatCardNumber(cardNumber: string): string {
  const sanitized = sanitizeCardNumber(cardNumber);
  const cardType = detectCardType(sanitized);

  // Find the card definition to get its format pattern
  const cardDefinition = getCardDefinitions().find((def) => def.type === cardType);
  if (!cardDefinition?.formatPattern) {
    // No format pattern defined, return sanitized input
    return sanitized;
  }

  // Determine which pattern to use based on card length (for variable-length cards like Diners)
  let pattern: number[];
  if (Array.isArray(cardDefinition.formatPattern)) {
    pattern = cardDefinition.formatPattern;
  } else {
    // Length-specific format (e.g., Diners Club: 14 vs 16 digits)
    const lengthKey = sanitized.length.toString();
    pattern =
      cardDefinition.formatPattern[lengthKey] ||
      cardDefinition.formatPattern[Object.keys(cardDefinition.formatPattern)[0]];
  }

  // Apply the format pattern
  let formatted = '';
  let position = 0;
  for (const groupSize of pattern) {
    if (position >= sanitized.length) break;
    if (formatted) formatted += ' ';
    formatted += sanitized.slice(position, position + groupSize);
    position += groupSize;
  }

  // Append any remaining digits (for partial numbers)
  if (position < sanitized.length) {
    if (formatted) formatted += ' ';
    formatted += sanitized.slice(position);
  }

  return formatted;
}

/**
 * Validates that a card number matches a specific card type and passes Luhn validation.
 *
 * This function performs two checks:
 * 1. Verifies the card number matches the expected patterns for the specified card type
 * 2. Validates the card number passes Luhn algorithm checksum verification
 *
 * This is useful when you need to validate a card number against a specific expected type,
 * such as when a user explicitly selects a card brand or when enforcing payment method restrictions.
 *
 * @param cardNumber - The card number to validate (can be formatted or unformatted)
 * @param cardType - The specific payment type to validate against
 * @returns `true` if the card number matches the type and passes validation, `false` otherwise
 *
 * @example
 * ```ts
 * validateCardForType('4242424242424242', 'Visa')          // Returns: true
 * validateCardForType('4242424242424242', 'Mastercard')    // Returns: false (wrong type)
 * validateCardForType('4242424242424243', 'Visa')          // Returns: false (invalid Luhn)
 * validateCardForType('5555555555554444', 'Mastercard')    // Returns: true
 * validateCardForType('378282246310005', 'Americanexpress') // Returns: true
 * validateCardForType('', 'Paypal')                        // Returns: false (Paypal has no card numbers)
 * ```
 *
 * @remarks
 * - Returns `false` for non-card payment methods like PayPal, Alipay, etc.
 * - Both pattern matching AND Luhn validation must pass for `true` result
 * - Input is automatically sanitized before validation
 */
export function validateCardForType(cardNumber: string, cardType: PaymentType): boolean {
  const sanitized = sanitizeCardNumber(cardNumber);
  const cardEntry = getCardDefinitions().find(({ type }) => type === cardType);

  if (!cardEntry || cardEntry.patterns.full.length === 0) {
    return false; // For non-card payment methods
  }

  return (
    cardEntry.patterns.full.some((pattern) => pattern.test(sanitized)) &&
    validateCardNumber(sanitized)
  );
}

/**
 * Gets the expected length range (in digits) for a specific card type.
 *
 * Different card issuers use different card number lengths. This function returns the
 * valid minimum and maximum length for a given card type, which is useful for:
 * - Input validation and masking
 * - Determining when a user has finished entering a card number
 * - Setting maxLength attributes on input fields
 * - Progressive validation during card entry
 *
 * @param cardType - The payment type to get length information for
 * @returns An object with `min` and `max` properties, or `null` for non-card payment methods
 *
 * @example
 * ```ts
 * getCardLengthRange('Visa')           // Returns: { min: 13, max: 19 }
 * getCardLengthRange('Mastercard')     // Returns: { min: 16, max: 16 }
 * getCardLengthRange('Americanexpress') // Returns: { min: 15, max: 15 }
 * getCardLengthRange('Maestro')        // Returns: { min: 12, max: 19 }
 * getCardLengthRange('Paypal')         // Returns: null (not a card)
 * getCardLengthRange('Generic')        // Returns: null (unknown type)
 * ```
 *
 * @remarks
 * - Returns `null` for non-card payment methods (PayPal, Alipay, Swish, etc.)
 * - Most modern cards use 16 digits, but historical cards and some issuers vary
 * - Visa can range from 13-19 digits depending on the product
 * - Maestro has the widest range at 12-19 digits
 */
export function getCardLengthRange(cardType: PaymentType): { min: number; max: number } | null {
  return getCardDefinitions().find(({ type }) => type === cardType)?.lengthRange ?? null;
}

/**
 * Checks if a card number is potentially valid based on length requirements.
 *
 * This function performs a quick, non-destructive check to determine if a card number
 * COULD be valid based solely on its length for the detected card type. It's useful for:
 * - Real-time validation feedback as users type
 * - Enabling/disabling submit buttons progressively
 * - Showing validation indicators during card entry
 * - Pre-validation before making expensive API calls
 *
 * Unlike `validateCardNumber()`, this does NOT perform Luhn algorithm validation,
 * making it faster and suitable for real-time input validation.
 *
 * @param cardNumber - The card number to check (can be formatted or unformatted)
 * @returns `true` if the card number length is valid for its detected type, `false` otherwise
 *
 * @example
 * ```ts
 * isCardNumberPotentiallyValid('4242')           // Returns: false (too short for Visa)
 * isCardNumberPotentiallyValid('424242424242')   // Returns: true (valid length for Visa)
 * isCardNumberPotentiallyValid('4242424242424242') // Returns: true (valid length)
 * isCardNumberPotentiallyValid('42424242424242424242') // Returns: false (too long)
 * isCardNumberPotentiallyValid('3782 822463 10005')    // Returns: true (valid Amex length)
 * ```
 *
 * @remarks
 * - This is a length-only check and does NOT validate Luhn algorithm
 * - Useful for progressive validation during user input
 * - Returns `false` for non-card payment types (PayPal, Alipay, etc.)
 * - Consider using `validateCardNumber()` for final validation before submission
 */
export function isCardNumberPotentiallyValid(cardNumber: string): boolean {
  const sanitized = sanitizeCardNumber(cardNumber);
  const cardType = detectCardType(sanitized);
  const lengthRange = getCardLengthRange(cardType);

  if (!lengthRange) {
    return false;
  }

  return sanitized.length >= lengthRange.min && sanitized.length <= lengthRange.max;
}

/**
 * Creates a masked version of a card number, showing only the last 4 digits.
 *
 * This function obscures all but the last 4 digits of a card number for security purposes.
 * The masked output maintains the appropriate spacing format for the detected card type,
 * making it suitable for display in receipts, payment forms, and transaction history.
 *
 * This follows PCI DSS (Payment Card Industry Data Security Standard) guidelines which
 * allow displaying up to the first 6 and last 4 digits of a card number.
 *
 * @param cardNumber - The card number to mask (can be formatted or unformatted)
 * @param maskChar - The character to use for masking (default: '*')
 * @returns The masked card number with appropriate formatting
 *
 * @example
 * ```ts
 * maskCardNumber('4242424242424242')              // Returns: '**** **** **** 4242'
 * maskCardNumber('4242424242424242', '•')         // Returns: '•••• •••• •••• 4242'
 * maskCardNumber('378282246310005')               // Returns: '**** ****** *0005' (Amex format)
 * maskCardNumber('5555 5555 5555 4444')           // Returns: '**** **** **** 4444'
 * maskCardNumber('4242424242424242', 'X')         // Returns: 'XXXX XXXX XXXX 4242'
 * maskCardNumber('123')                           // Returns: '123' (too short to mask)
 * ```
 *
 * @remarks
 * - Only the last 4 digits are visible, all others are masked
 * - Formatting matches the card type (Amex uses 4-6-5, others use 4-4-4-4, etc.)
 * - If the card number has fewer than 4 digits, it's returned as-is without masking
 * - Input is automatically sanitized before masking
 *
 * @see {@link https://www.pcisecuritystandards.org | PCI Security Standards}
 */
export function maskCardNumber(cardNumber: string, maskChar: string = '*'): string {
  const sanitized = sanitizeCardNumber(cardNumber);

  if (sanitized.length < 4) {
    return sanitized;
  }

  const lastFour = sanitized.slice(-4);
  const maskedPortion = maskChar.repeat(sanitized.length - 4);

  return formatCardNumber(maskedPortion + lastFour);
}

/**
 * Gets a list of card types issued in a specific country/region.
 *
 * This function filters payment cards by their issuing country using ISO 3166-1 alpha-2
 * country codes. It's useful for displaying region-specific payment options or validating
 * cards based on geographic restrictions.
 *
 * @param countryCode - ISO 3166-1 alpha-2 country code (e.g., 'US', 'BR', 'CN', 'JP'), or 'GLOBAL' to get all globally available cards
 * @param options - Optional configuration
 * @param options.includeGlobal - Include globally issued cards (Visa, Mastercard, PayPal, etc.) in results (default: true)
 * @returns Array of canonical card type names issued in the specified country
 *
 * @example
 * ```ts
 * getCardsByCountry('BR')  // Returns: ['Elo', 'Hipercard', 'Visa', 'Mastercard', ...] (includes global)
 * getCardsByCountry('BR', { includeGlobal: false })  // Returns: ['Elo', 'Hipercard']
 * getCardsByCountry('US')  // Returns: ['AmericanExpress', 'Discover', 'DinersClub', 'Visa', ...]
 * getCardsByCountry('CN')  // Returns: ['Unionpay', 'Alipay', 'Visa', 'Mastercard', ...]
 * getCardsByCountry('JP')  // Returns: ['Jcb', 'Visa', 'Mastercard', ...]
 * getCardsByCountry('RU')  // Returns: ['Mir', 'Visa', 'Mastercard', ...]
 * getCardsByCountry('SE')  // Returns: ['Swish', 'Visa', 'Mastercard', ...]
 * getCardsByCountry('GLOBAL')  // Returns: ['Alipay', 'Maestro', 'Mastercard', 'Paypal', 'Visa']
 * ```
 *
 * @remarks
 * - Country codes must be two-letter uppercase ISO 3166-1 alpha-2 format or 'GLOBAL'
 * - 'GLOBAL' in metadata indicates cards available worldwide (Visa, Mastercard, PayPal, etc.)
 * - `null` in metadata indicates placeholder/generic types (excluded from all results)
 * - By default, globally issued cards are included in all country queries
 * - Set `includeGlobal: false` to only get region-specific cards
 *
 * @see {@link https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2 | ISO 3166-1 alpha-2 country codes}
 */
export function getCardsByCountry(
  countryCode: string,
  options: { includeGlobal?: boolean } = {}
): CanonicalCardType[] {
  const { includeGlobal = true } = options;
  const definitions = getCardDefinitions();

  return definitions
    .filter((def) => {
      const countries = def.issuingCountries;

      // Null means generic/placeholder - exclude from all queries
      if (countries === null) {
        return false;
      }

      // If querying for global cards specifically
      if (countryCode === 'GLOBAL') {
        return countries.includes('GLOBAL');
      }

      // Check if the card is issued in the specified country
      if (countries.includes(countryCode)) {
        return true;
      }

      // Include globally issued cards if option is enabled
      if (includeGlobal && countries.includes('GLOBAL')) {
        return true;
      }

      return false;
    })
    .map((def) => def.type);
}
