import { defineConfig } from 'tsup';
import fs from 'fs';
import { transform } from '@svgr/core';
import path from 'path';

// Dynamically generate format entries (flat, logo, mono, etc.)
function getFormatEntries() {
  const iconsDir = 'generated/icons';
  if (!fs.existsSync(iconsDir)) {
    return {};
  }

  const entries: Record<string, string> = {};
  const items = fs.readdirSync(iconsDir);

  for (const item of items) {
    const itemPath = path.join(iconsDir, item);
    const stat = fs.statSync(itemPath);

    // Skip non-directories and the 'vendors' directory
    if (!stat.isDirectory() || item === 'vendors') {
      continue;
    }

    // Check if index.ts exists in this directory
    const indexPath = path.join(itemPath, 'index.ts');
    if (fs.existsSync(indexPath)) {
      entries[`icons/${item}`] = `generated/icons/${item}/index.ts`;
    }
  }

  return entries;
}

// Dynamically generate vendor entries
function getVendorEntries() {
  const vendorsDir = 'generated/icons/vendors';
  if (!fs.existsSync(vendorsDir)) {
    return {};
  }

  const vendorFiles = fs.readdirSync(vendorsDir).filter(file => file.endsWith('.ts'));
  const entries: Record<string, string> = {};

  for (const file of vendorFiles) {
    const vendorName = file.replace('.ts', '');
    entries[vendorName] = `${vendorsDir}/${file}`;
  }

  return entries;
}

export default defineConfig({
  entry: {
    index: 'src/index.tsx',
    // Dynamically add all icon format exports (flat, logo, mono, etc.)
    ...getFormatEntries(),
    // Dynamically add vendor-specific exports (visa, mastercard, etc.)
    ...getVendorEntries(),
  },
  format: ['cjs', 'esm'],
  dts: true,
  target: 'es2022',
  clean: true,
  splitting: true,
  esbuildPlugins: [
    {
      name: 'svgr',
      setup(build) {
        // Resolve .svg?react imports
        build.onResolve({ filter: /\.svg\?react$/ }, (args) => {
          // Robust URL parsing to handle query parameters
          const [filePath] = args.path.split('?');
          return {
            path: path.resolve(args.resolveDir, filePath),
            namespace: 'svgr',
          };
        });

        // Transform SVG files into React components
        build.onLoad({ filter: /.*/, namespace: 'svgr' }, async (args) => {
          const svg = await fs.promises.readFile(args.path, 'utf8');

          const componentCode = await transform(
            svg,
            {
              typescript: true,
              plugins: ['@svgr/plugin-jsx'],
              jsx: {
                babelConfig: {
                  plugins: [],
                },
              },
              dimensions: false,
              expandProps: 'end',
              svgo: false, // Disable SVGO to preserve colors and styles
            },
            { componentName: 'SvgComponent' }
          );

          return {
            contents: componentCode,
            loader: 'tsx',
          };
        });
      },
    },
  ],
});
