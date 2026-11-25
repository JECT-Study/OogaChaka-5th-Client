'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    import('@/mocks/browser')
      .then(({ startMocking }) => startMocking())
      .then(() => setReady(true))
      .catch((cause) => {
        console.error("[mocks] Startup failed", cause);
        setError(true);
      });
  }, []);
  if (error) return <p role="alert">모의 데이터를 시작하지 못했어요. 페이지를 새로고침해 주세요.</p>;
  if (!ready) return null;
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
