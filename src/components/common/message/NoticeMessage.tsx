import type { ComponentProps, ReactNode } from 'react';

export type NoticeMessageProps = Omit<ComponentProps<'div'>, 'children' | 'className'> & {
  name: ReactNode;
  children?: ReactNode;
};

export default function NoticeMessage({
  name,
  children = '가 미션을 시작했어요',
  ...props
}: NoticeMessageProps) {
  return (
    <div
      className="[font-features-['ss10'_1] flex w-full max-w-83.75 items-center justify-center gap-1 text-[16px] leading-6 font-semibold tracking-[-0.352px]"
      {...props}
    >
      <span className="text-label-neutral shrink-0">{name}</span>
      <span className="text-label-alternative min-w-0">{children}</span>
    </div>
  );
}
