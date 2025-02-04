import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    hmr: {
      overlay: false
    }
  },
  base: mode === 'production' ? '/khoalai/' : '/',
  build: {
    outDir: 'docs', // Si estás usando 'docs' para GitHub Pages
  },
}))
