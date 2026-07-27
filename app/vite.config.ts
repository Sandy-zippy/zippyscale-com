import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Builds to ../ so GitHub Pages serves from the repo root, same as today.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    assetsDir: 'static',
  },
})
