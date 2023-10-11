import path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/main.ts'),
      name: 'cyan-type',
      fileName: 'cyan-type' // fileName: (format) => `pelilauta_store.${format}.js`
    }
  },
  assetsInclude: ['public/**/*.svg'],
  plugins: [dts()]
});