import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Development server configuration
  server: {
    port: 5173,
    open: true, // Automatically open browser
    cors: true,
  },
  
  // Preview server configuration (for production preview)
  preview: {
    port: 4173,
    open: true,
  },
  
  // Build configuration
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate sourcemaps for production (useful for debugging)
    sourcemap: false,
    
    // Minification options
    minify: 'esbuild',
    
    // Target modern browsers for smaller bundle
    target: 'es2020',
    
    // Chunk size warning limit (in kB)
    chunkSizeWarningLimit: 1000,
    
    // Rollup options for code splitting
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunk for React
          'react-vendor': ['react', 'react-dom'],
          // Icons chunk
          'icons': ['lucide-react'],
        },
        // Asset file naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        // Chunk file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        // Entry file naming
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
  
  // CSS configuration
  css: {
    devSourcemap: true,
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
  },
})

