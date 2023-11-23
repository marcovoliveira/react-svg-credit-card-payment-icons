import React from 'react';
import GenericSVG from '../icons/flat/generic.svg'
import { SVGComponentProps } from '../index';
export const Generic = (props: SVGComponentProps) => {
  return (
      <img src={GenericSVG} {...props}/>
  );
}