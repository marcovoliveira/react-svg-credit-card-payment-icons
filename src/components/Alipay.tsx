import React from 'react';
import AlipaySVG from '../icons/flat/alipay.svg'
import { SVGComponentProps } from '../index';
export const Alipay = (props: SVGComponentProps) => {
  return (
      <img src={AlipaySVG} {...props}/>
  );
}