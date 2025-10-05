#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { transform } from '@svgr/core';

const STYLES = ['flat', 'flat-rounded', 'logo', 'logo-border', 'mono', 'mono-outline'] as const;
const ICONS_DIR = 'src/icons';
const TEMP_DIR = 'generated/icons';

type Style = (typeof STYLES)[number];

function pascalCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

function getVendorDirectories(): string[] {
  return fs.readdirSync(ICONS_DIR).filter((file) => {
    const isDir = fs.statSync(path.join(ICONS_DIR, file)).isDirectory();
    const isStyleDir = STYLES.includes(file as Style);
    return isDir && !isStyleDir;
  });
}

async function generateComponent(vendor: string, style: Style): Promise<string | undefined> {
  const svgFile = `${vendor}-${style}.svg`;
  const svgPath = path.join(ICONS_DIR, vendor, svgFile);

  if (!fs.existsSync(svgPath)) return undefined;

  const componentName = pascalCase(vendor);
  const tempDir = path.join(TEMP_DIR, style);

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Read SVG file and compile it to React component with inline styles
  const svgContent = fs.readFileSync(svgPath, 'utf-8');
  let componentCode = await transform(
    svgContent,
    {
      plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
      typescript: true,
      dimensions: false,
      expandProps: 'end',
      svgoConfig: {
        plugins: [
          {
            name: 'removeAttrs',
            params: {
              attrs: ['enable-background'],
            },
          },
          {
            name: 'inlineStyles',
            params: {
              onlyMatchedOnce: false,
            },
          },
          {
            name: 'prefixIds',
            params: {
              prefix: `${vendor.toLowerCase()}-${style}`,
            },
          },
        ],
      },
    },
    { componentName }
  );

  // Remove enableBackground style property that causes TypeScript errors
  componentCode = componentCode.replace(/\s+style=\{\{\s+enableBackground:.*?\}\}/gs, '');

  const componentPath = path.join(tempDir, `${componentName}.tsx`);
  fs.writeFileSync(componentPath, componentCode);

  return componentName;
}

function generateIndexFile(style: Style, components: string[]): void {
  const tempDir = path.join(TEMP_DIR, style);
  const uniqueComponents = [...new Set(components)].sort();

  const indexContent =
    uniqueComponents.map((name) => `export { default as ${name} } from './${name}';`).join('\n') +
    '\n';

  fs.writeFileSync(path.join(tempDir, 'index.ts'), indexContent);
}

async function main(): Promise<void> {
  const vendors = getVendorDirectories();
  const componentsByStyle: Record<Style, string[]> = {
    flat: [],
    'flat-rounded': [],
    logo: [],
    'logo-border': [],
    mono: [],
    'mono-outline': [],
  };

  for (const vendor of vendors) {
    for (const style of STYLES) {
      const componentName = await generateComponent(vendor, style);
      if (componentName) {
        componentsByStyle[style].push(componentName);
        console.log(`✓ ${style}/${componentName}.tsx`);
      }
    }
  }

  STYLES.forEach((style) => {
    generateIndexFile(style, componentsByStyle[style]);
  });

  console.log('\n✅ All components generated with inline styles!');
}

main();
