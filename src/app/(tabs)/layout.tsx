import { Footer, Header, IconButton, ChevronLeft, MoreVertical } from '@/components';

export default function TabsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="flex flex-col">
        <Header
          type="detail"
          title="메인"
          leading={<IconButton icon={ChevronLeft} label="뒤로가기" />}
          trailing={<IconButton icon={MoreVertical} label="더보기" />}
        />
      </div>
      <main className="px-content-safe flex min-h-0 flex-1 flex-col">{children}</main>
      <Footer />
    </>
  );
}
