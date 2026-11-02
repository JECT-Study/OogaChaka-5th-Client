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
        <Providers>
          <div className="mx-auto flex min-h-dvh w-full flex-col shadow-lg">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
