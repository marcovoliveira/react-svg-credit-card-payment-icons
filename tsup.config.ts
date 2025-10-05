import { defineConfig } from 'tsup'
import fs from 'fs'
import { transform } from '@svgr/core'
import path from 'path'

const STYLES = ['flat', 'flat-rounded', 'logo', 'logo-border', 'mono', 'mono-outline'];
const ICONS_DIR = 'src/icons';

function pascalCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

function getVendors(): string[] {
  return fs.readdirSync(ICONS_DIR)
    .filter(file => {
      const isDir = fs.statSync(path.join(ICONS_DIR, file)).isDirectory();
      const isStyleDir = STYLES.includes(file);
      return isDir && !isStyleDir;
    });
}

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['cjs', 'esm'],
  dts: false, // Virtual modules don't work with Rollup DTS - types generated manually
  target: 'es2022',
  clean: true,
  esbuildPlugins: [
    {
      name: 'virtual-icon-modules',
      setup(build) {
        const vendors = getVendors();

        // Generate virtual modules for each style
        STYLES.forEach(style => {
          const pattern = new RegExp(`^./icons-generated/${style}$`);

          build.onResolve({ filter: pattern }, args => {
            return {
              path: args.path,
              namespace: 'virtual-icons',
            };
          });

          build.onLoad({ filter: pattern, namespace: 'virtual-icons' }, (args) => {
            const components = vendors
              .filter(vendor => {
                const svgPath = path.join(ICONS_DIR, vendor, `${vendor}-${style}.svg`);
                return fs.existsSync(svgPath);
              })
              .map(vendor => {
                const componentName = pascalCase(vendor);
                const absoluteSvgPath = path.resolve(ICONS_DIR, vendor, `${vendor}-${style}.svg`);
                return `export { default as ${componentName} } from "${absoluteSvgPath}?react";`;
              });

            return {
              contents: components.join('\n'),
              loader: 'js',
              resolveDir: process.cwd(),
            };
          });
        });
      },
    },
    {
      name: 'svgr',
      setup(build) {
        // Resolve .svg?react imports
        build.onResolve({ filter: /\.svg\?react$/ }, args => {
          return {
            path: path.resolve(args.resolveDir, args.path.replace('?react', '')),
            namespace: 'svgr',
          }
        })

        // Transform SVG files into React components
        build.onLoad({ filter: /.*/, namespace: 'svgr' }, async (args) => {
          const svg = await fs.promises.readFile(args.path, 'utf8')

          const componentCode = await transform(
            svg,
            {
              typescript: false,
              plugins: ['@svgr/plugin-jsx'],
              jsx: {
                babelConfig: {
                  plugins: []
                }
              },
              dimensions: false,
              expandProps: 'end',
            },
            { componentName: 'SvgComponent' }
          )

          return {
            contents: componentCode,
            loader: 'jsx',
          }
        })
      },
    },
  ],
})
