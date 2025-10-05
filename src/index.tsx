import React, { JSX } from 'react';
import * as FlatComponents from './icons-generated/flat';
import * as FlatRoundedComponents from './icons-generated/flat-rounded';
import * as LogoComponents from './icons-generated/logo';
import * as LogoBorderComponents from './icons-generated/logo-border';
import * as MonoComponents from './icons-generated/mono';
import * as MonoOutlineComponents from './icons-generated/mono-outline';
import type { SVGProps } from "react";

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
  if(!categoryMappings[category]) throw new Error(`Invalid category: ${category} please use one of ${Object.keys(categoryMappings).join(', ')}`);
  const formatedType = props.type?.toLowerCase() ?? defaultType;
  const sanitizedType = (formatedType || defaultType).replace(/[-_]/g, "");
  let normalizedType = sanitizedType.charAt(0).toUpperCase() + sanitizedType.slice(1);

  // Alias: Amex -> Americanexpress
  if (normalizedType === 'Amex') {
    normalizedType = 'Americanexpress';
  }

  const cardProvider = normalizedType as PaymentType;
  const categoryComponents = categoryMappings[category];

  const Component: (props: SVGProps<SVGSVGElement>) => JSX.Element = categoryComponents[cardProvider] ?? FlatRoundedComponents.Generic;

  const width = props.width ?? (props.height ? (props.height as number) * aspectRatio : defaultWidth);
  const height = props.height ?? (width as number) / aspectRatio;

  return <Component
    {...props}
    fill='#000'
    width={width}
    height={height}
    viewBox="0 0 780 500"
 />;
}

export {
  detectCardType,
  validateCardNumber,
  formatCardNumber,
  validateCardForType,
  getCardLengthRange,
  isCardNumberPotentiallyValid,
  maskCardNumber,
  sanitizeCardNumber
} from './utils/cardUtils';


