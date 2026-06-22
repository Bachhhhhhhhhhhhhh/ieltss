import type { IncomingMessage, ServerResponse } from 'node:http'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Connect, ViteDevServer } from 'vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/ieltss/' : '/',
  plugins: [
    react(),
    command === 'serve' && {
      name: 'dev-html-entry',
      configureServer(server: ViteDevServer) {
        server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
          const url = req.url?.split('?')[0]
          if (url === '/' || url === '/index.html') {
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.end(readFileSync(resolve('index.dev.html'), 'utf-8'))
            return
          }
          next()
        })
      },
    },
  ].filter(Boolean),
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    open: '/',
  },
  build: {
    rollupOptions: {
      input: resolve(__dirname, 'index.dev.html'),
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts')) return 'charts'
            if (id.includes('framer-motion')) return 'motion'
            if (id.includes('react')) return 'vendor'
          }
        },
      },
    },
  },
}))