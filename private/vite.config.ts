import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5172,
    strictPort: true,
    hmr: {
      host: '37.27.142.148',
      port: 5172
    },
    proxy: {
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/veraclub': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  base: '/'
});
