'use client';

import { ChevronLeft, Close, IconButton, MoreVertical, Scan } from '@/components';

interface IHeader {
  type?: 'detail' | 'sub';
}

export default function Header({ type = 'detail' }: IHeader) {
  return type === 'detail' ? <DetailHeader /> : <SubHeader />;
}

export function DetailHeader() {
  return (
    <header className="pt-safe relative z-10 flex items-center justify-between">
      <IconButton
        icon={ChevronLeft}
        label="뒤로가기"
        iconSize={14}
        onClick={() => alert('뒤로가기')}
      />
      <div className="text-heading-2 box-content p-2.5">페이지 타이틀</div>
      <IconButton icon={Close} label="닫기" iconSize={14} onClick={() => alert('닫기')} />
    </header>
  );
}

export function SubHeader() {
  return (
    <header className="pt-safe relative z-10">
      <div className="flex items-center justify-between">
        <IconButton icon={Scan} label="스캔" onClick={() => alert('스캔')} />
        <IconButton icon={MoreVertical} label="더보기" onClick={() => alert('더보기')} />
      </div>
      <div className="text-heading-2 box-content p-2.5">페이지 타이틀</div>
    </header>
  );
}
