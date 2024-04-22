import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    host:true,
    port:4000,
  },
  resolve: {
    alias: {
      'mirador-annotation-editor/annotationAdapter/LocalStorageAdapter':
        'path/to/mirador-annotation-editor/annotationAdapter/LocalStorageAdapter'
    }

  }
})
