# Icons Directory

This directory contains SVG icons and metadata for all payment card types supported by the library.

## Directory Structure

Each card type has its own folder with:

- 6 SVG files (one for each format)
- 1 YAML configuration file

```txt
icons/
├── visa/
│   ├── visa-flat.svg
│   ├── visa-flat-rounded.svg
│   ├── visa-logo.svg
│   ├── visa-logo-border.svg
│   ├── visa-mono.svg
│   ├── visa-mono-outline.svg
│   └── visa.yml
├── mastercard/
│   └── ...
└── README.md
```

## Adding a New Card Type

### 1. Create the Folder

Create a new folder with the card type name in **lowercase** (e.g., `newcard/`)

### 2. Add SVG Files

Add 6 SVG files with the following naming pattern:

- `newcard-flat.svg`
- `newcard-flat-rounded.svg`
- `newcard-logo.svg`
- `newcard-logo-border.svg`
- `newcard-mono.svg`
- `newcard-mono-outline.svg`

**SVG Requirements:**

- ViewBox: `0 0 780 500` (aspect ratio 1.56:1)
- Clean, optimized SVG code
- Use inline styles or class-based styling (will be converted to inline during build)
- Credit card should be centered in the viewBox

### 3. Create YAML Configuration

Create a `newcard.yml` file with the card's metadata.

**Note:** If you're using VS Code with the recommended YAML extension (Red Hat's `vscode-yaml`), you'll get autocomplete and validation based on the JSON schema at `schemas/card-metadata.schema.json`.

```yaml
# Card validation definition for NewCard
type: NewCard
displayName: NewCard
iconAuthor: Icon Author Name
iconLicense: Apache-2.0
aliases:
  - NC
  - NewCardAlias
testNumbers:
  - '1234567890123456' # Test number (Stripe or industry standard)
patterns:
  full: '^1234\\d{12}$'
  prefix: '^1234'
lengthRange:
  min: 16
  max: 16
```

#### YAML Fields Explained

- **`type`** (required): The canonical component name (PascalCase, e.g., `NewCard`, `DinersClub`)
  - This determines the generated TypeScript component name
  - Use PascalCase with proper capitalization (e.g., `DinersClub` not `Dinersclub`)

- **`displayName`** (optional): Human-readable name shown in documentation

- **`iconAuthor`** (required): Original SVG creator's name

- **`iconLicense`** (required): License for the SVG files (typically `Apache-2.0`)

- **`aliases`** (optional): Alternative names that resolve to this card type
  - Example: `Amex` → `AmericanExpress`
  - Used for common abbreviations or alternative spellings

- **`testNumbers`** (required): Valid test card numbers for unit tests
  - Use industry-standard test numbers (Stripe, payment processor docs)
  - Must pass Luhn validation
  - Include variations if the card supports multiple lengths

- **`patterns`** (required): Regular expressions for card number detection
  - **`full`**: Complete validation pattern (string or array of strings)
  - **`prefix`**: Quick prefix check for early detection
  - Use `null` for generic/non-validated cards (e.g., `Generic`, `Code`)

- **`lengthRange`** (required): Valid card number length
  - **`min`**: Minimum number of digits
  - **`max`**: Maximum number of digits
  - Use `null` for cards without specific length requirements

### 4. Generate Components

Run the generator to create React components from your SVGs:

```bash
npm run generate
```

This will:

- Convert SVGs to TypeScript React components
- Generate exports for all formats
- Create type definitions
- Update card metadata

### 5. Test Your Card

Add tests to verify your card works correctly:

```typescript
// In src/utils/cardUtils.test.ts
it('detects NewCard', () => {
  expect(detectCardType('1234567890123456')).toBe('NewCard');
});

it('formats NewCard correctly', () => {
  expect(formatCardNumber('1234567890123456')).toBe('1234 5678 9012 3456');
});
```

Run tests:

```bash
npm test
```

## Card Variants

Some card networks have multiple visual styles (e.g., Hiper vs Hipercard). To add a variant:

### Example: Adding a Variant

```yaml
type: Hipercard
displayName: Hipercard
iconAuthor: Aaron Fagan
iconLicense: Apache-2.0
aliases: []
variants:
  Hiper:
    slug: hiper
testNumbers:
  - '6062825000000000'
patterns:
  full: "^(606282\\d{10}(\\d{3})?)|(3841\\d{15})$"
  prefix: '^(606282|3841)'
lengthRange:
  min: 16
  max: 16
```

In your folder, include both sets of SVGs:

- `hipercard-*.svg` (base type)
- `hiper-*.svg` (variant)

The variant alias (`Hiper`) will automatically generate a separate component that users can import or use via the `PaymentIcon` component.

## Best Practices

### SVG Optimization

- Use [SVGO](https://github.com/svg/svgo) to optimize SVGs before adding them
- Remove unnecessary metadata and comments
- Ensure consistent viewBox across all formats

### Naming Conventions

- **Folder names**: lowercase (e.g., `visa`, `dinersclub`, `hipercard`)
- **File names**: lowercase with hyphens (e.g., `visa-flat-rounded.svg`)
- **YAML `type`**: PascalCase (e.g., `Visa`, `DinersClub`, `Hipercard`)
- **Aliases**: Match common usage (e.g., `Amex` for `AmericanExpress`)

### Card Number Patterns

- Use the most specific pattern possible
- Test patterns with real card numbers (use test numbers only!)
- Reference: [Wikipedia - Payment card number](https://en.wikipedia.org/wiki/Payment_card_number)

### Testing

- Always add test cases for new cards
- Test card detection with multiple test numbers
- Test formatting works correctly
- Test length validation

## Resources

- **SVG Icons**: [aaronfagan/svg-credit-card-payment-icons](https://github.com/aaronfagan/svg-credit-card-payment-icons)
- **Card Number Formats**: [Stripe Testing](https://stripe.com/docs/testing)
- **IIN Ranges**: [Wikipedia - List of Issuer Identification Numbers](https://en.wikipedia.org/wiki/Payment_card_number#Issuer_identification_number_(IIN))
- **Luhn Algorithm**: [Wikipedia - Luhn algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm)

## Questions?

Open an issue on GitHub or check the main [README.md](../../README.md) for more information.
