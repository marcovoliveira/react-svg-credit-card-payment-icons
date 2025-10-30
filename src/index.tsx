import React, { JSX } from 'react';
import * as FlatComponents from './icons/flat/components/index';
import * as FlatRoundedComponents from './icons/flat-rounded/components/index';
import * as LogoComponents from './icons/logo/components/index';
import * as LogoBorderComponents from './icons/logo-border/components/index';
import * as MonoComponents from './icons/mono/components/index';
import * as MonoOutlineComponents from './icons/mono-outline/components/index';
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
  type: PaymentType;
  format?: PaymentCategory;
} & SVGProps<SVGSVGElement>;

export function PaymentIcon(props: PaymentIconProps): JSX.Element {
  const category = (props.format || defaultCategory) as PaymentCategory;
  if(!categoryMappings[category]) throw new Error(`Invalid category: ${category} please use one of ${Object.keys(categoryMappings).join(', ')}`);
  const formatedType = props.type?.toLowerCase() ?? defaultType;
  const sanitizedType = (formatedType || defaultType).replace(/[-_]/g, "");
  const cardProvider = sanitizedType.charAt(0).toUpperCase() + sanitizedType.slice(1) as PaymentType;
  
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


