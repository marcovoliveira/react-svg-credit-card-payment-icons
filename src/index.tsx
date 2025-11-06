import React, { JSX } from 'react';
import * as FlatComponents from '../generated/icons/flat';
import * as FlatRoundedComponents from '../generated/icons/flat-rounded';
import * as LogoComponents from '../generated/icons/logo';
import * as LogoBorderComponents from '../generated/icons/logo-border';
import * as MonoComponents from '../generated/icons/mono';
import * as MonoOutlineComponents from '../generated/icons/mono-outline';
import type { SVGProps } from 'react';
import { CARD_METADATA } from '../generated/cardMetadata';

/** SVG component props with optional width and height. */
export type SVGComponentProps = {
  width?: number;
  height?: number;
};

const categoryMappings = {
  flat: FlatComponents,
  flatRounded: FlatRoundedComponents,
  logo: LogoComponents,
  logoBorder: LogoBorderComponents,
  mono: MonoComponents,
  monoOutline: MonoOutlineComponents,
};

/**
 * Supported payment types: Visa, Mastercard, AmericanExpress, Discover, Paypal, etc.
 * Includes generated alias components like Amex, Americanexpress, Cvv, Diners, etc.
 *
 * @example
 * const type: PaymentType = 'Visa';
 * const canonical: PaymentType = 'AmericanExpress'; // Valid PaymentType (canonical name)
 * const alias: PaymentType = 'Amex'; // Valid PaymentType (alias)
 */
export type PaymentType = keyof typeof FlatComponents &
  keyof typeof FlatRoundedComponents &
  keyof typeof LogoComponents &
  keyof typeof LogoBorderComponents &
  keyof typeof MonoComponents &
  keyof typeof MonoOutlineComponents;

type PaymentCategory = keyof typeof categoryMappings;

/** @deprecated Use PaymentType instead */
export type PaymentTypeExtended = PaymentType | 'Generic' | 'Code';

const defaultType = 'generic' as PaymentType;
const defaultCategory = 'flat';

const aspectRatio = 780 / 500; // Width / Height of the svgs.

const defaultWidth = 40;

/**
 * Resolves a type string (potentially an alias or variant) to its canonical PaymentType and optional variant slug.
 *
 * This function checks the card metadata for:
 * 1. Exact type name matches (e.g., 'Visa', 'Mastercard')
 * 2. Regular aliases (e.g., 'Amex' → 'Americanexpress')
 * 3. Variant aliases (e.g., 'Hiper' → { type: 'Hipercard', variant: 'hiper' })
 *
 * @param input - The input type string (e.g., 'Amex', 'Visa', 'Hiper', 'Cvv')
 * @returns Object with canonical type and optional variant slug
 *
 * @example
 * resolveAlias('Visa')  // → { type: 'Visa' }
 * resolveAlias('Amex')  // → { type: 'AmericanExpress' }
 * resolveAlias('Hiper') // → { type: 'Hipercard', variant: 'hiper' }
 */
function resolveAlias(input: string): { type: string; variant?: string } {
  // Search through card metadata for matching alias or variant
  for (const card of CARD_METADATA) {
    // Check if input matches the type name itself
    if (card.type === input) {
      return { type: card.type };
    }

    // Check if input matches a regular alias
    if (card.aliases.some((alias) => alias === input)) {
      return { type: card.type };
    }

    // Check if input matches a variant alias
    if (card.variants) {
      for (const [variantAlias, variantDef] of Object.entries(card.variants)) {
        if (variantAlias === input) {
          return { type: card.type, variant: variantDef.slug };
        }
      }
    }
  }

  return { type: input };
}

type PaymentIconProps = {
  /**
   * Payment card type or alias to render.
   *
   * Accepts:
   * - Type names: 'Visa', 'Mastercard', 'Americanexpress', etc.
   * - Aliases: 'Amex' (→ Americanexpress), 'Cvv' (→ Code), etc.
   * - Variants: 'Hiper' (→ Hipercard hiper variant)
   *
   * All aliases and variants are defined in card YAML files and resolved automatically.
   */
  type: PaymentType;
  /**
   * Icon style format.
   *
   * @default 'flat'
   */
  format?: PaymentCategory;
  /**
   * Optional variant slug to use for cards with multiple visual styles.
   *
   * Example: `variant="hiper"` renders the Hiper-branded version of Hipercard.
   *
   * Note: Variant aliases (like 'Hiper') automatically select the variant,
   * so this prop is only needed when using the base type name with explicit variant selection.
   *
   * @example
   * <PaymentIcon type="Hipercard" variant="hiper" />  // Explicit variant
   * <PaymentIcon type="Hiper" />                      // Automatic via alias
   */
  variant?: string;
} & SVGProps<SVGSVGElement>;

