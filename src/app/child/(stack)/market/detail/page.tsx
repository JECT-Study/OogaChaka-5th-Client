'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import {
  Button,
  ConfirmDialog,
  ConfirmSheet,
  Empty,
  MarketDetailSkeleton,
  MarketGuardianMessage,
  MarketHeader,
  MarketProductInfo,
  MarketProductThumbnail,
  snackbar,
} from '@/components';
import { MARKET_MESSAGES, ROUTES } from '@/constants';
import { useGetProductDetail } from '@/hook/useGetProduct';
import { parseMarketError } from '@/service/market';

// TODO: 자녀 보유 포인트 조회 API 연동 시 실제 포인트로 교체
const CHILD_POINTS_PLACEHOLDER = 400;

function parseItemId(raw: string | null): number | null {
  if (!raw || !/^\d+$/.test(raw)) return null;
  const parsed = Number(raw);
  return Number.isSafeInteger(parsed) && parsed >= 1 ? parsed : null;
}

function ChildMarketDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = parseItemId(searchParams.get('itemId'));

  const { data: item, isPending, isError, error, refetch } = useGetProductDetail(itemId);
  const [purchaseSheetOpen, setPurchaseSheetOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);

  function goToList() {
    router.push(ROUTES.child.market);
  }

  function handleSelectClick() {
    if (!item) return;

    if (CHILD_POINTS_PLACEHOLDER < item.price) {
      snackbar(MARKET_MESSAGES.toast.insufficientPoints, {
        message: false,
        position: 'bottom-center',
      });
      return;
    }

    setPurchaseSheetOpen(true);
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
      <MarketHeader title={item.name} onBack={goToList} />

      <div className="-mx-5 min-h-0 flex-1 overflow-y-auto px-5 pt-3">
        <MarketProductThumbnail imageUrl={item.imageUrl} name={item.name} />
        <MarketProductInfo name={item.name} price={item.price} />
        <MarketGuardianMessage message={item.purchaseMessage} />
      </div>

      <div className="from-static-white -mx-5 shrink-0 bg-gradient-to-t from-80% to-transparent px-5 pt-10 pb-[calc(20px+env(safe-area-inset-bottom,0px))]">
        <Button
          size="large"
          variant="neutral"
          appearance="filled"
          width="100%"
          className="enabled:bg-lavender-grey-900!"
          onClick={handleSelectClick}
        >
          선택하기
        </Button>
      </div>

      <ConfirmSheet
        type="purchase"
        open={purchaseSheetOpen}
        itemId={item.itemId}
        title={item.name}
        points={item.price}
        onClose={() => setPurchaseSheetOpen(false)}
        onSuccess={() => setCompleteDialogOpen(true)}
      />
      <ConfirmDialog
        type="complete"
        open={completeDialogOpen}
        thumbnailSrc={item.imageUrl}
        thumbnailAlt={item.name}
        onAction={goToList}
      />
    </div>
  );
}

export default function ChildMarketDetailPage() {
  return (
    <Suspense fallback={<p className="py-8">{MARKET_MESSAGES.loading.item}</p>}>
      <ChildMarketDetailContent />
    </Suspense>
  );
}
