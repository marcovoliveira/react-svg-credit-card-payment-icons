#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const STYLES = ['flat', 'flat-rounded', 'logo', 'logo-border', 'mono', 'mono-outline'] as const;
const ICONS_DIR = 'src/icons';
const TEMP_DIR = 'generated/icons';

type Style = typeof STYLES[number];

function pascalCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

function getVendorDirectories(): string[] {
  return fs.readdirSync(ICONS_DIR)
    .filter(file => {
      const isDir = fs.statSync(path.join(ICONS_DIR, file)).isDirectory();
      const isStyleDir = STYLES.includes(file as Style);
      return isDir && !isStyleDir;
    });
}

function generateComponent(vendor: string, style: Style): string | undefined {
  const svgFile = `${vendor}-${style}.svg`;
  const svgPath = path.join(ICONS_DIR, vendor, svgFile);

  if (!fs.existsSync(svgPath)) return undefined;

  const componentName = pascalCase(vendor);
  const tempDir = path.join(TEMP_DIR, style);

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const relativeImport = path
    .relative(tempDir, path.join(ICONS_DIR, vendor, svgFile))
    .replace(/\\/g, '/');

  const component = `import React from "react";
import type { SVGProps } from "react";
import ${componentName}Svg from "${relativeImport}?react";

const ${componentName} = (props: SVGProps<SVGSVGElement>) => <${componentName}Svg {...props} />;

export default ${componentName};
`;

  const componentPath = path.join(tempDir, `${componentName}.tsx`);
  fs.writeFileSync(componentPath, component);

  return componentName;
}

function generateIndexFile(style: Style, components: string[]): void {
  const tempDir = path.join(TEMP_DIR, style);
  const uniqueComponents = [...new Set(components)].sort();

  const indexContent = uniqueComponents
    .map(name => `export { default as ${name} } from './${name}';`)
    .join('\n') + '\n';

  fs.writeFileSync(path.join(tempDir, 'index.ts'), indexContent);
}

function main(): void {
  const vendors = getVendorDirectories();
  const componentsByStyle: Record<Style, string[]> = {
    'flat': [],
    'flat-rounded': [],
    'logo': [],
    'logo-border': [],
    'mono': [],
    'mono-outline': [],
  };

  vendors.forEach(vendor => {
    STYLES.forEach(style => {
      const componentName = generateComponent(vendor, style);
      if (componentName) {
        componentsByStyle[style].push(componentName);
        console.log(`✓ ${style}/${componentName}.tsx`);
      }
    });
  });

  STYLES.forEach(style => {
    generateIndexFile(style, componentsByStyle[style]);
  });

  console.log('\n✅ All component wrappers generated!');
}

main();
