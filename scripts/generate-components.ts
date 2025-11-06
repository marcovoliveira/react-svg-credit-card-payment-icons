#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { transform } from '@svgr/core';
import YAML from 'yaml';

const ICONS_DIR = 'src/icons';
const TEMP_DIR = 'generated/icons';

type Style = string;

/**
 * Discover all available styles/formats from the filesystem
 * by scanning SVG filenames for both base vendor files and variant files
 */
function discoverStyles(): string[] {
  const vendors = getVendorDirectories();
  const styleSet = new Set<string>();

  for (const vendor of vendors) {
    const vendorPath = path.join(ICONS_DIR, vendor);
    const files = fs.readdirSync(vendorPath).filter((file) => file.endsWith('.svg'));

    // Get variant slugs from YAML metadata
    const variants = getVariantsFromYAML(vendor);
    const variantSlugs = variants.map((v) => v.slug);

    // Collect all valid prefixes (vendor name + variant slugs)
    // Sort by length descending to match longest/most specific prefix first
    const validPrefixes = [vendor, ...variantSlugs].sort((a, b) => b.length - a.length);

    for (const file of files) {
      // Try to match against any valid prefix (longest/most specific first)
      // This ensures code-front-flat.svg matches 'code-front' not 'code'
      for (const prefix of validPrefixes) {
        // Match exact prefix with dash separator: prefix-style.svg
        const regex = new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-(.*)\\.svg$`);
        const styleMatch = file.match(regex);
        if (styleMatch) {
          // Verify the extracted style doesn't contain dashes that would indicate a wrong prefix match
          // e.g., if we matched 'code' from 'code-front-flat.svg', we'd get 'front-flat' which has a dash
          const extractedStyle = styleMatch[1];
          // Check if this is a valid style by seeing if it's a known pattern
          // Valid styles are things like: flat, flat-rounded, logo-border, mono-outline
          // Invalid would be: front-flat (which means we matched the wrong prefix)

          // Simple heuristic: if we're checking 'code' and got 'front-flat',
          // 'front' is not a valid style prefix, so skip
          // But 'flat-rounded' is valid because 'rounded' is a modifier
          const styleParts = extractedStyle.split('-');
          const validStylePrefixes = ['flat', 'logo', 'mono'];
          const validStyleModifiers = ['rounded', 'border', 'outline'];

          if (
            styleParts.length === 1 ||
            (styleParts.length === 2 &&
              validStylePrefixes.includes(styleParts[0]) &&
              validStyleModifiers.includes(styleParts[1]))
          ) {
            styleSet.add(extractedStyle);
            break; // Found a valid match
          }
        }
      }
    }
  }

  return Array.from(styleSet).sort();
}

function getVendorDirectories(): string[] {
  return fs.readdirSync(ICONS_DIR).filter((file) => {
    const isDir = fs.statSync(path.join(ICONS_DIR, file)).isDirectory();
    return isDir;
  });
}

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

/**
 * Generate style name mappings for a given list of styles
 * Converts kebab-case style names to PascalCase suffixes
 */
function generateStyleNameMappings(
  styles: string[]
): Record<string, { suffix: string; dir: string }> {
  const mappings: Record<string, { suffix: string; dir: string }> = {};

  for (const style of styles) {
    mappings[style] = {
      suffix: pascalCase(style),
      dir: style,
    };
  }

  return mappings;
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

  // Generate "Icon" suffix exports for each component
  const iconSuffixExports = uniqueComponents.map((name) =>
    [`/** @alias ${name} */`, `export { default as ${name}Icon } from './${name}';`].join('\n')
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

  const indexContent =
    [...mainExports, '', ...iconSuffixExports, '', ...aliasExports].join('\n') + '\n';

  fs.writeFileSync(path.join(tempDir, 'index.ts'), indexContent);
}

function generateUnifiedIconsFile(vendors: string[], styles: string[]): void {
  const componentEntries: string[] = [];
  const exportNames: string[] = [];
  const styleNameMappings = generateStyleNameMappings(styles);

  for (const vendor of vendors) {
    const cardMetadata = loadCardMetadata(vendor);
    const componentName = cardMetadata?.type || pascalCase(vendor);

    // Determine which formats actually exist for this vendor
    const availableFormats: string[] = [];
    const availableFormatsCamelCase: string[] = [];
    for (const style of styles) {
      const componentPath = path.join(TEMP_DIR, style, `${componentName}.tsx`);
      if (fs.existsSync(componentPath)) {
        const camelCase = style.replace(/-(.)/g, (_, c) => c.toUpperCase());
        availableFormats.push(style);
        availableFormatsCamelCase.push(camelCase);
      }
    }

    // Skip if no formats exist
    if (availableFormats.length === 0) continue;

    // Build vendor-specific format type union (camelCase)
    const vendorFormatTypeUnion = availableFormatsCamelCase.map((s) => `'${s}'`).join(' | ');
    const defaultStyleCamelCase = availableFormatsCamelCase[0]; // Use first available format as default

    const unifiedComponent = `/**
 * ${componentName} payment icon with dynamic format selection.
 *
 * @param format - Icon style format: ${availableFormatsCamelCase.map((s) => `'${s}'`).join(', ')}
 * @param props - Standard SVG element props
 * @returns React component rendering the ${componentName} icon in the specified format
 *
 * @example
 * \`\`\`tsx
 * import { ${componentName}Icon } from 'react-svg-credit-card-payment-icons';
 *
 * <${componentName}Icon format="${defaultStyleCamelCase}" />
 * <${componentName}Icon format="${availableFormatsCamelCase[1] || defaultStyleCamelCase}" width={100} />
 * \`\`\`
 */
export function ${componentName}Icon({
  format = '${defaultStyleCamelCase}',
  ...props
}: { format?: ${vendorFormatTypeUnion} } & SVGProps<SVGSVGElement>): JSX.Element {
  const Component = formatMappings[format]?.${componentName};
  if (!Component) throw new Error(\`${componentName} not available in format: \${format}\`);
  return <Component {...props} />;
}`;

    componentEntries.push(unifiedComponent);
    exportNames.push(`${componentName}Icon`);

    // Check if this vendor has variants
    const vendorVariants = getVariantsFromYAML(vendor);
    const variantAliases = vendorVariants.map((v) => pascalCase(v.alias));
    const hasVariants = variantAliases.length > 0;
    const variantUnion = hasVariants ? variantAliases.map((v) => `'${v}'`).join(' | ') : 'never';

    // Generate style-specific icon components (e.g., VisaFlatIcon, VisaLogoIcon)
    // Only for formats that actually exist for this vendor
    for (let i = 0; i < availableFormats.length; i++) {
      const formatKey = availableFormats[i];
      const formatKeyCamelCase = availableFormatsCamelCase[i];
      const styleConfig = styleNameMappings[formatKey];
      if (!styleConfig) continue;

      const styleSpecificComponent = hasVariants
        ? `
/**
 * ${componentName} ${styleConfig.suffix} icon with optional variant selection.
 * @param variant - Optional variant: ${variantAliases.join(', ')}
 * @alias ${componentName} from 'react-svg-credit-card-payment-icons/icons/${formatKey}'
 */
export function ${componentName}${styleConfig.suffix}Icon({ variant, ...props }: { variant?: ${variantUnion} } & SVGProps<SVGSVGElement>): JSX.Element {
  const componentKey = variant || '${componentName}';
  const Component = formatMappings.${formatKeyCamelCase}[componentKey];
  if (!Component) throw new Error(\`\${componentKey} not available in format: ${formatKeyCamelCase}\`);
  return <Component {...props} />;
}`
        : `
/**
 * ${componentName} ${styleConfig.suffix} icon.
 * @alias ${componentName} from 'react-svg-credit-card-payment-icons/icons/${formatKey}'
 */
export function ${componentName}${styleConfig.suffix}Icon(props: SVGProps<SVGSVGElement>): JSX.Element {
  const Component = formatMappings.${formatKeyCamelCase}.${componentName};
  if (!Component) throw new Error(\`${componentName} not available in format: ${formatKeyCamelCase}\`);
  return <Component {...props} />;
}`;
      componentEntries.push(styleSpecificComponent);
      exportNames.push(`${componentName}${styleConfig.suffix}Icon`);
    }

    // Also generate aliases with Icon suffix
    const aliases = getAliasesFromYAML(vendor);
    for (const alias of aliases) {
      const aliasName = pascalCase(alias);
      const aliasComponent = `
/** @alias ${componentName}Icon */
export function ${aliasName}Icon(props: { format?: ${vendorFormatTypeUnion} } & SVGProps<SVGSVGElement>): JSX.Element {
  return <${componentName}Icon {...props} />;
}`;
      componentEntries.push(aliasComponent);
      exportNames.push(`${aliasName}Icon`);
    }

    // Handle variants
    const variants = getVariantsFromYAML(vendor);
    for (const variantInfo of variants) {
      const variantName = pascalCase(variantInfo.alias);

      // Check which formats exist for this variant
      const variantAvailableFormats: string[] = [];
      const variantAvailableFormatsCamelCase: string[] = [];
      for (const style of styles) {
        const componentPath = path.join(TEMP_DIR, style, `${variantName}.tsx`);
        if (fs.existsSync(componentPath)) {
          const camelCase = style.replace(/-(.)/g, (_, c) => c.toUpperCase());
          variantAvailableFormats.push(style);
          variantAvailableFormatsCamelCase.push(camelCase);
        }
      }

      if (variantAvailableFormats.length === 0) continue;

      const variantFormatTypeUnion = variantAvailableFormatsCamelCase
        .map((s) => `'${s}'`)
        .join(' | ');
      const variantDefaultStyleCamelCase = variantAvailableFormatsCamelCase[0];

      const variantComponent = `
/**
 * ${variantName} payment icon with dynamic format selection (variant).
 *
 * @param format - Icon style format: ${variantAvailableFormatsCamelCase.map((s) => `'${s}'`).join(', ')}
 * @param props - Standard SVG element props
 */
export function ${variantName}Icon({
  format = '${variantDefaultStyleCamelCase}',
  ...props
}: { format?: ${variantFormatTypeUnion} } & SVGProps<SVGSVGElement>): JSX.Element {
  const Component = formatMappings[format]?.${variantName};
  if (!Component) throw new Error(\`${variantName} not available in format: \${format}\`);
  return <Component {...props} />;
}`;
      componentEntries.push(variantComponent);
      exportNames.push(`${variantName}Icon`);

      // Generate style-specific variant icon components (only for available formats)
      for (let i = 0; i < variantAvailableFormats.length; i++) {
        const formatKey = variantAvailableFormats[i];
        const formatKeyCamelCase = variantAvailableFormatsCamelCase[i];
        const styleConfig = styleNameMappings[formatKey];
        if (!styleConfig) continue;

        const styleSpecificVariantComponent = `
/**
 * ${variantName} ${styleConfig.suffix} icon (variant).
 * @alias ${variantName} from 'react-svg-credit-card-payment-icons/icons/${formatKey}'
 */
export function ${variantName}${styleConfig.suffix}Icon(props: SVGProps<SVGSVGElement>): JSX.Element {
  const Component = formatMappings.${formatKeyCamelCase}.${variantName};
  if (!Component) throw new Error(\`${variantName} not available in format: ${formatKeyCamelCase}\`);
  return <Component {...props} />;
}`;
        componentEntries.push(styleSpecificVariantComponent);
        exportNames.push(`${variantName}${styleConfig.suffix}Icon`);
      }
    }
  }

  // Generate dynamic imports and mappings
  const imports = styles
    .map((style) => {
      const camelCase = style.replace(/-(.)/g, (_, c) => c.toUpperCase());
      return `import * as ${camelCase} from './icons/${style}';`;
    })
    .join('\n');

  const mappingEntries = styles
    .map((style) => {
      const camelCase = style.replace(/-(.)/g, (_, c) => c.toUpperCase());
      return `  ${camelCase}: ${camelCase},`; // Use camelCase keys, not kebab-case
    })
    .join('\n');

  // Build list of available formats in camelCase for export
  const formatsCamelCase = styles.map((style) => style.replace(/-(.)/g, (_, c) => c.toUpperCase()));
  const formatsArrayExport = `export const AVAILABLE_FORMATS = [${formatsCamelCase.map((f) => `'${f}'`).join(', ')}] as const;`;

  const unifiedFileContent = `// Auto-generated unified icon components with format selection
import * as React from 'react';
import type { SVGProps } from 'react';
import type { JSX } from 'react';
${imports}

const formatMappings = {
${mappingEntries}
};

${formatsArrayExport}

${componentEntries.join('\n')}
`;

  const generatedDir = 'generated';
  const unifiedPath = path.join(generatedDir, 'unifiedIcons.tsx');
  fs.writeFileSync(unifiedPath, unifiedFileContent);
  console.log(`\n✅ Generated unified icon components! (${exportNames.length} components)`);
}

function generateVendorExports(vendors: string[], styles: string[]): void {
  const vendorDir = path.join(TEMP_DIR, 'vendors');
  if (!fs.existsSync(vendorDir)) {
    fs.mkdirSync(vendorDir, { recursive: true });
  }

  const styleNames = generateStyleNameMappings(styles);

  for (const vendor of vendors) {
    const cardMetadata = loadCardMetadata(vendor);
    const componentName = cardMetadata?.type || pascalCase(vendor);
    const vendorSlug = vendor.toLowerCase();

    // Generate vendor index file with only available style-specific exports
    const vendorExports: string[] = [];
    const availableStyles: string[] = [];

    // Check which formats actually exist for this vendor
    for (const [, styleConfig] of Object.entries(styleNames)) {
      const componentPath = path.join(TEMP_DIR, styleConfig.dir, `${componentName}.tsx`);
      if (fs.existsSync(componentPath)) {
        vendorExports.push(
          `export { default as ${componentName}${styleConfig.suffix}Icon } from '../${styleConfig.dir}/${componentName}';`
        );
        availableStyles.push(styleConfig.dir);
      }
    }

    // Only add base exports if at least one style exists
    if (availableStyles.length > 0) {
      // Use the first available style as default (prefer flat if available)
      const defaultStyle = availableStyles.includes('flat') ? 'flat' : availableStyles[0];

      vendorExports.push('');
      vendorExports.push(
        `export { default as ${componentName}Icon } from '../${defaultStyle}/${componentName}';`
      );
      vendorExports.push(
        `export { default as ${componentName} } from '../${defaultStyle}/${componentName}';`
      );

      // Add default export
      vendorExports.push('');
      vendorExports.push(`export { default } from '../${defaultStyle}/${componentName}';`);

      const vendorIndexContent = vendorExports.join('\n') + '\n';
      fs.writeFileSync(path.join(vendorDir, `${vendorSlug}.ts`), vendorIndexContent);
    }
  }

  console.log(`\n✅ Generated vendor-specific exports for ${vendors.length} vendors!`);
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
  // Discover all available styles from the filesystem
  const STYLES = discoverStyles();
  console.log(`\n📦 Discovered ${STYLES.length} styles: ${STYLES.join(', ')}\n`);

  const vendors = getVendorDirectories();
  const componentsByStyle: Record<string, string[]> = {};

  // Initialize componentsByStyle with discovered styles
  for (const style of STYLES) {
    componentsByStyle[style] = [];
  }

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

  // Generate unified icon components with format selection
  generateUnifiedIconsFile(vendors, STYLES);

  // Generate vendor-specific exports
  generateVendorExports(vendors, STYLES);

  console.log('\n✅ All components generated with inline styles!');
}

main();
