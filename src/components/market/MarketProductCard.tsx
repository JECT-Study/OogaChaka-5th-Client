'use client';

import Link from 'next/link';
import { Close, Thumbnail } from '@/components';
import type { MarketItem } from '@/types/market/types';
import MarketPointBadge from './MarketPointBadge';

export type MarketProductCardProps = {
  product: MarketItem;
  href: string;
  eager?: boolean;
  isDeleteMode?: boolean;
  onRequestDelete?: () => void;
};

export default function MarketProductCard({
  product,
  href,
  eager = false,
  isDeleteMode = false,
  onRequestDelete,
}: MarketProductCardProps) {
  const cardBody = (
    <article className="relative min-w-0 text-left">
      <div className="relative">
        <div className="relative overflow-hidden rounded-md">
          <Thumbnail
            src={product.imageUrl}
            alt={product.name}
            loading={eager ? 'eager' : undefined}
            className="w-full rounded-none"
          />
          <span className="pointer-events-none absolute inset-0 bg-[rgba(143,143,143,0.1)]" />
        </div>
        {isDeleteMode && onRequestDelete && (
          <button
            type="button"
            aria-label={`${product.name} 삭제`}
            onClick={onRequestDelete}
            className="bg-neutral-5 shadow-ds-small active:bg-neutral-10 absolute -top-[15px] -left-[15px] z-10 flex size-[30px] cursor-pointer items-center justify-center rounded-full transition-colors"
          >
            <Close size={14} color="var(--color-cool-neutral-40)" aria-hidden="true" />
          </button>
        )}
      </div>
      <span className="text-label-normal mt-3 block truncate text-[18px] leading-[1.445] font-semibold tracking-[-0.0072px]">
        {product.name}
      </span>
      <MarketPointBadge points={product.price} className="mt-1" />
    </article>
  );

  if (isDeleteMode) {
    return <div className="min-w-0">{cardBody}</div>;
  }

  return (
    <Link href={href} className="block min-w-0 focus-visible:outline-none">
      {cardBody}
    </Link>
  );
}
