import React, { useState } from 'react';
import { 
  PaymentIcon,
  type PaymentType 
} from '../index';
import {
  detectCardType, 
  validateCardNumber, 
  formatCardNumber,
  maskCardNumber,
  isCardNumberPotentiallyValid,
} from '../utils/cardUtils';

export default function CardUtilsDemo() {
  const [cardNumber, setCardNumber] = useState('');
  const [detectedType, setDetectedType] = useState<PaymentType>('Generic');
  const [isValid, setIsValid] = useState(false);
  const [isPotentiallyValid, setIsPotentiallyValid] = useState(false);

  const handleCardNumberChange = (value: string) => {
    setCardNumber(value);
    
    const detected = detectCardType(value);
    setDetectedType(detected);
    
    setIsValid(validateCardNumber(value));
    setIsPotentiallyValid(isCardNumberPotentiallyValid(value));
  };

  const testCards = [
    { type: 'Visa', number: '4242424242424242' },
    { type: 'Mastercard', number: '5555555555554444' },
    { type: 'Amex', number: '378282246310005' },
    { type: 'Discover', number: '6011111111111117' },
    { type: 'Diners', number: '30569309025904' },
    { type: 'JCB', number: '3530111333300000' },
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
            width: '300px'
          }}
        />
        
        <div style={{ marginTop: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <strong>Detected Type:</strong>
            <PaymentIcon type={detectedType} format="flatRounded" width={30} />
            <span>{detectedType}</span>
          </div>
          
          <div><strong>Formatted:</strong> {formatCardNumber(cardNumber)}</div>
          <div><strong>Masked:</strong> {maskCardNumber(cardNumber)}</div>
          <div><strong>Valid:</strong> <span style={{ color: isValid ? 'green' : 'red' }}>{isValid ? 'Yes' : 'No'}</span></div>
          <div><strong>Potentially Valid:</strong> <span style={{ color: isPotentiallyValid ? 'green' : 'red' }}>{isPotentiallyValid ? 'Yes' : 'No'}</span></div>
        </div>
      </div>

      {/* Test Cards Section */}
      <div>
        <h2>Test Cards</h2>
        <p>Click on any test card to try it:</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
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
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
            >
              <PaymentIcon 
                type={detectCardType(card.number)} 
                format="flatRounded" 
                width={40} 
              />
              <div>
                <div><strong>{card.type}</strong></div>
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
        <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
          <h3>Functions:</h3>
          <ul>
            <li><code>detectCardType(cardNumber: string): PaymentType</code> - Detects card type from number</li>
            <li><code>validateCardNumber(cardNumber: string): boolean</code> - Validates using Luhn algorithm</li>
            <li><code>formatCardNumber(cardNumber: string): string</code> - Formats with appropriate spacing</li>
            <li><code>maskCardNumber(cardNumber: string): string</code> - Masks all but last 4 digits</li>
            <li><code>isCardNumberPotentiallyValid(cardNumber: string): boolean</code> - Checks if potentially valid</li>
            <li><code>validateCardForType(cardNumber: string, cardType: PaymentType): boolean</code> - Validates for specific type</li>
            <li><code>getCardLengthRange(cardType: PaymentType): object</code> - Gets min/max length for card type</li>
            <li><code>sanitizeCardNumber(cardNumber: string): string</code> - Removes non-digit characters</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
