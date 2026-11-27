'use client';

import { useRouter } from 'next/navigation';
import type { CSSProperties } from 'react';
import {
  Button,
  Empty,
  MarketListSkeleton,
  MarketPointBadge,
  MarketProductCard,
} from '@/components';
import { MARKET_MESSAGES, ROUTES } from '@/constants';
import { useGetProduct } from '@/hook/useGetProduct';
import { parseMarketError } from '@/service/market';

const HEADER_PURCHASE_LIST_STYLE = {
  '--button-bg': 'var(--color-lavender-grey-900)',
  '--button-pressed-bg': 'var(--color-lavender-grey-950)',
  '--button-focused-bg': 'var(--color-lavender-grey-800)',
} as CSSProperties;

// TODO: 자녀 보유 포인트 조회 API 연동 시 실제 포인트로 교체
const CHILD_POINTS_PLACEHOLDER = 400;

export default function ChildMarketPage() {
  const router = useRouter();
  const { data, isPending, isError, error, refetch } = useGetProduct({
    page: 0,
    size: 20,
    isActive: true,
  });

  const products = data?.items ?? [];

  function renderProducts() {
    if (isPending) {
      return <MarketListSkeleton />;
    }

    if (isError) {
      const { message } = parseMarketError(error);
      return (
        <div role="alert" className="flex flex-1 items-center justify-center py-8">
          <Empty
            title={MARKET_MESSAGES.empty.listErrorTitle}
            description={message}
            actionLabel={MARKET_MESSAGES.empty.retryAction}
            onAction={() => void refetch()}
          />
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="flex flex-1 items-center justify-center py-8">
          <Empty
            title={MARKET_MESSAGES.empty.listEmptyTitle}
            description={MARKET_MESSAGES.empty.childListEmptyDescription}
          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-x-2.75 gap-y-4 pt-4">
        {products.map((product, index) => (
          <MarketProductCard
            key={product.itemId}
            product={product}
            href={ROUTES.child.marketDetail(product.itemId)}
            eager={index < 4}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col pb-24">
      <div className="bg-static-white sticky top-0 z-20 -mx-5 px-5">
        <header className="pt-safe relative z-10 flex min-h-11 items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3">
            <h1 className="text-label-strong py-2 text-[22px] leading-[1.364] font-semibold tracking-[-0.0946px] whitespace-nowrap">
              포인트 마켓
            </h1>
            <MarketPointBadge points={CHILD_POINTS_PLACEHOLDER} size="sm" />
          </div>
          <Button
            size="small"
            variant="neutral"
            appearance="filled"
            style={HEADER_PURCHASE_LIST_STYLE}
            onClick={() => router.push(ROUTES.child.marketPurchases)}
          >
            구매 목록
          </Button>
        </header>
      </div>

      {renderProducts()}
    </div>
  );
}
