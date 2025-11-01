import React, { JSX, SVGProps } from 'react';
import './CustomGrid.css';

export interface GridProps {
  Components: {
    [key: string]: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  };
}

const CustomGrid: React.FC<GridProps> = ({ Components }) => {
  const componentNames = Object.keys(Components);

  return (
    <div className="custom-grid-container">
      {componentNames.map((componentName, index) => {
        const DynamicComponent = Components[componentName];
        const width = 100;
        const aspectRatio = 780 / 500;
        return (
          <div className="grid-item" key={index}>
            <div>
              <DynamicComponent width="100" viewBox="0 0 780 500" height={width / aspectRatio} />
            </div>
            <span>{componentName}</span>
          </div>
        );
      })}
    </div>
  );
};

export default CustomGrid;
