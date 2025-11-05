#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { transform } from '@svgr/core';
import YAML from 'yaml';

const STYLES = ['flat', 'flat-rounded', 'logo', 'logo-border', 'mono', 'mono-outline'] as const;
const ICONS_DIR = 'src/icons';
const TEMP_DIR = 'generated/icons';

type Style = (typeof STYLES)[number];

interface VariantDefinition {
  slug: string;
  displayName?: string;
  iconAuthor?: string;
  iconLicense?: string;
  aliases?: string[];
}

interface CardYAML {
  type: string;
  legacyType?: string;
  displayName?: string;
  iconAuthor?: string;
  iconLicense?: string;
  aliases?: string[];
  variants?: Record<string, VariantDefinition>; // alias -> variant definition
  testNumbers?: string[];
  patterns: {
    full: string | string[] | null;
    prefix: string | null;
  };
  lengthRange: { min: number; max: number } | null;
  formatPattern: number[] | Record<string, number[]> | null;
  issuingCountries: string[] | null;
}

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

function loadCardMetadata(vendor: string): CardYAML | null {
  let yamlPath = path.join(ICONS_DIR, vendor, `${vendor}.yml`);
  if (!fs.existsSync(yamlPath)) {
    yamlPath = path.join(ICONS_DIR, vendor, `${vendor}.yaml`);
  }
  if (!fs.existsSync(yamlPath)) return null;

  const yamlContent = fs.readFileSync(yamlPath, 'utf-8');
  return YAML.parse(yamlContent);
}

/**
 * Get variant information from YAML metadata
 * Returns array of { alias, slug, aliases } objects
 */
function getVariantsFromYAML(
  vendor: string
): Array<{ alias: string; slug: string; aliases?: string[] }> {
  const metadata = loadCardMetadata(vendor);
  if (!metadata?.variants) return [];

  return Object.entries(metadata.variants).map(([alias, def]) => ({
    alias,
    slug: def.slug,
    aliases: def.aliases,
  }));
}

/**
 * Get regular aliases (non-variant) from YAML metadata
 * Returns array of alias strings
 * Automatically includes legacyType if present
 */
function getAliasesFromYAML(vendor: string): string[] {
  const metadata = loadCardMetadata(vendor);
  const aliases = metadata?.aliases ?? [];

  // Automatically add legacyType as an alias if present
  if (metadata?.legacyType) {
    return [metadata.legacyType, ...aliases];
  }

  return aliases;
}

