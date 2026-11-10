import type { ComponentProps } from 'react';

const OVERLAY_TYPE_CLASS = {
  dark: 'bg-common-100/84',
  bright: 'bg-common-100/64',
} as const;

export type IOverlayProps = ComponentProps<'div'> & {
  type?: 'dark' | 'bright';
  isOpen?: boolean;
};

export default function Overlay({
  type = 'dark',
  isOpen = true,
  className,
  children,
  ...props
}: IOverlayProps) {
  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${OVERLAY_TYPE_CLASS[type]} ${className ?? ''}`}
      {...props}
    >
      {children}
    </div>
  );
}
