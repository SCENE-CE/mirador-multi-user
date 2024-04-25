import { defineConfig, transformWithEsbuild } from "vite";
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      name: 'treat-js-files-as-jsx',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/))  return null

        // Use the exposed transform from vite, instead of directly
        // transforming with esbuild
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        })
      },
    },
    react(),
  ],
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  server:{
    host:true,
    port:4000,
    watch: {
      usePolling: true,
    }
  },
  resolve: {
    alias: {
      'mirador-annotation-editor/annotationAdapter/LocalStorageAdapter':
        'path/to/mirador-annotation-editor/annotationAdapter/LocalStorageAdapter'
    }

  }
})
