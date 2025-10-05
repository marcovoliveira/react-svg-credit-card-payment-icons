import {
  detectCardType,
  validateCardNumber,
  formatCardNumber,
  maskCardNumber,
  sanitizeCardNumber
} from '../src/utils/cardUtils';

// Test the card utilities
console.log('=== Card Utilities Test ===');

// Test card numbers
const testCards = [
  '4242424242424242', // Visa
  '5555555555554444', // Mastercard  
  '378282246310005',  // Amex
  '6011111111111117', // Discover
  '30569309025904',   // Diners
];

testCards.forEach(cardNumber => {
  console.log(`\nCard: ${cardNumber}`);
  console.log(`Type: ${detectCardType(cardNumber)}`);
  console.log(`Valid: ${validateCardNumber(cardNumber)}`);
  console.log(`Formatted: ${formatCardNumber(cardNumber)}`);
  console.log(`Masked: ${maskCardNumber(cardNumber)}`);
  console.log(`Sanitized: ${sanitizeCardNumber(cardNumber)}`);
});

export {}; // Make this a module
