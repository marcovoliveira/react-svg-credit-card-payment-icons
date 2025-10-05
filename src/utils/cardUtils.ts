import type { PaymentType } from '../index';

// Card number patterns for different card types
const cardPatterns: Record<PaymentType, RegExp[]> = {
  Visa: [/^4[0-9]{12}(?:[0-9]{3})?$/],
  Mastercard: [
    /^5[1-5][0-9]{14}$/,
    /^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
  ],
  Americanexpress: [/^3[47][0-9]{13}$/],
  Discover: [/^6(?:011|5[0-9]{2})[0-9]{12}$/],
  Diners: [/^3[0689][0-9]{11}$/, /^30[0-5][0-9]{11}$/],
  Jcb: [/^(?:2131|1800|35[0-9]{3})[0-9]{11}$/],
  Unionpay: [/^62[0-9]{14,17}$/],
  Maestro: [/^(?:5[0678][0-9]{2}|6304|6390|67[0-9]{2})[0-9]{8,15}$/],
  Elo: [
    /^(?:4011(78|79)|43(1274|8935)|45(1416|7393|763(1|2))|50(4175|6699|67[0-6][0-9]|677[0-8]|9[0-8][0-9]{2}|99[0-8][0-9]|999[0-9])|627780|63(6297|6368|6369))[0-9]*$/,
  ],
  Hiper: [/^(606282\d{10}(\d{3})?)|(3841\d{15})$/],
  Hipercard: [/^(606282\d{10}(\d{3})?)|(3841\d{15})$/],
  Mir: [/^220[0-4][0-9]{12}$/],
  Paypal: [], // PayPal doesn't have card numbers
  Alipay: [], // Alipay doesn't have card numbers
  Generic: [],
  Code: [],
  CodeFront: [],
  Swish: [],
};

// IIN (Issuer Identification Number) ranges for faster detection
const iinPatterns: Record<PaymentType, string[]> = {
  Visa: ['4'],
  Mastercard: [
    '51',
    '52',
    '53',
    '54',
    '55',
    '222',
    '223',
    '224',
    '225',
    '226',
    '227',
    '228',
    '229',
    '23',
    '24',
    '25',
    '26',
    '27',
  ],
  Americanexpress: ['34', '37'],
  Discover: ['6011', '622', '64', '65'],
  Diners: ['300', '301', '302', '303', '304', '305', '36', '38'],
  Jcb: ['35', '2131', '1800'],
  Unionpay: ['62'],
  Maestro: ['50', '56', '57', '58', '6304', '6390', '67'],
  Elo: [
    '401178',
    '401179',
    '431274',
    '438935',
    '451416',
    '457393',
    '457631',
    '457632',
    '504175',
    '506699',
    '5067',
    '627780',
    '636297',
    '636368',
    '636369',
  ],
  Hiper: ['606282', '3841'],
  Hipercard: ['606282', '3841'],
  Mir: ['2200', '2201', '2202', '2203', '2204'],
  Paypal: [],
  Alipay: [],
  Generic: [],
  Code: [],
  CodeFront: [],
  Swish: [],
};

/**
 * Removes all non-digit characters from a card number
 */
export function sanitizeCardNumber(cardNumber: string): string {
  return cardNumber.replace(/\D/g, '');
}

/**
 * Detects the card type based on the card number using IIN patterns
 */
export function detectCardType(cardNumber: string): PaymentType {
  const sanitized = sanitizeCardNumber(cardNumber);

  if (sanitized.length < 4) {
    return 'Generic';
  }

  // Check IIN patterns for faster detection
  for (const cardType in iinPatterns) {
    const patterns = iinPatterns[cardType as PaymentType];
    for (const pattern of patterns) {
      if (sanitized.startsWith(pattern)) {
        return cardType as PaymentType;
      }
    }
  }

  // Fallback to full regex validation for edge cases
  for (const cardType in cardPatterns) {
    const patterns = cardPatterns[cardType as PaymentType];
    for (const pattern of patterns) {
      if (pattern.test(sanitized)) {
        return cardType as PaymentType;
      }
    }
  }

  return 'Generic';
}

/**
 * Validates a card number using the Luhn algorithm
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
 * Formats a card number with appropriate spacing for the detected card type
 */
export function formatCardNumber(cardNumber: string): string {
  const sanitized = sanitizeCardNumber(cardNumber);
  const cardType = detectCardType(sanitized);

  // Different formatting patterns for different card types
  switch (cardType) {
    case 'Americanexpress':
      // American Express: 4-6-5 format (e.g., 3782 822463 10005)
      return sanitized.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
    case 'Diners':
      // Diners Club: 4-6-4 format (e.g., 3056 930009 0904)
      return sanitized.replace(/(\d{4})(\d{6})(\d{4})/, '$1 $2 $3');
    default:
      // Most cards: 4-4-4-4 format (e.g., 4242 4242 4242 4242)
      return sanitized.replace(/(\d{4})(?=\d)/g, '$1 ');
  }
}

/**
 * Validates a card number for a specific card type
 */
export function validateCardForType(cardNumber: string, cardType: PaymentType): boolean {
  const sanitized = sanitizeCardNumber(cardNumber);
  const patterns = cardPatterns[cardType];

  if (patterns.length === 0) {
    return false; // For non-card payment methods
  }

  return patterns.some((pattern) => pattern.test(sanitized)) && validateCardNumber(sanitized);
}

/**
 * Gets the expected length range for a card type
 */
export function getCardLengthRange(cardType: PaymentType): { min: number; max: number } | null {
  switch (cardType) {
    case 'Americanexpress':
      return { min: 15, max: 15 };
    case 'Diners':
      return { min: 14, max: 14 };
    case 'Visa':
      return { min: 13, max: 19 };
    case 'Mastercard':
      return { min: 16, max: 16 };
    case 'Discover':
      return { min: 16, max: 16 };
    case 'Jcb':
      return { min: 15, max: 16 };
    case 'Unionpay':
      return { min: 16, max: 19 };
    case 'Maestro':
      return { min: 12, max: 19 };
    case 'Elo':
      return { min: 16, max: 16 };
    case 'Hiper':
    case 'Hipercard':
      return { min: 16, max: 16 };
    case 'Mir':
      return { min: 16, max: 16 };
    default:
      return null;
  }
}

/**
 * Checks if a card number is potentially valid (correct length and passes basic checks)
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
 * Gets a masked version of the card number (shows only last 4 digits)
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
