import type { CanonicalCardType } from '../../generated/cardMetadata';
import { CARD_METADATA } from '../../generated/cardMetadata';

export interface CardDefinition {
  type: CanonicalCardType;
  legacyType: string | null;
  patterns: {
    full: RegExp[];
    prefix: RegExp | null;
  };
  lengthRange: { min: number; max: number } | null;
  formatPattern: number[] | Record<string, number[]> | null;
  issuingCountries: string[] | null;
}

/**
 * Calculate pattern specificity for sorting.
 * More specific patterns should be checked first.
 */
function calculateSpecificity(pattern: RegExp | null): number {
  if (!pattern) return 0;

  const patternStr = pattern.source;
  let specificity = 0;
  const exactChars = patternStr.match(/[0-9]/g);
  specificity += (exactChars?.length || 0) * 10;
  const ranges = patternStr.match(/\[\d-\d\]/g);
  specificity += (ranges?.length || 0) * 5;
  const groups = patternStr.match(/\([^)]+\|[^)]+\)/g);
  specificity += (groups?.length || 0) * 3;
  const wildcards = patternStr.match(/\[0-9\]/g);
  specificity -= (wildcards?.length || 0) * 1;
  if (patternStr.startsWith('^')) specificity += 20;
  return specificity;
}

/** Lazy-loaded and sorted card definitions. @internal */
let CARD_DEFINITIONS: readonly CardDefinition[] | null = null;

/**
 * Get card definitions from generated metadata index
 * @internal
 */
export function getCardDefinitions(): readonly CardDefinition[] {
  if (CARD_DEFINITIONS) {
    return CARD_DEFINITIONS;
  }

  const definitions: Array<CardDefinition & { specificity: number }> = [];

  for (const metadata of CARD_METADATA) {
    const specificity = calculateSpecificity(metadata.patterns.prefix);

    definitions.push({
      type: metadata.type,
      legacyType: metadata.legacyType,
      patterns: metadata.patterns,
      lengthRange: metadata.lengthRange,
      formatPattern: metadata.formatPattern,
      issuingCountries: metadata.issuingCountries,
      specificity,
    });
  }

  // Sort by specificity (highest first)
  definitions.sort((a, b) => b.specificity - a.specificity);

  CARD_DEFINITIONS = definitions;
  return CARD_DEFINITIONS;
}
