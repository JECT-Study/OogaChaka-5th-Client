'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type CSSProperties } from 'react';
import { FloatButton, Header, snackbar, Thumbnail } from '@/components';
import Close from '@/components/Icon/Close';
import Button from '@/components/common/button/Button';
import Empty from '@/components/overlay/Empty';
import ConfirmDialog from '@/components/market/ConfirmDialog';
import DeleteConfirmSheet from '@/components/market/DeleteConfirmSheet';
import MarketKebabMenu from '@/components/market/MarketKebabMenu';
import { useDeleteProduct, useGetProduct } from '@/hook/useGetProduct';
import { parseMarketError } from '@/service/market';
import { MARKET_CONSTRAINTS, type MarketItem } from '@/types/market/types';
import { ROUTES } from '@/constants/routes';

const HEADER_DELETE_DONE_STYLE = {
  '--button-bg': 'var(--color-lavender-grey-900)',
  '--button-pressed-bg': 'var(--color-lavender-grey-950)',
  '--button-focused-bg': 'var(--color-lavender-grey-800)',
} as CSSProperties;

export default function MarketPage() {
  const router = useRouter();
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { data, isPending, isError, error, refetch } = useGetProduct();
  const deleteProduct = useDeleteProduct();

  const products = data?.items ?? [];
  const itemCount = data?.totalElements ?? products.length;
  const selectedItem = products.find((item) => item.itemId === selectedItemId) ?? null;

  function enterDeleteMode() {
    setIsDeleteMode(true);
    setSelectedItemId(null);
  }

  function exitDeleteMode() {
    setIsDeleteMode(false);
    setSelectedItemId(null);
  }

  function handleRegisterClick() {
    if (itemCount >= MARKET_CONSTRAINTS.MAX_ITEMS) {
      setLimitModalOpen(true);
      return;
    }
    router.push(ROUTES.parent.marketRegister);
  }

  async function handleConfirmDelete() {
    if (!selectedItem || deleteProduct.isPending) return;
    const isLastItem = products.length <= 1;
    try {
      await deleteProduct.mutateAsync(selectedItem.itemId);
      setDeleteDialogOpen(false);
      if (isLastItem) {
        exitDeleteMode();
      } else {
        setSelectedItemId(null);
      }
      snackbar('상품을 성공적으로 삭제했어요!', { message: true, position: 'bottom-center' });
    } catch (mutationError) {
      const { message } = parseMarketError(mutationError);
      snackbar(message, { message: false, position: 'bottom-center' });
    }
  }

  function renderProducts() {
    if (isPending) {
      return (
        <div
          aria-busy="true"
          aria-label="상품 목록을 불러오는 중"
          className="grid grid-cols-2 gap-x-2.75 gap-y-4 pt-4"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="flex flex-col gap-2.5">
              <div className="aspect-square w-full animate-pulse rounded-md bg-neutral-10" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-neutral-10" />
              <div className="h-5 w-1/2 animate-pulse rounded bg-neutral-10" />
            </div>
          ))}
        </div>
      );
    }

    if (isError) {
      const { message } = parseMarketError(error);
      return (
        <div role="alert" className="flex flex-1 items-center justify-center py-8">
          <Empty
            title="상품을 불러오지 못했어요."
            description={message}
            actionLabel="다시 시도"
            onAction={() => void refetch()}
          />
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="flex flex-1 items-center justify-center py-8">
          <Empty
            title="등록된 상품이 없어요."
            description="자녀가 포인트로 교환할 첫 보상 상품을 등록해 보세요."
            actionLabel="상품 등록하기"
            onAction={handleRegisterClick}
          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-x-2.75 gap-y-4 pt-4">
        {products.map((product, index) => (
          <ProductCard
            key={product.itemId}
            product={product}
            // 첫 화면에 보이는 위쪽 두 줄은 즉시 로딩한다.
            eager={index < 4}
            isDeleteMode={isDeleteMode}
            onRequestDelete={() => {
              setSelectedItemId(product.itemId);
              setDeleteDialogOpen(true);
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col pb-24">
      <div className="sticky top-0 z-20 -mx-5 bg-static-white px-5">
        <Header
          type="sub"
          title="포인트 마켓"
          trailing={
            isDeleteMode ? (
              <Button
                size="small"
                variant="neutral"
                appearance="filled"
                style={HEADER_DELETE_DONE_STYLE}
                onClick={exitDeleteMode}
              >
                완료
              </Button>
            ) : (
              <MarketKebabMenu
                items={[
                  {
                    id: 'delete',
                    label: '삭제하기',
                    disabled: products.length === 0,
                    onSelect: enterDeleteMode,
                  },
                ]}
              />
            )
          }
        />
      </div>

      {renderProducts()}

      {!isDeleteMode && (
        <FloatButton
          icon={<span className="text-3xl leading-none">+</span>}
          label="상품 등록"
          onClick={handleRegisterClick}
          className="fixed right-5 bottom-[calc(95px+env(safe-area-inset-bottom,0px))] z-10 shadow-lg"
        />
      )}

      {/* 12개 초과 등록 시도 예외 모달 (Figma 1302:29731) */}
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
          enterDeleteMode();
        }}
        onPrimary={() => setLimitModalOpen(false)}
      />

      {/* 상품 삭제 확인 바텀시트 (Figma 1400:15568 / 1425:16418) */}
      <DeleteConfirmSheet
        open={deleteDialogOpen && Boolean(selectedItem)}
        loading={deleteProduct.isPending}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedItemId(null);
        }}
        onConfirm={() => void handleConfirmDelete()}
      />
    </div>
  );
}

function ProductCard({
  product,
  isDeleteMode,
  onRequestDelete,
  eager,
}: {
  product: MarketItem;
  eager: boolean;
  isDeleteMode: boolean;
  onRequestDelete: () => void;
}) {
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
        {isDeleteMode && (
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
      <span className="mt-3 block truncate text-[18px] font-semibold leading-[1.445] tracking-[-0.0072px] text-label-normal">
        {product.name}
      </span>
      <span className="mt-1 flex items-center gap-2">
        <span className="rounded-lg bg-primary-subtle px-2 py-0.5 text-[14px] font-medium leading-[1.429] text-primary-strong">
          포인트
        </span>
        <span className="text-[20px] font-semibold leading-[1.5] tracking-[-0.4px] text-label-neutral">
          {product.price.toLocaleString()}P
        </span>
      </span>
    </article>
  );

  if (isDeleteMode) {
    return <div className="min-w-0">{cardBody}</div>;
  }

  return (
    <Link
      href={ROUTES.parent.marketDetail(product.itemId)}
      className="block min-w-0 focus-visible:outline-none"
    >
      {cardBody}
    </Link>
  );
}
