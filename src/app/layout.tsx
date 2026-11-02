import type { Metadata, Viewport } from 'next';
import { Providers } from './providers';
import './globals.css';
import Header from '@/components/common/header/Header';

export const metadata: Metadata = {
  title: 'OogaChaka',
  description: 'OogaChaka client',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="min-h-dvh">
        <div className="mx-auto flex min-h-dvh w-full flex-col shadow-lg">
          <Header />
          <main className="px-content-safe flex min-h-0 flex-1 flex-col">
            <Providers>{children}</Providers>
          </main>
          <footer className="px-content-safe pb-safe shadow-2xl">Footer</footer>
        </div>
      </body>
    </html>
  );
}
