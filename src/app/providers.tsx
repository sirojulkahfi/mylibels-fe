'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { App as AntdApp, ConfigProvider } from 'antd';

export default function Providers({ children }: { children: React.ReactNode }) {
  // Pastikan instance QueryClient aman dari re-render di Next.js
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // Biar nggak fetch terus pas ganti tab browser
        retry: 1, // Coba ulang 1x kalau gagal
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              cellPaddingBlockSM: 2,
              cellPaddingInlineSM: 8,
              cellPaddingBlock: 4,
              cellPaddingInline: 8,
              headerBg: '#f8fafc',
            },
          },
        }}
      >
        <AntdApp>
          {children}
        </AntdApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}