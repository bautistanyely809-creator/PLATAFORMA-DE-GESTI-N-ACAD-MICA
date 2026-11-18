import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    watch: {
      usePolling: true,
      interval: 500,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  },
  esbuild: false,
  build: {
    minify: false,
    target: 'esnext',
    // Dividir el JavaScript por chunks para optimizar caché en navegador
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          recharts: ['recharts'],
          three: ['three'],
          icons: ['lucide-react']
        }
      }
    },
    // Limitar tamaño de advertencia de chunks a 600kb
    chunkSizeWarningLimit: 600
  }
})
