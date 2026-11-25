import type { ReactNode } from 'react';
import Footer from '@/components/common/Footer';
import type { Role } from '@/constants/routes';

/** 하단 탭바가 있는 화면 공통 레이아웃 */
// Footer는 클라이언트 컴포넌트라 아이콘 함수가 든 탭 목록 대신 역할만 넘긴다.
export default function TabLayout({ role, children }: { role: Role; children: ReactNode }) {
  return (
    <>
      <main className="px-content-safe flex min-h-0 flex-1 flex-col overflow-y-auto pb-6.25">
        {children}
      </main>
      <Footer role={role} />
    </>
  );
}
