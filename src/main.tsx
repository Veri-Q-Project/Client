import { RouterProvider } from '@tanstack/react-router';
import { App as AntdApp, ConfigProvider } from 'antd';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { router } from '@/routes/router';
import 'antd/dist/reset.css';
import '@/vars.css';

const rootElement = document.getElementById('app');

if (!rootElement) {
  throw new Error('Root element #app was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 12,
          colorPrimary: '#11D483',
        },
      }}
    >
      <AntdApp>
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  </StrictMode>,
);