async function generateComponent(
  vendor: string,
  style: Style,
  variantInfo?: { alias: string; slug: string }
): Promise<string | undefined> {
  const svgPrefix = variantInfo?.slug || vendor;
  const svgFile = `${svgPrefix}-${style}.svg`;
  const svgPath = path.join(ICONS_DIR, vendor, svgFile);

  if (!fs.existsSync(svgPath)) return undefined;

  // Load card metadata from YAML to get the type name
  const cardMetadata = loadCardMetadata(vendor);

  // Use variant alias as component name, or type from YAML, or vendor name as fallback
  const componentName = variantInfo
    ? pascalCase(variantInfo.alias)
    : cardMetadata?.type || pascalCase(vendor);
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
              prefix: `${svgPrefix.toLowerCase()}-${style}`,
            },
          },
        ],
      },
    },
    { componentName }
  );

  // Remove enableBackground style property that causes TypeScript errors
  componentCode = componentCode.replace(/\s+style=\{\{\s+enableBackground:.*?\}\}/gs, '');

  // Add comprehensive JSDoc comment
  const jsDoc = `/**
 * ${componentName} payment icon component for ${style} style.
 *
 * This is an auto-generated SVG React component for the ${componentName} payment method.
 * It accepts all standard SVG element props and can be styled or sized as needed.
 *
 * @param props - Standard SVG element props (className, style, width, height, etc.)
 * @returns A React component rendering the ${componentName} ${style} icon
 *
 * @example
 * \`\`\`tsx
 * import { ${componentName} } from 'react-svg-credit-card-payment-icons/icons/${style}';
 *
 * // Basic usage
 * <${componentName} />
 *
 * // With custom size
 * <${componentName} width={100} height={64} />
 *
 * // With custom styling
 * <${componentName} className="my-icon" style={{ opacity: 0.8 }} />
 * \`\`\`
 *
 * @see {@link https://github.com/marcovoliveira/react-svg-credit-card-payment-icons | GitHub Repository}
 */
`;

  // Insert JSDoc after all imports and before the component declaration
  componentCode = componentCode.replace(/((?:import.*;\n)+)/, `$1${jsDoc}`);

  // Add card metadata as static property if available
  if (cardMetadata) {
    const fullPatterns = Array.isArray(cardMetadata.patterns.full)
      ? `[${cardMetadata.patterns.full.map((p) => JSON.stringify(p)).join(', ')}]`
      : cardMetadata.patterns.full
        ? `[${JSON.stringify(cardMetadata.patterns.full)}]`
        : '[]';

    const metadataCode = `
${componentName}.cardMetadata = {
  type: ${JSON.stringify(cardMetadata.type)},
  displayName: ${JSON.stringify(cardMetadata.displayName ?? cardMetadata.type)},
  iconAuthor: ${JSON.stringify(cardMetadata.iconAuthor ?? '')},
  iconLicense: ${JSON.stringify(cardMetadata.iconLicense ?? '')},
  aliases: ${JSON.stringify(cardMetadata.aliases ?? [])},
  testNumbers: ${JSON.stringify(cardMetadata.testNumbers ?? [])},
  patterns: {
    full: ${fullPatterns}.map(p => new RegExp(p)),
    prefix: ${cardMetadata.patterns.prefix ? `new RegExp(${JSON.stringify(cardMetadata.patterns.prefix)})` : 'null'},
  },
  lengthRange: ${JSON.stringify(cardMetadata.lengthRange)},
  formatPattern: ${JSON.stringify(cardMetadata.formatPattern)},
  issuingCountries: ${JSON.stringify(cardMetadata.issuingCountries)},
};
`;

    // Add metadata after the component export
    componentCode = componentCode.replace(/(export default .*?;)/, `$1\n${metadataCode}`);
  }

  const componentPath = path.join(tempDir, `${componentName}.tsx`);
  fs.writeFileSync(componentPath, componentCode);

  return componentName;
}

function generateIndexFile(
  style: Style,
  components: string[],
  aliasMap: Map<string, string[]>
): void {
  const tempDir = path.join(TEMP_DIR, style);
  const uniqueComponents = [...new Set(components)].sort();

  // Generate main component exports
  const mainExports = uniqueComponents.map(
    (name) => `export { default as ${name} } from './${name}';`
  );

  // Generate alias exports
  const aliasExports: string[] = [];
  for (const [mainComponent, aliases] of aliasMap.entries()) {
    // mainComponent is already the component name (e.g., 'AmericanExpress', 'DinersClub')
    if (uniqueComponents.includes(mainComponent)) {
      for (const alias of aliases) {
        const aliasName = alias;
        aliasExports.push(
          `/** @alias ${mainComponent} */`,
          `export { default as ${aliasName} } from './${mainComponent}';`
        );
      }
    }
  }

  const indexContent = [...mainExports, '', ...aliasExports].join('\n') + '\n';

  fs.writeFileSync(path.join(tempDir, 'index.ts'), indexContent);
}

