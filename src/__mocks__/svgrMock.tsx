import React from 'react';

const SvgrMock = React.forwardRef<SVGSVGElement>((props, ref) => (
  <svg ref={ref} {...props} data-testid="svg-mock" />
));

SvgrMock.displayName = 'SvgrMock';

export default SvgrMock;
