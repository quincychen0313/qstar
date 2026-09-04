import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Keep asset URLs relative so the same source works under
  // https://<user>.github.io/qstar/ and on Hostinger subdomains.
  base: './',
});
