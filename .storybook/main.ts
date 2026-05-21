import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-mcp',
  ],
  framework: '@storybook/react-vite',
  async viteFinal(config) {
    config.server ??= {}
    config.server.proxy = {
      '/api/ecb': {
        target: 'https://www.ecb.europa.eu',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ecb/, '/stats/eurofxref'),
      },
      '/api/bol': {
        target: 'https://www.lb.lt',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bol/, '/webservices/FxRates'),
      },
    }

    return config
  },
}

export default config
