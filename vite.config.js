import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Ruta base para la raíz del dominio
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
