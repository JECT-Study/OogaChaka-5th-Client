'use client';

import { useState, type ComponentProps, type CSSProperties, type ReactNode } from 'react';

import { cx } from '../text/Fieldstyles';
import AvatarDefault from '../../Icon/AvatarDefault';

export type AvatarShape = 'circle' | 'square';
export type AvatarLength = number | string;

export type AvatarProps = Omit<ComponentProps<'span'>, 'children'> & {
  shape?: AvatarShape;
  width?: AvatarLength;
  height?: AvatarLength;
  src?: string;
  alt?: string;
  fallback?: ReactNode;
};

const toCssLength = (value: AvatarLength) => (typeof value === 'number' ? `${value}px` : value);

const SHAPE: Record<AvatarShape, string> = {
  circle: 'rounded-full',
  square: 'rounded-[22.8px]',
};

const BASE =
  'relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-static-white [container-type:inline-size] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-[1.9px] after:border-line-solid-normal';

export default function Avatar({
  shape = 'circle',
  width,
  height,
  src,
  alt,
  fallback,
  className,
  style,
  ...props
}: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const showImage = !!src && failedSrc !== src;

  return (
    <span
      role={alt && !showImage ? 'img' : undefined}
      aria-label={alt && !showImage ? alt : undefined}
      className={cx(BASE, SHAPE[shape], className)}
      style={
        {
          ...(width !== undefined && { width: toCssLength(width) }),
          ...(height !== undefined && { height: toCssLength(height) }),
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- Capacitor 정적 빌드에서는 next/image 최적화를 쓰지 않는다.
        <img
          src={src}
          alt={alt ?? ''}
          draggable={false}
          onError={() => setFailedSrc(src)}
          className="size-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="bg-background-normal-alternative flex size-full items-center justify-center p-[15.2px] [&>svg]:size-full"
        >
          {fallback ?? <AvatarDefault />}
        </span>
      )}
    </span>
  );
}
