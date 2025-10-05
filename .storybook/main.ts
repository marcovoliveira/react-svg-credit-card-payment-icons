import type { StorybookConfig } from '@storybook/react-vite';
import svgr from 'vite-plugin-svgr';

const config: StorybookConfig = {
  stories: ['../src/stories/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-onboarding', '@storybook/addon-vitest'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    config.plugins = config.plugins || [];
    // Add svgr plugin with SVGO disabled to preserve colors
    config.plugins.unshift(
      svgr({
        svgrOptions: {
          plugins: ['@svgr/plugin-jsx'],
          dimensions: false,
          expandProps: 'end',
          svgo: false,
        },
      })
    );
    return config;
  },
};
export default config;
