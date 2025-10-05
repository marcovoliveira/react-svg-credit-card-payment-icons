import type { StorybookConfig } from "@storybook/react-vite";

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
};
export default config;
