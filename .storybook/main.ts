import type { StorybookConfig } from "@storybook/react-vite";
import svgr from 'vite-plugin-svgr';

const config: StorybookConfig = {
  stories: ['../src/stories/*.stories.@(ts|tsx)'],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-onboarding",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config) {
    config.plugins = config.plugins || [];
    config.plugins.push(
      svgr({
        svgrOptions: {
          plugins: ['@svgr/plugin-jsx'],
          dimensions: false,
          expandProps: 'end',
        },
      })
    );
    return config;
  },
};
export default config;
