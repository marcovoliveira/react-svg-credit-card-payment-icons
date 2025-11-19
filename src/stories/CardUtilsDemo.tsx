import React, { useState } from 'react';
import { PaymentIcon, type PaymentType } from '../index';
import {
  getCardType,
  validateCardNumber,
  formatCardNumber,
  maskCardNumber,
  isCardNumberPotentiallyValid,
} from '../utils/cardUtils';
import { CARD_METADATA } from '../../generated/cardMetadata';

// Helper to get display name for a card type
function getDisplayName(type: PaymentType): string {
  const card = CARD_METADATA.find((c) => c.type === type || c.legacyType === type);
  return card?.displayName || type;
}

// Helper to get issuing countries for a card type
function getIssuingCountries(type: PaymentType): string[] | null {
  const card = CARD_METADATA.find((c) => c.type === type || c.legacyType === type);
  return card?.issuingCountries || null;
}

// Format countries for display
function formatCountries(countries: string[] | null): string {
  if (!countries) return 'N/A';
  if (countries.includes('GLOBAL')) return '🌍 Global';
  if (countries.length > 3)
    return `${countries.slice(0, 3).join(', ')} +${countries.length - 3} more`;
  return countries.join(', ');
}

export default function CardUtilsDemo() {
  const [cardNumber, setCardNumber] = useState('');
  const [detectedType, setDetectedType] = useState<PaymentType>('Generic');
  const [isValid, setIsValid] = useState(false);
  const [isPotentiallyValid, setIsPotentiallyValid] = useState(false);

  const handleCardNumberChange = (value: string) => {
    setCardNumber(value);

    const detected = getCardType(value);
    setDetectedType(detected);

    setIsValid(validateCardNumber(value));
    setIsPotentiallyValid(isCardNumberPotentiallyValid(value));
  };

  const testCards = [
    { displayName: 'Visa', number: '4242424242424242' },
    { displayName: 'Mastercard', number: '5555555555554444' },
    { displayName: 'American Express', number: '378282246310005' },
    { displayName: 'JCB', number: '3530111333300000' },
    { displayName: 'UnionPay', number: '6200000000000005' },
    { displayName: 'Elo', number: '6362970000457013' },
    { displayName: 'Mir', number: '2200000000000000' },
    { displayName: 'Hipercard', number: '6062825624254001' },
    { displayName: 'Discover', number: '6011111111111117' },
    { displayName: 'Diners Club', number: '30569309025904' },
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Card Detection & Validation Utilities Demo</h1>

      {/* Card Input Section */}
      <div style={{ marginBottom: '30px' }}>
        <h2>Try Card Detection</h2>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => handleCardNumberChange(e.target.value)}
          placeholder="Enter card number"
          style={{
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '300px',
          }}
        />

        <div style={{ marginTop: '15px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px',
            }}
          >
            <strong>Detected Type:</strong>
            <PaymentIcon type={detectedType} format="flatRounded" width={30} />
            <span>{getDisplayName(detectedType)}</span>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Issuing Countries:</strong> {formatCountries(getIssuingCountries(detectedType))}
          </div>

          <div>
            <strong>Formatted:</strong> {formatCardNumber(cardNumber)}
          </div>
          <div>
            <strong>Masked:</strong> {maskCardNumber(cardNumber)}
          </div>
          <div>
            <strong>Valid:</strong>{' '}
            <span style={{ color: isValid ? 'green' : 'red' }}>{isValid ? 'Yes' : 'No'}</span>
          </div>
          <div>
            <strong>Potentially Valid:</strong>{' '}
            <span style={{ color: isPotentiallyValid ? 'green' : 'red' }}>
              {isPotentiallyValid ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>

      {/* Test Cards Section */}
      <div>
        <h2>Test Cards</h2>
        <p>Click on any test card to try it:</p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px',
          }}
        >
          {testCards.map((card, index) => (
            <div
              key={index}
              onClick={() => handleCardNumberChange(card.number)}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#f9f9f9',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
            >
              <PaymentIcon type={getCardType(card.number)} format="flatRounded" width={40} />
              <div>
                <div>
                  <strong>{card.displayName}</strong>
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {formatCardNumber(card.number)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Documentation */}
      <div style={{ marginTop: '40px' }}>
        <h2>Available Utilities</h2>
        <div
          style={{
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          <h3>Functions:</h3>
          <ul>
            <li>
              <code>detectCardType(cardNumber: string, useLegacy?: boolean): PaymentType</code> -
              Detects card type from number. Set <code>useLegacy=true</code> for v4 type names.
            </li>
            <li>
              <code>validateCardNumber(cardNumber: string): boolean</code> - Validates using Luhn
              algorithm
            </li>
            <li>
              <code>formatCardNumber(cardNumber: string): string</code> - Formats with appropriate
              spacing
            </li>
            <li>
              <code>maskCardNumber(cardNumber: string): string</code> - Masks all but last 4 digits
            </li>
            <li>
              <code>isCardNumberPotentiallyValid(cardNumber: string): boolean</code> - Checks if
              potentially valid
            </li>
            <li>
              <code>validateCardForType(cardNumber: string, cardType: PaymentType): boolean</code> -
              Validates for specific type
            </li>
            <li>
              <code>getCardLengthRange(cardType: PaymentType): object</code> - Gets min/max length
              for card type
            </li>
            <li>
              <code>sanitizeCardNumber(cardNumber: string): string</code> - Removes non-digit
              characters
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
