/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        // Libraries change less often than the app, so they get their own long-cached chunk.
        manualChunks: { vendor: ['react', 'react-dom', '@mantine/core', '@mantine/hooks', '@tabler/icons-react'] },
      },
    },
  },
  test: { include: ['test/**/*.test.ts'], environment: 'node' },
});
