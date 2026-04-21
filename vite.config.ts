import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replaceAll(path.sep, '/');

          if (!normalizedId.includes('/node_modules/')) {
            return;
          }

          if (
            normalizedId.includes('/antd/') ||
            normalizedId.includes('/@ant-design/') ||
            normalizedId.includes('/rc-')
          ) {
            return 'antd';
          }

          if (
            normalizedId.includes('/react/') ||
            normalizedId.includes('/react-dom/') ||
            normalizedId.includes('/scheduler/')
          ) {
            return 'react';
          }

          if (normalizedId.includes('/@tanstack/')) {
            return 'router';
          }

          if (normalizedId.includes('/zustand/')) {
            return 'state';
          }

          return;
        },
      },
    },
  },
  plugins: [react(), vanillaExtractPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/be1': {
        changeOrigin: true,
        rewrite: (requestPath) => requestPath.replace(/^\/be1/u, ''),
        target: 'http://34.64.182.89:8081',
      },
      '/be3': {
        changeOrigin: true,
        rewrite: (requestPath) => requestPath.replace(/^\/be3/u, ''),
        target: 'http://34.64.182.89:8083',
      },
    },
  },
});
