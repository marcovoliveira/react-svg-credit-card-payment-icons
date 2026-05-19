import React, { JSX } from 'react';
import * as FlatComponents from '../generated/icons-native/flat';
import * as FlatRoundedComponents from '../generated/icons-native/flat-rounded';
import * as LogoComponents from '../generated/icons-native/logo';
import * as LogoBorderComponents from '../generated/icons-native/logo-border';
import * as MonoComponents from '../generated/icons-native/mono';
import * as MonoOutlineComponents from '../generated/icons-native/mono-outline';
import type { SvgProps } from 'react-native-svg';
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

const aspectRatio = 780 / 500;
const defaultWidth = 40;

function resolveAlias(input: string): { type: string; variant?: string } {
  for (const card of CARD_METADATA) {
    if (card.type === input) {
      return { type: card.type };
    }
    if (card.aliases.some((alias) => alias === input)) {
      return { type: card.type };
    }
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
  type: PaymentType;
  format?: PaymentCategory;
  variant?: string;
} & SvgProps;

/**
 * Payment icon component for React Native.
 *
 * Uses react-native-svg under the hood. Maintains 780:500 aspect ratio automatically.
 */
export function PaymentIcon(props: PaymentIconProps): JSX.Element {
  const category = (props.format || defaultCategory) as PaymentCategory;
  if (!categoryMappings[category])
    throw new Error(
      `Invalid category: ${category} please use one of ${Object.keys(categoryMappings).join(', ')}`
    );

  const inputType = props.type || defaultType;
  const resolved = resolveAlias(inputType);
  const sanitizedType = resolved.type.replace(/[-_]/g, '');
  const normalizedType = sanitizedType.charAt(0).toUpperCase() + sanitizedType.slice(1);

  const categoryComponents = categoryMappings[category];

  let Component: ((props: SvgProps) => JSX.Element) | undefined;

  if (resolved.variant && !props.variant) {
    const sanitizedInput = inputType.replace(/[-_]/g, '');
    const normalizedInput = sanitizedInput.charAt(0).toUpperCase() + sanitizedInput.slice(1);
    Component = categoryComponents[normalizedInput as PaymentType];
  } else if (props.variant) {
    const sanitizedVariant = props.variant.replace(/[-_]/g, '');
    const normalizedVariant = sanitizedVariant.charAt(0).toUpperCase() + sanitizedVariant.slice(1);
    const compositeKey = `${normalizedType}${normalizedVariant}`;
    Component =
      categoryComponents[compositeKey as PaymentType] ??
      categoryComponents[normalizedVariant as PaymentType];
  } else {
    Component = categoryComponents[normalizedType as PaymentType];
  }

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

export type { CanonicalCardType } from '../generated/cardMetadata';

export * as flat from '../generated/icons-native/flat';
export * as flatRounded from '../generated/icons-native/flat-rounded';
export * as logo from '../generated/icons-native/logo';
export * as logoBorder from '../generated/icons-native/logo-border';
export * as mono from '../generated/icons-native/mono';
export * as monoOutline from '../generated/icons-native/mono-outline';
