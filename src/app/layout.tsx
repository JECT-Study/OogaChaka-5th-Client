import type { Metadata, Viewport } from 'next';
import { Providers } from './providers';
import './globals.css';

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
          <header className="bg-accent-background-cobalt relative z-10 px-content-safe pt-safe shadow-2xl">
            Header
          </header>
          <main className="px-content-safe flex min-h-0 flex-1 flex-col">{children}</main>
          <footer className="bg-accent-background-apricot px-content-safe pb-safe shadow-2xl">Footer</footer>
        </div>
      </body>
    </html>
  );
}
