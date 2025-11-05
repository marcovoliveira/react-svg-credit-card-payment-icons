import { defineConfig } from 'tsup';
import fs from 'fs';
import { transform } from '@svgr/core';
import path from 'path';

export default defineConfig({
  entry: {
    index: 'src/index.tsx',
    'icons/flat': 'generated/icons/flat/index.ts',
    'icons/flat-rounded': 'generated/icons/flat-rounded/index.ts',
    'icons/logo': 'generated/icons/logo/index.ts',
    'icons/logo-border': 'generated/icons/logo-border/index.ts',
    'icons/mono': 'generated/icons/mono/index.ts',
    'icons/mono-outline': 'generated/icons/mono-outline/index.ts',
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
