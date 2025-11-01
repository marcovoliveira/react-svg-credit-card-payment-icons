import React, { JSX } from 'react';
import * as FlatComponents from '../generated/icons/flat';
import * as FlatRoundedComponents from '../generated/icons/flat-rounded';
import * as LogoComponents from '../generated/icons/logo';
import * as LogoBorderComponents from '../generated/icons/logo-border';
import * as MonoComponents from '../generated/icons/mono';
import * as MonoOutlineComponents from '../generated/icons/mono-outline';
import type { SVGProps } from 'react';

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

// @deprecated Use PaymentType instead
export type PaymentTypeExtended = PaymentType | 'Generic' | 'Code';

const defaultType = 'generic' as PaymentType;
const defaultCategory = 'flat';

const aspectRatio = 780 / 500; // Width / Height of the svgs.

const defaultWidth = 40;

type PaymentIconProps = {
  type: PaymentType | 'Amex'; // Amex is an alias for Americanexpress
  format?: PaymentCategory;
} & SVGProps<SVGSVGElement>;

export function PaymentIcon(props: PaymentIconProps): JSX.Element {
  const category = (props.format || defaultCategory) as PaymentCategory;
  if (!categoryMappings[category])
    throw new Error(
      `Invalid category: ${category} please use one of ${Object.keys(categoryMappings).join(', ')}`
    );
  const formatedType = props.type?.toLowerCase() ?? defaultType;
  const sanitizedType = (formatedType || defaultType).replace(/[-_]/g, '');
  let normalizedType = sanitizedType.charAt(0).toUpperCase() + sanitizedType.slice(1);

  // Alias: Amex -> Americanexpress
  if (normalizedType === 'Amex') {
    normalizedType = 'Americanexpress';
  }

  const cardProvider = normalizedType as PaymentType;
  const categoryComponents = categoryMappings[category];

  const Component: (props: SVGProps<SVGSVGElement>) => JSX.Element =
    categoryComponents[cardProvider] ?? FlatRoundedComponents.Generic;

  const width =
    props.width ?? (props.height ? (props.height as number) * aspectRatio : defaultWidth);
  const height = props.height ?? (width as number) / aspectRatio;

  return <Component {...props} width={width} height={height} viewBox="0 0 780 500" />;
}

export {
  detectCardType,
  validateCardNumber,
  formatCardNumber,
  validateCardForType,
  getCardLengthRange,
  isCardNumberPotentiallyValid,
  maskCardNumber,
  sanitizeCardNumber,
} from './utils/cardUtils';

// Export individual icon components for tree-shaking
export * as flat from '../generated/icons/flat';
export * as flatRounded from '../generated/icons/flat-rounded';
export * as logo from '../generated/icons/logo';
export * as logoBorder from '../generated/icons/logo-border';
export * as mono from '../generated/icons/mono';
export * as monoOutline from '../generated/icons/mono-outline';
