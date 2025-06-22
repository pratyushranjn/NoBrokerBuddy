import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'brotliCompress', // or 'gzip'
      ext: '.br', // use '.gz' if using gzip
      threshold: 1024, // compress files bigger than 1KB
      deleteOriginFile: false // keep original uncompressed files
    })
  ]
})
