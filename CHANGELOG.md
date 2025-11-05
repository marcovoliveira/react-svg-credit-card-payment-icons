# react-svg-credit-card-payment-icons

## Unreleased

## 5.1.0

Contributed by @codybrom.

### Deprecations

- **`detectCardType()` is now deprecated** in favor of the new `getCardType()` function:
  - `detectCardType()` continues to work and returns legacy v4.x type names (`'Americanexpress'`, `'Diners'`, `'Unionpay'`, `'Paypal'`, `'Jcb'`)
  - New `getCardType()` function returns canonical type names (`'AmericanExpress'`, `'DinersClub'`, `'UnionPay'`, `'PayPal'`, `'JCB'`)
  - Migration is optional - both functions will continue to work
  - Recommended migration:

    ```javascript
    // v4/v5 (deprecated but still works)
    const type = detectCardType(cardNumber); // 'Americanexpress'

    // v5+ (recommended)
    const type = getCardType(cardNumber);    // 'AmericanExpress'
    ```

  - **Component usage**: `<PaymentIcon type="..." />` accepts all type names and aliases (`Amex`, `Diners`, `Americanexpress`, `AmericanExpress`, etc.) for full compatibility

### Major Changes

- JSON Schema Validation for Card Metadata
  - Added JSON schema (`schemas/card-metadata.schema.json`) for YAML configuration validation
  - VS Code integration provides autocomplete and validation for card YAML files
  - Ensures correct field types and required properties
  - Helpful descriptions and examples for each field

- Card Variant Support
  - Added support for card variants through YAML configuration
  - Variant aliases automatically resolve to the correct visual style
  - Example: `<PaymentIcon type="Hiper" />` automatically uses the Hiper-branded variant
  - Explicit variant prop also supported: `<PaymentIcon type="Hipercard" variant="hiper" />`
  - Variants can have their own display names, authors, licenses, and aliases
  - Hiper and Hipercard variants now properly distinguished:
    - `Hiper` - Orange/yellow branded Hiper logo
    - `Hipercard` - Standard Hipercard branding
    - Both Hiper variants share the same IIN ranges but have distinct visual identities
  - Code and CodeFront are now variants of Generic:
    - `Generic` - Standard generic card front
    - `Code` (aliases: `Cvv`, `Cvc`) - Generic card back with security code
    - `CodeFront` (aliases: `CvvFront`, `CvcFront`) - Generic card front with security code
  - Tree-shakeable variant imports: `import { Hiper, Hipercard, Code, CodeFront } from 'react-svg-credit-card-payment-icons/icons/flat-rounded'`

### Minor Changes

- Storybook v10 Upgrade (PR #1)
  - Upgraded Storybook from v9.1.10 to v10.0.4
  - ESM-only distribution with 29% smaller installation size
  - Migrated from renderer-based to framework-based configuration
  - Added eslint-plugin-storybook for enhanced linting
  - Updated TypeScript configuration to support ESM modules (moduleResolution: bundler)
  - Improved documentation and component stories

### Patch Changes

- Fixed component resolution logic to properly handle variant aliases
- Fixed test failures in Storybook interaction tests for Hiper color validation
- Updated icon paths in documentation to reflect new hipercard folder structure
- Enhanced generator to use YAML `type` field for component naming, allowing precise control over casing

## 5.0.0

@codybrom contributed a major refactor to the library, improving architecture, developer experience, and bundle optimization.

### Major Changes

- Architecture Refactor (PR #18)
  - Complete modernization of library architecture
  - Vendor-based icon organization for easier maintenance
  - Build-time component generation using `@svgr/core` using pre-hooks
  - Removed ~200 files of generalizable components from version control
  - Fixed improper vendor detection ([#16](https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/issues/16)) with a new longest-match algorithm for handling overlapping IIN ranges
  - Added package subpath exports for tree-shakable bundles
    - Import specific icons: `import { Visa } from 'react-svg-credit-card-payment-icons/icons/flat'`
    - Reduces bundle size from ~700KB to ~5-15KB when importing individual icons
    - Available paths: `/icons/flat`, `/icons/flat-rounded`, `/icons/logo`, `/icons/logo-border`, `/icons/mono`, `/icons/mono-outline`
  - Added comprehensive Jest unit tests for card utilities and Vitest integration for Storybook component tests
  - Added ESLint 9 with a modern flat configuration
  - Standardized package manager to pnpm ([#12](https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/issues/12))

- React 19 Compatibility (PR #13)
  - Full support for React 19 with proper camelCase SVG attribute handling ([#11](https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/issues/11))
  - Fixed SVG attribute naming to use React 19-compatible format
  - Fixed CSS properties in style tags (hyphenated format for CSS, camelCase for JSX attributes)

- Storybook v9 Upgrade (PR #15)
  - Upgraded Storybook to v9 with Vite
  - Modernized Storybook deployment workflow ([#14](https://github.com/marcovoliveira/react-svg-credit-card-payment-icons/issues/14))
  - Improved documentation and component stories

## 4.2.1

### Patch Changes

- fix: add utils export for card utility functions

## 4.2.0

### Minor Changes

- Add Vite compatibility

## 4.1.0

### Minor Changes

- 3f4fd3b: add Swish payment provider

## 3.1.1

### Patch Changes

- update dependencies

## 3.1.0

### Minor Changes

- update readme

## 3.0.0

### Major Changes

- Thanks to Adrian Rubio we have mastercard, maestro and visa new cards following brand guidelines, also added code front, code and generic to logo-border and logo types. PaymentTypesExtended is deprecated and you should use PaymentTypes type that contains the same set of types.

## 2.1.3

### Patch Changes

- update readme

## 2.1.2

### Patch Changes

- fix docs add string formatting

## 2.1.1

### Patch Changes

- storybook fix

## 2.1.0

### Minor Changes

- 87db82a: Update svg
- Storbook demo app

## 2.0.0

### Major Changes

- 5b5c788: SVG generation

### Minor Changes

- 44c93de: SVG build

## 1.0.1

### Patch Changes

- df73860: Update github jobs
- 8a0f7d9: readme update
- d04521e: versioning
