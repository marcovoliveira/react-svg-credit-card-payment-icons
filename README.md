[![npm](https://img.shields.io/npm/v/react-svg-credit-card-payment-icons)](https://www.npmjs.com/package/react-svg-credit-card-payment-icons)
[![TypeScript](https://badgen.net/npm/types/env-var)](http://www.typescriptlang.org/)
[![​npm​](https://img.shields.io/npm/dm/react-svg-credit-card-payment-icons)](https://www.npmjs.com/package/react-svg-credit-card-payment-icons)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![GitHub stars](https://img.shields.io/github/stars/marcovoliveira/react-svg-credit-card-payment-icons.svg?style=social)](https://github.com/marcovoliveira/react-svg-credit-card-payment-icons)
[![](https://img.shields.io/badge/-Contribute%20with%20a%20%E2%98%85!-%23ffd700)](https://github.com/marcovoliveira/react-svg-credit-card-payment-icons)

# SVG Credit Card & Payment Icons: 6 Styles, 80 Icons
A collection of SVG based credit card logo icons.


## 💿 Installation


1) Install this package:
```bash
npm install react-svg-credit-card-payment-icons
# or
yarn add react-svg-credit-card-payment-icons
```

### 📦 Usage

```tsx
import PaymentIcon from 'react-svg-credit-card-payment-icons';
```
....
```tsx
const App = () => {
  return (
    <PaymentIcon type="visa" format="flatRounded" width={80} />
  );
};
```

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
|`cvv`  |<img src="https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/raw/main/src/icons/flat-rounded/code.svg" width=80/>

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