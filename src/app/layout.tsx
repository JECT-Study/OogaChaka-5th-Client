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
      <body className="bg-neutral-10 flex min-h-screen flex-col items-center justify-center">
        <div className="mobile-frame bg-background-normal-normal my-auto shadow-lg">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
