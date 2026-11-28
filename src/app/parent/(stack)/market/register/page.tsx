'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ConfirmDialog, MarketProductForm } from '@/components';
import { MARKET_MESSAGES, ROUTES } from '@/constants';
import { useCreateProduct } from '@/service/market/useCreateProduct';
import type { MarketProductFormValues } from '@/types/market/types';

export default function RegisterMarketItemPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [limitModalOpen, setLimitModalOpen] = useState(false);

  const createProduct = useCreateProduct({
    onSuccess: () => router.replace(ROUTES.parent.market),
    onMaxItemsExceeded: () => setLimitModalOpen(true),
    onError: (message) => setSubmitError(message),
  });

  function handleSubmit(values: MarketProductFormValues) {
    if (!values.imageFile) {
      setSubmitError(MARKET_MESSAGES.validation.imageRequired);
      return;
    }

    setSubmitError(null);
    createProduct.mutate({
      request: {
        name: values.name,
        price: values.price,
        purchaseMessage: values.purchaseMessage,
      },
      image: values.imageFile,
    });
  }

  return (
    <>
      <MarketProductForm
        mode="create"
        isSubmitting={createProduct.isPending}
        submitError={submitError}
        onClearSubmitError={() => setSubmitError(null)}
        onBack={() => router.back()}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={limitModalOpen}
        title={MARKET_MESSAGES.limitModal.title}
        description={MARKET_MESSAGES.limitModal.description}
        secondaryLabel={MARKET_MESSAGES.limitModal.secondaryLabel}
        primaryLabel={MARKET_MESSAGES.limitModal.primaryLabel}
        onSecondary={() => {
          setLimitModalOpen(false);
          router.replace(ROUTES.parent.market);
        }}
        onPrimary={() => {
          setLimitModalOpen(false);
          router.replace(ROUTES.parent.market);
        }}
      />
    </>
  );
}
