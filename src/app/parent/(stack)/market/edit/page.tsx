'use client';

import { Suspense } from 'react';
import { Empty, MarketEditSkeleton, MarketHeader, MarketProductForm } from '@/components';
import { MARKET_MESSAGES } from '@/constants';
import { useEditMarketItem } from '@/hook/useEditMarketItem';
import { parseMarketError } from '@/service/market';

function EditMarketItemContent() {
  const {
    itemId,
    item,
    isPending,
    isError,
    error,
    refetch,
    isSubmitting,
    submitError,
    clearSubmitError,
    goBackToPrevious,
    goToMarket,
    handleSubmit,
  } = useEditMarketItem();

  if (itemId === null) {
    return (
      <div className="flex flex-1 flex-col">
        <MarketHeader title="상품 수정" onBack={goToMarket} />
        <div className="flex flex-1 items-center justify-center">
          <Empty
            title={MARKET_MESSAGES.empty.editNotFoundTitle}
            description={MARKET_MESSAGES.empty.editNotFoundDescription}
            actionLabel={MARKET_MESSAGES.empty.backToMarketAction}
            onAction={goToMarket}
          />
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex flex-1 flex-col gap-5">
        <MarketHeader title="상품 수정" onBack={goBackToPrevious} />
        <MarketEditSkeleton />
      </div>
    );
  }

  if (isError || !item) {
    const { status, message } = parseMarketError(error);
    const isNotFound = status === 404;
    return (
      <div className="flex flex-1 flex-col">
        <MarketHeader title="상품 수정" onBack={goBackToPrevious} />
        <div role="alert" className="flex flex-1 items-center justify-center">
          <Empty
            title={
              isNotFound
                ? MARKET_MESSAGES.empty.notFoundTitle
                : MARKET_MESSAGES.empty.editErrorTitle
            }
            description={message}
            actionLabel={
              isNotFound
                ? MARKET_MESSAGES.empty.backToMarketAction
                : MARKET_MESSAGES.empty.retryAction
            }
            onAction={isNotFound ? goToMarket : () => void refetch()}
          />
        </div>
      </div>
    );
  }

  return (
    <MarketProductForm
      key={`${item.itemId}-${item.updatedAt ?? item.createdAt}`}
      mode="edit"
      initialValues={{
        name: item.name,
        price: item.price,
        purchaseMessage: item.purchaseMessage,
        imageUrl: item.imageUrl,
      }}
      isSubmitting={isSubmitting}
      submitError={submitError}
      onClearSubmitError={clearSubmitError}
      onBack={goBackToPrevious}
      onSubmit={handleSubmit}
    />
  );
}

export default function EditMarketItemPage() {
  return (
    <Suspense fallback={<p className="py-8">{MARKET_MESSAGES.loading.item}</p>}>
      <EditMarketItemContent />
    </Suspense>
  );
}
