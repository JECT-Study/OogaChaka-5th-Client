'use client';

import { useRouter } from 'next/navigation';
import { useState, type CSSProperties } from 'react';
import {
  Button,
  ConfirmDialog,
  ConfirmSheet,
  Empty,
  FloatButton,
  Header,
  MarketKebabMenu,
  MarketListSkeleton,
  MarketProductCard,
} from '@/components';
import { MARKET_MESSAGES, ROUTES } from '@/constants';
import { useGetProduct } from '@/hook/useGetProduct';
import { parseMarketError } from '@/service/market';
import { MARKET_CONSTRAINTS } from '@/types/market/types';

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
  const { data, isPending, isError, error, refetch } = useGetProduct();

  const products = data?.items ?? [];
  const itemCount = data?.totalElements ?? products.length;

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
            description={MARKET_MESSAGES.empty.listEmptyDescription}
            actionLabel={MARKET_MESSAGES.empty.listEmptyAction}
            onAction={handleRegisterClick}
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
            href={ROUTES.parent.marketDetail(product.itemId)}
            // 첫 화면에 보이는 위쪽 두 줄은 즉시 로딩한다.
            eager={index < 4}
            isDeleteMode={isDeleteMode}
            onRequestDelete={() => setSelectedItemId(product.itemId)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col pb-24">
      <div className="bg-static-white sticky top-0 z-20 -mx-5 px-5">
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

      <ConfirmDialog
        open={limitModalOpen}
        title={MARKET_MESSAGES.limitModal.title}
        description={MARKET_MESSAGES.limitModal.description}
        secondaryLabel={MARKET_MESSAGES.limitModal.secondaryLabel}
        primaryLabel={MARKET_MESSAGES.limitModal.primaryLabel}
        onSecondary={() => {
          setLimitModalOpen(false);
          enterDeleteMode();
        }}
        onPrimary={() => setLimitModalOpen(false)}
      />

      <ConfirmSheet
        type="delete"
        open={selectedItemId !== null}
        itemId={selectedItemId}
        onClose={() => setSelectedItemId(null)}
        onSuccess={() => {
          if (products.length <= 1) exitDeleteMode();
        }}
      />
    </div>
  );
}
