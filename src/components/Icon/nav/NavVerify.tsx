import Image from 'next/image';

import { type NavIconProps } from '@/types/icon';

// Figma 597:6224(기본) / 597:6313(선택) 부모 탭바 '인증' 아이콘.
// 다른 탭 아이콘과 같은 48×46 영역에 아이콘(28px)과 라벨을 함께 그린다.
export default function NavVerify({ active = false }: NavIconProps) {
  return (
    <span aria-hidden="true" className="flex h-[46px] w-12 flex-col items-center gap-0.5">
      <Image
        src={active ? '/icons/nav/verify-active.svg' : '/icons/nav/verify.svg'}
        alt=""
        width={28}
        height={28}
        unoptimized
        className="size-7 shrink-0"
      />
      <span
        className={
          active
            ? 'font-pretendard text-caption-1 text-primary-strong font-semibold'
            : 'font-pretendard text-caption-2 text-lavender-grey-600 font-medium'
        }
      >
        인증
      </span>
    </span>
  );
}
