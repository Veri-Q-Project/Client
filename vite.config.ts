import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultBe1ProxyTarget = 'http://localhost:8081';
const defaultBe3ProxyTarget = 'http://localhost:8083';

function resolveDevProxyTarget(rawValue: string | undefined, fallback: string): string {
  const value = rawValue?.trim();

  if (!value || value.startsWith('/')) {
    return fallback;
  }

  return value;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const be1ProxyTarget = resolveDevProxyTarget(env.VITE_BE1_BASE_URL, defaultBe1ProxyTarget);
  const be3ProxyTarget = resolveDevProxyTarget(env.VITE_BE3_BASE_URL, defaultBe3ProxyTarget);

  return {
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
          target: be1ProxyTarget,
        },
        '/be3': {
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(/^\/be3/u, ''),
          target: be3ProxyTarget,
        },
      },
    },
  };
});
