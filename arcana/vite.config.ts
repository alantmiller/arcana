import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public',
  publicDir: false,           // we don't have extra static assets
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'es2022',
  },
  server: {
    open: true,
  },
});

