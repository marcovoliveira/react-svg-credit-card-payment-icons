import { defineConfig } from 'tsup';
import fs from 'fs';
import { transform } from '@svgr/core';
import path from 'path';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['cjs', 'esm'],
  dts: true,
  target: 'es2022',
  clean: true,
  esbuildPlugins: [
    {
      name: 'svgr',
      setup(build) {
        // Resolve .svg?react imports
        build.onResolve({ filter: /\.svg\?react$/ }, (args) => {
          return {
            path: path.resolve(args.resolveDir, args.path.replace('?react', '')),
            namespace: 'svgr',
          };
        });

        // Transform SVG files into React components
        build.onLoad({ filter: /.*/, namespace: 'svgr' }, async (args) => {
          const svg = await fs.promises.readFile(args.path, 'utf8');

          const componentCode = await transform(
            svg,
            {
              typescript: false,
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
            loader: 'jsx',
          };
        });
      },
    },
  ],
});
