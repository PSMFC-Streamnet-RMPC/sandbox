import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages - app served from /sandbox/wp-site-inventory/dist/
  base: '/sandbox/wp-site-inventory/dist/',
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
