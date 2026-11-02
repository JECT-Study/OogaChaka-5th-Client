import { Footer, Header } from '@/components';

export default function TabsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main className="px-content-safe flex min-h-0 flex-1 flex-col">{children}</main>
      <Footer />
    </>
  );
}
