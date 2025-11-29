import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),
        'service-worker': resolve(__dirname, 'src/background/service-worker.ts'),
        'content-script': resolve(__dirname, 'src/content/content.ts')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'service-worker') {
            return 'src/service-worker.js'
          }
          if (chunkInfo.name === 'content-script') {
            return 'src/content-script.js'
          }
          return 'assets/[name]-[hash].js'
        },
        // Ensure small chunks for MV3 compatibility
        manualChunks: undefined
      }
    }
  },
  server: {
    port: 5173,
    hmr: {
      host: 'localhost'
    }
  }
})