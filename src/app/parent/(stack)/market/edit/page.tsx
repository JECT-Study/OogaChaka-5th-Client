'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Empty, snackbar } from '@/components';
import {
  MarketEditSkeleton,
  MarketHeader,
  MarketProductForm,
  type MarketProductFormValues,
} from '@/components/market';
import { MARKET_MESSAGES, ROUTES } from '@/constants';
import { useGetProductDetail, useUpdateProduct } from '@/hook/useGetProduct';
import { parseMarketError } from '@/service/market';
import type { UpdateMarketItemRequest } from '@/types/market/types';

function parseItemId(raw: string | null): number | null {
  if (!raw || !/^\d+$/.test(raw)) return null;
  const parsed = Number(raw);
  return Number.isSafeInteger(parsed) && parsed >= 1 ? parsed : null;
}

function EditMarketItemContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = parseItemId(searchParams.get('itemId'));

  const { data: item, isPending, isError, error, refetch } = useGetProductDetail(itemId);
  const updateProduct = useUpdateProduct();
  const [submitError, setSubmitError] = useState<string | null>(null);

  function goBackToPrevious() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    if (itemId !== null) {
      router.replace(ROUTES.parent.marketDetail(itemId));
      return;
    }
    router.replace(ROUTES.parent.market);
  }

  async function handleSubmit(values: MarketProductFormValues) {
    if (!item) return;

    const request: UpdateMarketItemRequest = {};
    if (values.name !== item.name.trim()) {
      request.name = values.name;
    }
    if (values.price !== item.price) {
      request.price = values.price;
    }
    const prevMessage = item.purchaseMessage?.trim() || null;
    if (values.purchaseMessage !== prevMessage) {
      request.purchaseMessage = values.purchaseMessage;
    }

    if (Object.keys(request).length === 0 && !values.imageFile) {
      return;
    }

    setSubmitError(null);
    try {
      await updateProduct.mutateAsync({
        itemId: item.itemId,
        request,
        image: values.imageFile,
      });
      snackbar(MARKET_MESSAGES.toast.updateSuccess, { message: true, position: 'bottom-center' });
      goBackToPrevious();
    } catch (mutationError) {
      const { message } = parseMarketError(mutationError);
      setSubmitError(message);
      snackbar(message, { message: false, position: 'bottom-center' });
    }
  }

  if (itemId === null) {
    return (
      <div className="flex flex-1 flex-col">
        <MarketHeader title="상품 수정" onBack={() => router.replace(ROUTES.parent.market)} />
        <div className="flex flex-1 items-center justify-center">
          <Empty
            title={MARKET_MESSAGES.empty.editNotFoundTitle}
            description={MARKET_MESSAGES.empty.editNotFoundDescription}
            actionLabel={MARKET_MESSAGES.empty.backToMarketAction}
            onAction={() => router.replace(ROUTES.parent.market)}
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
            onAction={isNotFound ? () => router.replace(ROUTES.parent.market) : () => void refetch()}
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
      isSubmitting={updateProduct.isPending}
      submitError={submitError}
      onClearSubmitError={() => setSubmitError(null)}
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
