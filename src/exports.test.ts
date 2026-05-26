import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Regression guard for the package `exports` map.
 *
 * The `default` condition must resolve to the WEB build, never the React
 * Native build. Node, SSR and server-side bundlers (e.g. Next.js server
 * components) do not apply the `browser` condition, so when `default`
 * pointed at `dist/native/*` those consumers resolved the React Native
 * entry and failed with "Cannot find module 'react-native-svg'" (an
 * optional peer dependency that web projects do not install).
 *
 * React Native consumers still get the native build via the `react-native`
 * condition (set by Metro) or the explicit `./native` subpath.
 */
type ExportTarget = { types: string; import: string; require: string };
type ConditionalExports = Record<string, ExportTarget>;

const exportsMap = (
  JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8')) as {
    exports: Record<string, ConditionalExports | ExportTarget>;
  }
).exports;

const isNative = (path: string): boolean => path.includes('/native/');

describe('package.json exports map', () => {
  describe.each(['.', './icons/*'])('subpath %s', (subpath) => {
    const entry = exportsMap[subpath] as ConditionalExports;

    it('serves the web build on the default condition (not React Native)', () => {
      expect(isNative(entry.default.import)).toBe(false);
      expect(isNative(entry.default.require)).toBe(false);
      expect(isNative(entry.default.types)).toBe(false);
    });

    it('still serves the native build on the react-native condition', () => {
      expect(isNative(entry['react-native'].import)).toBe(true);
    });
  });

  it('exposes an explicit ./native entry for React Native consumers', () => {
    expect(isNative((exportsMap['./native'] as ExportTarget).import)).toBe(true);
  });
});