function generateCardMetadataFile(vendors: string[]): void {
  const metadataEntries: string[] = [];
  const canonicalTypes: string[] = [];

  for (const vendor of vendors) {
    const cardMetadata = loadCardMetadata(vendor);
    if (!cardMetadata) continue;

    canonicalTypes.push(`"${cardMetadata.type}"`);

    const fullPatterns = Array.isArray(cardMetadata.patterns.full)
      ? `[${cardMetadata.patterns.full.map((p) => JSON.stringify(p)).join(', ')}]`
      : cardMetadata.patterns.full
        ? `[${JSON.stringify(cardMetadata.patterns.full)}]`
        : '[]';

    metadataEntries.push(`  {
    type: ${JSON.stringify(cardMetadata.type)},
    legacyType: ${JSON.stringify(cardMetadata.legacyType ?? null)},
    displayName: ${JSON.stringify(cardMetadata.displayName ?? cardMetadata.type)},
    iconAuthor: ${JSON.stringify(cardMetadata.iconAuthor ?? '')},
    iconLicense: ${JSON.stringify(cardMetadata.iconLicense ?? '')},
    aliases: ${JSON.stringify(cardMetadata.aliases ?? [])},
    variants: ${JSON.stringify(cardMetadata.variants ?? {})},
    testNumbers: ${JSON.stringify(cardMetadata.testNumbers ?? [])},
    patterns: {
      full: ${fullPatterns}.map(p => new RegExp(p)),
      prefix: ${cardMetadata.patterns.prefix ? `new RegExp(${JSON.stringify(cardMetadata.patterns.prefix)})` : 'null'},
    },
    lengthRange: ${JSON.stringify(cardMetadata.lengthRange)},
    formatPattern: ${JSON.stringify(cardMetadata.formatPattern)},
    issuingCountries: ${JSON.stringify(cardMetadata.issuingCountries)},
  }`);
  }

  const metadataFileContent = `// Auto-generated card metadata for validation utilities
// This file is lightweight and tree-shakable - contains only validation data, no SVG icons

/**
 * Canonical card type names (excludes aliases).
 * These are the actual type values returned by detectCardType().
 */
export type CanonicalCardType = ${canonicalTypes.join(' | ')};

export interface VariantDefinition {
  slug: string;
  displayName?: string;
  iconAuthor?: string;
  iconLicense?: string;
  aliases?: string[];
}

export interface CardMetadata {
  type: CanonicalCardType;
  legacyType: string | null;
  displayName: string;
  iconAuthor: string;
  iconLicense: string;
  aliases: string[];
  variants: Record<string, VariantDefinition>; // alias -> variant definition
  testNumbers: string[];
  patterns: {
    full: RegExp[];
    prefix: RegExp | null;
  };
  lengthRange: { min: number; max: number } | null;
  formatPattern: number[] | Record<string, number[]> | null;
  issuingCountries: string[] | null;
}

export const CARD_METADATA: readonly CardMetadata[] = [
${metadataEntries.join(',\n')}
];
`;

  // Write to generated/ root directory
  const generatedDir = 'generated';
  if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir, { recursive: true });
  }

  const metadataPath = path.join(generatedDir, 'cardMetadata.ts');
  fs.writeFileSync(metadataPath, metadataFileContent);
  console.log('\n✅ Generated card metadata file!');
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

  // Build alias map: vendor -> aliases[]
  const aliasMap = new Map<string, string[]>();

  for (const vendor of vendors) {
    // Load card metadata to get the actual component name
    const cardMetadata = loadCardMetadata(vendor);
    const componentName = cardMetadata?.type || pascalCase(vendor);

    const aliases = getAliasesFromYAML(vendor);
    if (aliases.length > 0) {
      aliasMap.set(componentName, aliases);
    }

    // Generate default component
    for (const style of STYLES) {
      const generatedName = await generateComponent(vendor, style);
      if (generatedName) {
        componentsByStyle[style].push(generatedName);
        console.log(`✓ ${style}/${generatedName}.tsx`);
      }
    }

    // Generate variant components
    const variants = getVariantsFromYAML(vendor);
    for (const variantInfo of variants) {
      // Add variant aliases to alias map
      if (variantInfo.aliases && variantInfo.aliases.length > 0) {
        aliasMap.set(variantInfo.alias, variantInfo.aliases);
      }

      for (const style of STYLES) {
        const componentName = await generateComponent(vendor, style, variantInfo);
        if (componentName) {
          componentsByStyle[style].push(componentName);
          console.log(
            `✓ ${style}/${componentName}.tsx (variant: ${variantInfo.alias} -> ${variantInfo.slug})`
          );
        }
      }
    }
  }

  STYLES.forEach((style) => {
    generateIndexFile(style, componentsByStyle[style], aliasMap);
  });

  // Log alias exports
  console.log('\n📋 Generated alias exports:');
  for (const [componentName, aliases] of aliasMap.entries()) {
    console.log(`   ${componentName}: ${aliases.join(', ')}`);
  }

  // Generate lightweight card metadata file
  generateCardMetadataFile(vendors);

  console.log('\n✅ All components generated with inline styles!');
}

main();
