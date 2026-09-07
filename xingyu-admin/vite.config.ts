import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  base: '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    port: 7778,
    proxy: {
      '/api': {
        target: 'http://localhost:7779',
        changeOrigin: true
      },
      '/druid': {
        target: 'http://localhost:7779',
        changeOrigin: true
      },
      '/ws': {
        target: 'ws://localhost:7779',
        ws: true,
        changeOrigin: true
      }
    }
  }
})
