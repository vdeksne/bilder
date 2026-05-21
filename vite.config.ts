import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
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
    },
  },
})
