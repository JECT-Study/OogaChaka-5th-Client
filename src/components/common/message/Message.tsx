import type { ComponentProps } from 'react';

export type MessageProps = Omit<ComponentProps<'div'>, 'className'> & {
  side?: 'left' | 'right';
};

export default function Message({
  children = '상대방의 한마디',
  side = 'left',
  ...props
}: MessageProps) {
  return (
    <div
      className={`inline-flex max-w-full items-center rounded-b-xl p-2.5 ${
        side === 'right'
          ? 'bg-primary-subtle rounded-tl-xl'
          : 'bg-background-elevated-alternative rounded-tr-xl'
      }`}
      {...props}
    >
      <span className="text-body-1-reading text-label-normal min-w-0 px-2 [font-feature-settings:'ss10'_1] leading-6 wrap-break-word">
        {children}
      </span>
    </div>
  );
}
