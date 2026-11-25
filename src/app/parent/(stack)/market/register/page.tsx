'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { snackbar } from '@/components';
import ConfirmDialog from '@/components/market/ConfirmDialog';
import MarketProductForm, {
  type MarketProductFormValues,
} from '@/components/market/MarketProductForm';
import { useCreateProduct } from '@/hook/useGetProduct';
import { parseMarketError } from '@/service/market';
import { ROUTES } from '@/constants/routes';

export default function RegisterMarketItemPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [limitModalOpen, setLimitModalOpen] = useState(false);

  async function handleSubmit(values: MarketProductFormValues) {
    if (!values.imageFile) {
      setSubmitError('상품 사진을 등록해 주세요.');
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
      snackbar('상품을 성공적으로 등록했어요!', { message: true, position: 'bottom-center' });
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
        title="상품 등록 개수를 초과했어요"
        description={
          '상품은 최대 12개까지 등록할 수 있어요. 새로운\n상품을 등록하려면 기존 상품을 삭제해 주세요.'
        }
        secondaryLabel="목록 수정하기"
        primaryLabel="등록 그만두기"
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
