'use client';
import { usePathname } from 'next/navigation';
import { Footer, Header, IconButton, ChevronLeft, MoreVertical } from '@/components';

export default function TabsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const isMarket = usePathname().startsWith('/market');
  return (
    <>
      <main className="px-content-safe flex min-h-0 flex-1 flex-col overflow-y-auto pb-[25px]">
        {children}
      </main>
      <Footer />
    </>
  );
}
