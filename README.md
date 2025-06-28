# React SVG Card Payment Icons 

[![npm](https://img.shields.io/npm/v/react-svg-credit-card-payment-icons)](https://www.npmjs.com/package/react-svg-credit-card-payment-icons)
[![TypeScript](https://badgen.net/npm/types/env-var)](http://www.typescriptlang.org/)
[![​npm​](https://img.shields.io/npm/dm/react-svg-credit-card-payment-icons)](https://www.npmjs.com/package/react-svg-credit-card-payment-icons)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![GitHub stars](https://img.shields.io/github/stars/marcovoliveira/react-svg-credit-card-payment-icons.svg?style=social)](https://github.com/marcovoliveira/react-svg-credit-card-payment-icons)
[![](https://img.shields.io/badge/-Contribute%20with%20a%20%E2%98%85!-%23ffd700)](https://github.com/marcovoliveira/react-svg-credit-card-payment-icons)  
[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/marcovoliveira)

# SVG Credit Card & Payment Icons: 6 Styles, 80 Icons for React ⚛️
A collection of SVG based credit card logo icons. 
React componnent with Typescript support.

### [Live Demo](https://marcovoliveira.github.io/react-svg-credit-card-payment-icons/?path=/docs/payment-cards--docs)


## 💿 Installation


1) Install this package:
```bash
npm install react-svg-credit-card-payment-icons
# or
yarn add react-svg-credit-card-payment-icons
```

### 📦 Usage

```tsx
import { PaymentIcon } from 'react-svg-credit-card-payment-icons';
```
....
```tsx
const App = () => {
  return (
    <PaymentIcon type="visa" format="flatRounded" width={100} />
  );
};
```

### 🔧 Card Utilities

As of version 4, the package includes powerful card detection and validation utilities:

```tsx
import { 
  detectCardType, 
  validateCardNumber, 
  formatCardNumber,
  maskCardNumber,
  isCardNumberPotentiallyValid 
} from 'react-svg-credit-card-payment-icons';

// Detect card type from number
const cardType = detectCardType('4242424242424242'); // Returns 'Visa'

// Validate card number using Luhn algorithm
const isValid = validateCardNumber('4242424242424242'); // Returns true

// Format card number with appropriate spacing
const formatted = formatCardNumber('4242424242424242'); // Returns '4242 4242 4242 4242'

// Mask card number (shows only last 4 digits)
const masked = maskCardNumber('4242424242424242'); // Returns '**** **** **** 4242'

// Check if card number is potentially valid (correct length, etc.)
const isPotentiallyValid = isCardNumberPotentiallyValid('4242424242424242'); // Returns true
```

#### Available Utility Functions:

| Function | Description | Example |
|----------|-------------|---------|
| `detectCardType(cardNumber)` | Detects card type from number | `detectCardType('4242...') // 'Visa'` |
| `validateCardNumber(cardNumber)` | Validates using Luhn algorithm | `validateCardNumber('4242...') // true` |
| `formatCardNumber(cardNumber)` | Formats with appropriate spacing | `formatCardNumber('4242...') // '4242 4242 4242 4242'` |
| `maskCardNumber(cardNumber)` | Masks all but last 4 digits | `maskCardNumber('4242...') // '**** **** **** 4242'` |
| `isCardNumberPotentiallyValid(cardNumber)` | Checks if potentially valid | `isCardNumberPotentiallyValid('4242') // false` |
| `validateCardForType(cardNumber, type)` | Validates for specific card type | `validateCardForType('4242...', 'Visa') // true` |
| `getCardLengthRange(cardType)` | Gets min/max length for card type | `getCardLengthRange('Visa') // {min: 13, max: 19}` |
| `sanitizeCardNumber(cardNumber)` | Removes non-digit characters | `sanitizeCardNumber('4242-4242') // '42424242'` |

#### Complete Example with Card Input:

```tsx
import React, { useState } from 'react';
import { 
  PaymentIcon, 
  detectCardType, 
  validateCardNumber, 
  formatCardNumber 
} from 'react-svg-credit-card-payment-icons';

function CardInput() {
  const [cardNumber, setCardNumber] = useState('');
  const cardType = detectCardType(cardNumber);
  const isValid = validateCardNumber(cardNumber);

  return (
    <div>
      <input
        type="text"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        placeholder="Enter card number"
      />
      <PaymentIcon type={cardType} width={40} />
      <div>Type: {cardType}</div>
      <div>Valid: {isValid ? 'Yes' : 'No'}</div>
      <div>Formatted: {formatCardNumber(cardNumber)}</div>
    </div>
  );
}
```

## [Types and Formats](https://marcovoliveira.github.io/react-svg-credit-card-payment-icons/?path=/story/test-your-card--default&args=type:Generic)

### Available `types` and their images:

If the type does not exist, the default setting is generic.

|Type    |Image
|---    |---
|`alipay`    |<img src="https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/raw/main/src/icons/flat-rounded/alipay.svg" width=80/>
|`amex` |<img src="https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/raw/main/src/icons/flat-rounded/amex.svg" width=80/>
|`diners`    |<img src="https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/raw/main/src/icons/flat-rounded/diners.svg" width=80/>
|`discover`   |<img src="https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/raw/main/src/icons/flat-rounded/discover.svg" width=80/>
|`elo`    |<img src="https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/raw/main/src/icons/flat-rounded/elo.svg" width=80/>
|`hiper`    |<img src="https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/raw/main/src/icons/flat-rounded/hiper.svg" width=80/>
|`hipercard`   |<img src="https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/raw/main/src/icons/flat-rounded/hipercard.svg" width=80/>
|`jcb`    |<img src="https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/raw/main/src/icons/flat-rounded/jcb.svg" width=80/>
|`maestro`   |<img src="https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/raw/main/src/icons/flat-rounded/maestro.svg" width=80/>
|`mastercard`   |<img src="https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/raw/main/src/icons/flat-rounded/mastercard.svg" width=80/>
|`mir`    |<img src="https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/raw/main/src/icons/flat-rounded/mir.svg" width=80/>
|`paypal`    |<img src="https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/raw/main/src/icons/flat-rounded/paypal.svg" width=80/>
|`unionpay`   |<img src="https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/raw/main/src/icons/flat-rounded/unionpay.svg" width=80/>
|`visa`    |<img src="https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/raw/main/src/icons/flat-rounded/visa.svg" width=80/>
|`generic`  |<img src="https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/raw/main/src/icons/flat-rounded/generic.svg" width=80/>
|`code`  |<img src="https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/raw/main/src/icons/flat-rounded/code.svg" width=80/>
|`codefront`  |<img src="https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/raw/main/src/icons/flat-rounded/code-front.svg" width=80/>

Images from [`aaronfagan/svg-credit-card-payment-icons`](https://github.com/aaronfagan/svg-credit-card-payment-icons)


### Available `formats`:

If the format is not specified, the default setting is flat. 

|Format    |Image
|---    |---
|`flat`    |<img src="https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/raw/main/src/icons/flat/mastercard.svg" width=80/>
|`flatRounded`    |<img src="https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/raw/main/src/icons/flat-rounded/mastercard.svg" width=80/>
|`logo`    |<img src="https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/raw/main/src/icons/logo/mastercard.svg" width=80/>
|`logoBorder`    |<img src="https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/raw/main/src/icons/logo-border/mastercard.svg" width=80/>
|`mono`    |<img src="https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/raw/main/src/icons/mono/mastercard.svg" width=80/>
|`monoOutline`    |<img src="https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/raw/main/src/icons/mono-outline/mastercard.svg" width=80/>


* Specify either width or height; there's no requirement to define both. The aspect ratio is preset at 780:500 for SVGs. If neither width nor height is defined, width will default to 40.

* The component also allows all the properties (props) of the Svg component, including attributes like style.

* If an invalid type is provided, the default setting is generic.