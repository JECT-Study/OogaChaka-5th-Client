'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { ChevronLeft, Header, IconButton, snackbar } from '@/components';
import Empty from '@/components/overlay/Empty';
import MarketProductForm, {
  type MarketProductFormValues,
} from '@/components/market/MarketProductForm';
import { useGetProductDetail, useUpdateProduct } from '@/hook/useGetProduct';
import { parseMarketError } from '@/service/market';
import type { UpdateMarketItemRequest } from '@/types/market/types';
import { ROUTES } from '@/constants/routes';

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
      snackbar('상품을 성공적으로 수정했어요!', { message: true, position: 'bottom-center' });
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
        <Header
          type="detail"
          title="상품 수정"
          leading={
            <IconButton
              icon={ChevronLeft}
              label="뒤로가기"
              iconSize={14}
              onClick={() => router.replace(ROUTES.parent.market)}
            />
          }
        />
        <div className="flex flex-1 items-center justify-center">
          <Empty
            title="수정할 상품을 찾을 수 없어요."
            description="마켓에서 상품을 다시 선택해 주세요."
            actionLabel="마켓으로 돌아가기"
            onAction={() => router.replace(ROUTES.parent.market)}
          />
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex flex-1 flex-col gap-5">
        <Header
          type="detail"
          title="상품 수정"
          leading={
            <IconButton
              icon={ChevronLeft}
              label="뒤로가기"
              iconSize={14}
              onClick={goBackToPrevious}
            />
          }
        />
        <div aria-busy="true" className="flex flex-col gap-4 pt-4">
          <div className="size-[162px] animate-pulse rounded-md bg-neutral-10" />
          <div className="h-12 w-full animate-pulse rounded-md bg-neutral-10" />
          <div className="h-12 w-full animate-pulse rounded-md bg-neutral-10" />
          <div className="h-28 w-full animate-pulse rounded-md bg-neutral-10" />
        </div>
      </div>
    );
  }

  if (isError || !item) {
    const { status, message } = parseMarketError(error);
    const isNotFound = status === 404;
    return (
      <div className="flex flex-1 flex-col">
        <Header
          type="detail"
          title="상품 수정"
          leading={
            <IconButton
              icon={ChevronLeft}
              label="뒤로가기"
              iconSize={14}
              onClick={goBackToPrevious}
            />
          }
        />
        <div role="alert" className="flex flex-1 items-center justify-center">
          <Empty
            title={isNotFound ? '상품을 찾을 수 없어요.' : '상품 정보를 불러오지 못했어요.'}
            description={message}
            actionLabel={isNotFound ? '마켓으로 돌아가기' : '다시 시도'}
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
    <Suspense fallback={<p className="py-8">상품 정보를 불러오는 중이에요.</p>}>
      <EditMarketItemContent />
    </Suspense>
  );
}
