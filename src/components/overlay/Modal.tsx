'use client';

import type { ComponentProps, CSSProperties, MouseEvent, ReactNode } from 'react';

import Button from '@/components/common/button/Button';
import { cx } from '@/components/common//text/Fieldstyles';
import Thumbnail from '@/components/common/Thumnail';

export type ModalLength = number | string;

export type ModalProps = Omit<ComponentProps<'div'>, 'title'> & {
  open?: boolean;
  onClose?: () => void;

  title: string;
  titleSuffix?: ReactNode;
  description?: ReactNode;

  thumbnailSrc?: string | null;
  thumbnailAlt?: string;
  thumbnailHeight?: ModalLength;

  actionLabel?: string;
  onAction?: () => void;

  width?: ModalLength;
  height?: ModalLength;
};

const toCssLength = (value: ModalLength) => (typeof value === 'number' ? `${value}px` : value);

const ACTION_STYLE = {
  '--button-bg': 'var(--color-primary-subtle)',
  '--button-border': 'var(--color-periwinkle-400)',
  borderWidth: '1.5px',
} as CSSProperties;

export default function Modal({
  open = true,
  onClose,

  title,
  titleSuffix,
  description,

  thumbnailSrc,
  thumbnailAlt,
  thumbnailHeight = 195,

  actionLabel,
  onAction,

  width = 333,
  height = 'auto',
  className,
  style,
  ...props
}: ModalProps) {
  if (!open) return null;

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose?.();
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="px-content-safe py-safe bg-material-shade fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        {...props}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          width: toCssLength(width),
          height: toCssLength(height),
          ...style,
        }}
        className={cx(
          'font-pretendard bg-static-white shadow-ds-medium flex max-h-full max-w-full flex-col items-center gap-5 overflow-y-auto rounded-[21px] px-5 py-5 [font-feature-settings:"ss10"]',
          className,
        )}
      >
        <Thumbnail src={thumbnailSrc} alt={thumbnailAlt} width="100%" height={thumbnailHeight} />

        <div className="flex flex-col items-center gap-2 self-stretch text-center">
          <div className="flex items-center justify-center gap-2 self-stretch">
            <p className="text-headline-1-normal text-label-normal font-semibold break-words break-keep">
              {title}
            </p>
            {titleSuffix && (
              <span className="text-headline-1-normal text-primary-strong shrink-0 font-semibold">
                {titleSuffix}
              </span>
            )}
          </div>

          {description && (
            <p className="text-body-2-reading text-neutral-60 self-stretch leading-[1.6] font-normal tracking-[0.022px] text-pretty break-words break-keep whitespace-pre-line">
              {description}
            </p>
          )}
        </div>

        {actionLabel && (
          <Button
            size="large"
            variant="primary"
            appearance="outlined"
            width="100%"
            style={ACTION_STYLE}
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
