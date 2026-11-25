import type { ReactNode } from 'react';

/** 하단 탭바 없이 자체 헤더·하단 버튼을 갖는 하위 화면 공통 레이아웃 */
export default function StackLayout({ children }: { children: ReactNode }) {
  return (
    <main className="px-content-safe flex min-h-0 flex-1 flex-col overflow-hidden">
      {children}
    </main>
  );
}
