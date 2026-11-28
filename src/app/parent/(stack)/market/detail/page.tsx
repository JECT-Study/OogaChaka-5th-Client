'use client';

import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import {
  ConfirmSheet,
  Empty,
  MarketDetailSkeleton,
  MarketGuardianMessage,
  MarketHeader,
  MarketProductInfo,
  MarketProductThumbnail,
} from '@/components';
import { MARKET_MESSAGES, ROUTES } from '@/constants';
import { useMarketItemId } from '@/hook/useMarketItemId';
import { parseMarketError, useGetProductDetail } from '@/service/market';

function MarketDetailContent() {
  const router = useRouter();
  const itemId = useMarketItemId();

  const { data: item, isPending, isError, error, refetch } = useGetProductDetail(itemId);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  function goToList() {
    router.push(ROUTES.parent.market);
  }

  if (itemId === null) {
    return (
      <div className="flex flex-1 flex-col">
        <MarketHeader onBack={goToList} />
        <div className="flex flex-1 items-center justify-center">
          <Empty
            title={MARKET_MESSAGES.empty.invalidItemTitle}
            description={MARKET_MESSAGES.empty.invalidItemDescription}
            actionLabel={MARKET_MESSAGES.empty.backToMarketAction}
            onAction={goToList}
          />
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex flex-1 flex-col gap-5">
        <MarketHeader onBack={goToList} />
        <MarketDetailSkeleton />
      </div>
    );
  }

  if (isError || !item) {
    const { status, message } = parseMarketError(error);
    const isNotFound = status === 404;
    return (
      <div className="flex flex-1 flex-col">
        <MarketHeader onBack={goToList} />
        <div role="alert" className="flex flex-1 items-center justify-center">
          <Empty
            title={
              isNotFound
                ? MARKET_MESSAGES.empty.notFoundTitle
                : MARKET_MESSAGES.empty.detailErrorTitle
            }
            description={message}
            actionLabel={
              isNotFound
                ? MARKET_MESSAGES.empty.backToMarketAction
                : MARKET_MESSAGES.empty.retryAction
            }
            onAction={isNotFound ? goToList : () => void refetch()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-common-0 relative flex min-h-0 flex-1 flex-col">
      <MarketHeader
        title={item.name}
        onBack={goToList}
        onDelete={() => setDeleteDialogOpen(true)}
        onEdit={() => router.push(ROUTES.parent.marketEdit(item.itemId))}
      />

      <div className="-mx-5 min-h-0 flex-1 overflow-y-auto px-5 pt-3 pb-[calc(24px+env(safe-area-inset-bottom,0px))]">
        <MarketProductThumbnail imageUrl={item.imageUrl} name={item.name} />
        <MarketProductInfo name={item.name} price={item.price} />
        <MarketGuardianMessage message={item.purchaseMessage} />
      </div>

      <ConfirmSheet
        type="delete"
        open={deleteDialogOpen}
        itemId={item.itemId}
        onClose={() => setDeleteDialogOpen(false)}
        onSuccess={() => router.replace(ROUTES.parent.market)}
      />
    </div>
  );
}

export default function MarketDetailPage() {
  return (
    <Suspense fallback={<p className="py-8">{MARKET_MESSAGES.loading.item}</p>}>
      <MarketDetailContent />
    </Suspense>
  );
}
