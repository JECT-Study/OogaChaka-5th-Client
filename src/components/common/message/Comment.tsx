import type { ComponentProps, ReactNode } from 'react';

export type CommentProps = Omit<ComponentProps<'div'>, 'children' | 'className'> & {
  name: ReactNode;
  children?: ReactNode;
};

export default function Comment({
  name,
  children = '에게 아직 지급하지 않은 상품을 확인해주세요!',
  ...props
}: CommentProps) {
  return (
    <div
      className="text-label-alternative flex max-w-full items-center gap-0.5 font-features-['ss10'_1] text-[14px] leading-5 tracking-[0.028px]"
      {...props}
    >
      <span className="shrink-0 font-bold">{name}</span>
      <span className="min-w-0 font-medium">{children}</span>
    </div>
  );
}
