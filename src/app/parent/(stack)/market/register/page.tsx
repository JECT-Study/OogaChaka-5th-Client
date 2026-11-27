'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  ConfirmDialog,
  MarketProductForm,
  snackbar,
  type MarketProductFormValues,
} from '@/components';
import { MARKET_MESSAGES, ROUTES } from '@/constants';
import { useCreateProduct } from '@/hook/useGetProduct';
import { parseMarketError } from '@/service/market';

export default function RegisterMarketItemPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [limitModalOpen, setLimitModalOpen] = useState(false);

  async function handleSubmit(values: MarketProductFormValues) {
    if (!values.imageFile) {
      setSubmitError(MARKET_MESSAGES.validation.imageRequired);
      return;
    }

    setSubmitError(null);
    try {
      await createProduct.mutateAsync({
        request: {
          name: values.name,
          price: values.price,
          purchaseMessage: values.purchaseMessage,
        },
        image: values.imageFile,
      });
      snackbar(MARKET_MESSAGES.toast.createSuccess, { message: true, position: 'bottom-center' });
      router.replace(ROUTES.parent.market);
    } catch (error) {
      const { code, message } = parseMarketError(error);
      if (code === 'MAX_ITEMS_EXCEEDED') {
        setLimitModalOpen(true);
        return;
      }
      setSubmitError(message);
      snackbar(message, { message: false, position: 'bottom-center' });
    }
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
