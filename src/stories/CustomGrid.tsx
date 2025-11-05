import React, { JSX, SVGProps } from 'react';
import './CustomGrid.css';

export interface GridProps {
  Components: {
    [key: string]: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  };
  getAliases?: (typeName: string) => string[];
}

const CustomGrid: React.FC<GridProps> = ({ Components, getAliases }) => {
  const componentNames = Object.keys(Components);

  return (
    <div className="custom-grid-container">
      {componentNames.map((componentName, index) => {
        const DynamicComponent = Components[componentName];
        const width = 100;
        const aspectRatio = 780 / 500;
        const aliases = getAliases ? getAliases(componentName) : [];

        return (
          <div className="grid-item" key={index}>
            <div>
              <DynamicComponent width="100" viewBox="0 0 780 500" height={width / aspectRatio} />
            </div>
            <span>{componentName}</span>
            {aliases.length > 0 && (
              <div className="aliases-caption">
                <span className="aliases-label">Aliases:</span>
                {aliases.map((alias, i) => (
                  <code key={i} className="alias-badge">{alias}</code>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CustomGrid;
