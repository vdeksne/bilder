import type { StorybookConfig } from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

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
    config.resolve ??= {}
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(dirname, '../src'),
    }

    config.plugins ??= []
    config.plugins.push(tailwindcss())

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
