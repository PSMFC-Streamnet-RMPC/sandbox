import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages - app will be at /sandbox/wp-site-inventory/
  base: '/sandbox/wp-site-inventory/',
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
