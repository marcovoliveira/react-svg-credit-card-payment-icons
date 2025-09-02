import React from 'react';
import { render, screen } from '@testing-library/react';
import SvgAmex from './Amex';

describe('Amex', () => {
  it('should render the Amex icon with the correct blue background', () => {
    const { container } = render(<SvgAmex />);
    const pathElement = container.querySelector('path[fill="#2557D6"]');
    expect(pathElement).toBeInTheDocument();
  });
});