/**
 * Payment icon component with automatic sizing, format selection, and alias/variant resolution.
 *
 * Features:
 * - Maintains 780:500 aspect ratio automatically
 * - Resolves aliases and variants from card definitions
 * - Supports 6 visual formats (flat, flatRounded, logo, logoBorder, mono, monoOutline)
 * - Falls back to Generic icon for unsupported types
 * - Accepts all standard SVG props (className, style, onClick, etc.)
 *
 * @param props - Component props including type, format, variant, and standard SVG attributes
 * @returns React component rendering the appropriate payment card icon
 *
 * @example
 * Method 1: PaymentIcon component (universal)
 * ```tsx
 * import { PaymentIcon } from 'react-svg-credit-card-payment-icons';
 *
 * <PaymentIcon type="Visa" format="flatRounded" width={100} />
 * <PaymentIcon type="Mastercard" format="logo" width={100} />
 * ```
 *
 * @example
 * Method 2: Unified icon components with format prop
 * ```tsx
 * import { VisaIcon, MastercardIcon } from 'react-svg-credit-card-payment-icons';
 *
 * <VisaIcon format="flatRounded" width={100} />
 * <MastercardIcon format="logo" width={100} />
 * ```
 *
 * @example
 * Method 3: Format-specific components (recommended for smallest bundle)
 * ```tsx
 * import { VisaFlatRoundedIcon, MastercardLogoIcon } from 'react-svg-credit-card-payment-icons';
 *
 * <VisaFlatRoundedIcon width={100} />
 * <MastercardLogoIcon width={100} />
 * ```
 *
 * @example
 * Method 4: Vendor-specific imports
 * ```tsx
 * import { VisaFlatRoundedIcon, VisaLogoIcon } from 'react-svg-credit-card-payment-icons/visa';
 *
 * <VisaFlatRoundedIcon width={100} />
 * <VisaLogoIcon width={100} />
 * ```
 *
 * @example
 * Using aliases (resolved automatically)
 * ```tsx
 * <PaymentIcon type="Amex" />           // → AmericanExpress
 * <PaymentIcon type="Cvv" />            // → Code (back security code)
 * <PaymentIcon type="Diners" />         // → DinersClub
 * ```
 *
 * @example
 * Using variants
 * ```tsx
 * // Method 1: Use variant alias directly (recommended)
 * <PaymentIcon type="Hiper" />
 *
 * // Method 2: Use base type with explicit variant prop
 * <PaymentIcon type="Hipercard" variant="hiper" />
 *
 * // Method 3: Format-specific with variant
 * <HipercardFlatRoundedIcon variant="Hiper" />
 * ```
 *
 * @example
 * Legacy format-specific path imports (still supported)
 * ```tsx
 * import { Visa, Mastercard } from 'react-svg-credit-card-payment-icons/icons/flat-rounded';
 * <Visa width={100} />
 * <Mastercard width={100} />
 * ```
 *
 * @see {@link https://github.com/marcovoliveira/react-svg-credit-card-payment-icons | GitHub Repository}
 */
export function PaymentIcon(props: PaymentIconProps): JSX.Element {
  const category = (props.format || defaultCategory) as PaymentCategory;
  if (!categoryMappings[category])
    throw new Error(
      `Invalid category: ${category} please use one of ${Object.keys(categoryMappings).join(', ')}`
    );

  // Resolve alias to canonical type and variant
  const inputType = props.type || defaultType;
  const resolved = resolveAlias(inputType);
  const sanitizedType = resolved.type.replace(/[-_]/g, '');
  const normalizedType = sanitizedType.charAt(0).toUpperCase() + sanitizedType.slice(1);

  const categoryComponents = categoryMappings[category];

  // Determine component key based on whether variant came from alias or explicit prop
  let Component: (props: SVGProps<SVGSVGElement>) => JSX.Element | undefined;

  if (resolved.variant && !props.variant) {
    // Variant came from alias resolution - use original input type as component name
    const sanitizedInput = inputType.replace(/[-_]/g, '');
    const normalizedInput = sanitizedInput.charAt(0).toUpperCase() + sanitizedInput.slice(1);
    Component = categoryComponents[normalizedInput as PaymentType];
  } else if (props.variant) {
    // Explicit variant prop - try composite key first, then variant alone
    const sanitizedVariant = props.variant.replace(/[-_]/g, '');
    const normalizedVariant = sanitizedVariant.charAt(0).toUpperCase() + sanitizedVariant.slice(1);
    const compositeKey = `${normalizedType}${normalizedVariant}`;
    Component =
      categoryComponents[compositeKey as PaymentType] ??
      categoryComponents[normalizedVariant as PaymentType];
  } else {
    // No variant - use base type
    Component = categoryComponents[normalizedType as PaymentType];
  }

  // Final fallback to Generic
  if (!Component) {
    Component = FlatRoundedComponents.Generic;
  }

  const width =
    props.width ?? (props.height ? (props.height as number) * aspectRatio : defaultWidth);
  const height = props.height ?? (width as number) / aspectRatio;

  return <Component {...props} width={width} height={height} viewBox="0 0 780 500" />;
}

export {
  detectCardType,
  getCardType,
  validateCardNumber,
  formatCardNumber,
  validateCardForType,
  getCardLengthRange,
  isCardNumberPotentiallyValid,
  maskCardNumber,
  sanitizeCardNumber,
  getCardsByCountry,
} from './utils/cardUtils';

// Export canonical card type for type checking
export type { CanonicalCardType } from '../generated/cardMetadata';

// Export individual icon components for tree-shaking
export * as flat from '../generated/icons/flat';
export * as flatRounded from '../generated/icons/flat-rounded';
export * as logo from '../generated/icons/logo';
export * as logoBorder from '../generated/icons/logo-border';
export * as mono from '../generated/icons/mono';
export * as monoOutline from '../generated/icons/mono-outline';

// Export unified icon components with format selection
export * from '../generated/unifiedIcons';
