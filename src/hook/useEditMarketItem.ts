'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ROUTES } from '@/constants';
import { useGetProductDetail, useUpdateProduct } from '@/service/market';
import type { MarketProductFormValues, UpdateMarketItemRequest } from '@/types/market/types';
import { useMarketItemId } from './useMarketItemId';

export function useEditMarketItem() {
  const router = useRouter();
  const itemId = useMarketItemId();
  const { data: item, isPending, isError, error, refetch } = useGetProductDetail(itemId);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function goToMarket() {
    router.replace(ROUTES.parent.market);
  }

  function goBackToPrevious() {
    if (itemId !== null) {
      router.replace(ROUTES.parent.marketDetail(itemId));
      return;
    }
    goToMarket();
  }

  const updateProduct = useUpdateProduct({
    onSuccess: goBackToPrevious,
    onError: (message) => setSubmitError(message),
  });

  function handleSubmit(values: MarketProductFormValues) {
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
    updateProduct.mutate({
      itemId: item.itemId,
      request,
      image: values.imageFile,
    });
  }

  return {
    itemId,
    item,
    isPending,
    isError,
    error,
    refetch,
    isSubmitting: updateProduct.isPending,
    submitError,
    clearSubmitError: () => setSubmitError(null),
    goBackToPrevious,
    goToMarket,
    handleSubmit,
  };
}
