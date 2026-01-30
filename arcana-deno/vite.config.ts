import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import deno from '@deno/vite-plugin';

export default defineConfig({
  plugins: [
    deno(),                 // ← this makes Vite understand Deno resolution + npm: specifiers
    react()
  ],
  server: {
    port: 5173
  },
  // Optional: proxy API calls if you add a backend later
  // proxy: { '/api': 'http://localhost:8000' }
});
