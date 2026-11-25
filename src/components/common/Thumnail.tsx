'use client';

import Image from 'next/image';
import { useState, type ComponentProps, type ReactNode } from 'react';

import ThumbnailDefault from '@/components/Icon/ThumbnailDefault';

import { cx } from './text/Fieldstyles';

export type ThumbnailProps = Omit<ComponentProps<'div'>, 'children'> & {
  src?: string | null;
  alt?: string;
  width?: number | string;
  height?: number | string;
  fallback?: ReactNode;
  /** 첫 화면에 바로 보이는 이미지(LCP)는 'eager'로 즉시 로딩한다. */
  loading?: 'eager' | 'lazy';
};

export default function Thumbnail({
  src,
  alt = '',
  width,
  height,
  fallback,
  loading,
  className,
  style,
  ...props
}: ThumbnailProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const current = src && src !== failedSrc ? src : null;

  return (
    <div
      style={{ width, height, ...style }}
      className={cx(
        'relative flex aspect-square shrink-0 flex-col items-start overflow-hidden rounded-md',
        className,
      )}
      {...props}
    >
      {current ? (
        <Image
          src={current}
          alt={alt}
          fill
          sizes="100vw"
          unoptimized
          loading={loading}
          draggable={false}
          className="object-cover"
          onError={() => setFailedSrc(current)}
        />
      ) : (
        (fallback ?? (
          <ThumbnailDefault
            className="absolute inset-0"
            aria-hidden={alt ? undefined : true}
            aria-label={alt || undefined}
          />
        ))
      )}
    </div>
  );
}
