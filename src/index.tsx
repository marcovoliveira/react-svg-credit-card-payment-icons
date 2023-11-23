import React from 'react';
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

type PaymentType = keyof typeof FlatComponents &
  keyof typeof FlatRoundedComponents &
  keyof typeof LogoComponents &
  keyof typeof LogoBorderComponents &
  keyof typeof MonoComponents &
  keyof typeof MonoOutlineComponents;

type PaymentCategory = keyof typeof categoryMappings;

export type PaymentTypeExtended = PaymentType | 'Generic' | 'Code';

const defaultType = 'generic' as PaymentTypeExtended;
const defaultCategory = 'flat';

const aspectRatio = 780 / 500; // Width / Height of the svgs.

const defaultWidth = 40;

type PaymentIconProps = {
  type: PaymentTypeExtended;
  format?: PaymentCategory;
} & SVGProps<SVGSVGElement>;

export function PaymentIcon(props: PaymentIconProps): JSX.Element {
  const category = props.format || defaultCategory as PaymentCategory;
  if(!categoryMappings[category]) throw new Error(`Invalid category: ${category} please use one of ${Object.keys(categoryMappings).join(', ')}`);
  const cardProvider = (props.type || defaultType).charAt(0).toUpperCase() + (props.type || defaultType).slice(1) as PaymentType;

  const categoryComponents = categoryMappings[category]; 

  const Component: (props: SVGProps<SVGSVGElement>) => JSX.Element = categoryComponents[cardProvider] ?? FlatRoundedComponents.Generic;

  const width = props.width === undefined && props.height === undefined ? defaultWidth : props.width as number;

  return <Component
    {...props}
    fill='#000'
    width={width}
    height={width / aspectRatio}
    viewBox="0 0 780 500"
 />;
}


