import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat'
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'AnnouncementsWidget',
      fileName: 'announcements-widget',
      formats: ['umd']
    },
    outDir: 'dist',
    emptyOutDir: true,
    minify: true,
    sourcemap: false
  }
});
