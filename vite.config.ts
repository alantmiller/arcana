import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  resolve: {
    alias: {
      'three': 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js',
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    rollupOptions: {
      input: 'public/index.html',
    },
  },
  server: {
    open: true,
  },
});
