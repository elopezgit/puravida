import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 5173,
    /*
     * Con strictPort el servidor se queda en 5173 o falla con un error claro.
     * Sin esto, Vite salta al siguiente puerto libre en silencio: el terminal
     * muestra 5174, pero si otro proyecto ya tenía 5173 atado a `localhost`,
     * abrir localhost:5173 muestra el otro sitio y parece que esta web no
     * funciona. Es preferible un error explícito a un puerto distinto del que
     * se cree.
     */
    strictPort: true,
    host: true,
  },
  build: {
    target: 'es2022',
    cssTarget: 'chrome111',
    rollupOptions: {
      output: {
        /* Se separa lo que no cambia (vendor) de lo que cambia en cada deploy
           (codigo de la app) para no invalidar la cache del navegador. */
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('motion') || id.includes('framer')) return 'motion'
          if (id.includes('lucide-react')) return 'icons'
          if (id.includes('lenis')) return 'smooth'
          if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler'))
            return 'react'
          return 'vendor'
        },
      },
    },
  },
})