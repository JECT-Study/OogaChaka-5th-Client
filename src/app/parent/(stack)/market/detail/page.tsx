'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
// [삭제 기능 보류] import { useState } from 'react';
import { ChevronLeft, Header, IconButton, Thumbnail } from '@/components';
// [삭제 기능 보류] import { snackbar } from '@/components';
import Button from '@/components/common/button/Button';
import Empty from '@/components/overlay/Empty';
// [삭제 기능 보류] import ConfirmDialog from '@/components/market/ConfirmDialog';
import MarketKebabMenu from '@/components/market/MarketKebabMenu';
import { useGetProductDetail } from '@/hook/useGetProduct';
// [삭제 기능 보류] import { useDeleteProduct } from '@/hook/useGetProduct';
import { parseMarketError } from '@/service/market';
import { ROUTES } from '@/constants/routes';

function parseItemId(raw: string | null): number | null {
  if (!raw || !/^\d+$/.test(raw)) return null;
  const parsed = Number(raw);
  return Number.isSafeInteger(parsed) && parsed >= 1 ? parsed : null;
}

function MarketDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = parseItemId(searchParams.get('itemId'));

  const { data: item, isPending, isError, error, refetch } = useGetProductDetail(itemId);
  // [삭제 기능 보류]
  // const deleteProduct = useDeleteProduct();
  // const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  function goToList() {
    router.push(ROUTES.parent.market);
  }

  // [삭제 기능 보류]
  // async function handleConfirmDelete() {
    // if (!item || deleteProduct.isPending) return;
    // try {
      // await deleteProduct.mutateAsync(item.itemId);
      // setDeleteDialogOpen(false);
      // snackbar('상품을 삭제했어요.', { message: true, position: 'bottom-center' });
      // router.replace(ROUTES.parent.market);
    // } catch (mutationError) {
      // const { message } = parseMarketError(mutationError);
      // snackbar(message, { message: false, position: 'bottom-center' });
    // }
  // }

  if (itemId === null) {
    return (
      <div className="flex flex-1 flex-col">
        <Header
          type="detail"
          title="상품 상세"
          leading={
            <IconButton icon={ChevronLeft} label="뒤로가기" iconSize={14} onClick={goToList} />
          }
        />
        <div className="flex flex-1 items-center justify-center">
          <Empty
            title="유효하지 않은 상품이에요."
            description="상품 정보를 다시 선택한 뒤 확인해 주세요."
            actionLabel="마켓으로 돌아가기"
            onAction={goToList}
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
          title="상품 상세"
          leading={
            <IconButton icon={ChevronLeft} label="뒤로가기" iconSize={14} onClick={goToList} />
          }
        />
        <div aria-busy="true" className="flex flex-col gap-4 pt-2">
          <div className="h-[315px] w-full animate-pulse rounded-lg bg-neutral-10" />
          <div className="mx-auto h-6 w-1/2 animate-pulse rounded bg-neutral-10" />
          <div className="mx-auto h-6 w-1/3 animate-pulse rounded bg-neutral-10" />
          <div className="h-14 w-full animate-pulse rounded-md bg-neutral-10" />
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
          title="상품 상세"
          leading={
            <IconButton icon={ChevronLeft} label="뒤로가기" iconSize={14} onClick={goToList} />
          }
        />
        <div role="alert" className="flex flex-1 items-center justify-center">
          <Empty
            title={isNotFound ? '상품을 찾을 수 없어요.' : '상품을 불러오지 못했어요.'}
            description={message}
            actionLabel={isNotFound ? '마켓으로 돌아가기' : '다시 시도'}
            onAction={isNotFound ? goToList : () => void refetch()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-common-0">
      <div className="shrink-0 -mx-5 bg-static-white px-5">
        <Header
          type="detail"
          title={item.name}
          leading={
            <IconButton
              icon={ChevronLeft}
              label="뒤로가기"
              iconSize={16}
              className="-ml-3"
              onClick={goToList}
            />
          }
          trailing={
            <MarketKebabMenu
              items={[
                {
                  id: 'delete',
                  label: '삭제하기',
                  // [삭제 기능 보류] 메뉴는 보이게 두고 동작만 막아 둔다.
                  // disabled: deleteProduct.isPending,
                  // onSelect: () => setDeleteDialogOpen(true),
                  onSelect: () => {},
                },
                {
                  id: 'edit',
                  label: '수정하기',
                  onSelect: () => router.push(ROUTES.parent.marketEdit(item.itemId)),
                },
              ]}
            />
          }
        />
      </div>

      <div className="-mx-5 min-h-0 flex-1 overflow-y-auto px-5 pt-3">
        {/* 상품 이미지 (Figma 981:33022: 335x315, radius 16px) */}
        <div className="relative overflow-hidden rounded-lg">
          <Thumbnail
            src={item.imageUrl}
            alt={item.name}
            loading="eager"
            height={315}
            width="100%"
            className="aspect-auto rounded-lg"
          />
        </div>

        {/* Coupon Info (Figma 997:34150) */}
        <section className="mt-4 flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 py-3">
            <h2 className="text-[18px] font-semibold leading-[1.445] tracking-[-0.0072px] text-label-normal">
              {item.name}
            </h2>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="rounded-sm bg-primary-subtle px-2 py-0.5 text-[14px] font-medium leading-[1.429] text-primary-strong">
              포인트
            </span>
            <span className="text-[20px] font-semibold leading-[1.5] tracking-[-0.4px] text-label-neutral">
              {item.price.toLocaleString()}P
            </span>
          </div>
        </section>

        {/* 보호자 메시지 List Cell (Figma 997:34152) */}
        <section className="mt-6 flex items-center gap-[9px] rounded-md bg-neutral-5 px-4 py-4">
          <span className="shrink-0 text-[16px] font-semibold leading-[1.5] tracking-[-0.352px] text-label-neutral">
            보호자
          </span>
          <span aria-hidden className="h-5 w-[1.5px] shrink-0 bg-line-normal-normal" />
          <p className="min-w-0 flex-1 text-[16px] font-normal leading-[1.5] tracking-[0.0144px] break-words whitespace-pre-line text-label-neutral">
            {item.purchaseMessage || '등록된 메시지가 없어요.'}
          </p>
        </section>
      </div>

      {/* 하단 CTA (Figma Button+Gradient Scrim: pt 40px, px 20px, pb 20px + safe-area) */}
      <div className="shrink-0 -mx-5 bg-gradient-to-t from-static-white from-80% to-transparent px-5 pt-10 pb-[calc(20px+env(safe-area-inset-bottom,0px))]">
        <Button
          size="large"
          variant="neutral"
          appearance="filled"
          width="100%"
          // [삭제 기능 보류] disabled={deleteProduct.isPending}
          className="enabled:bg-lavender-grey-900!"
          onClick={() => router.push(ROUTES.parent.marketEdit(item.itemId))}
        >
          수정하기
        </Button>
      </div>

      {/* [삭제 기능 보류]
      <ConfirmDialog
        open={deleteDialogOpen}
        title="상품을 삭제할까요?"
        description={'삭제한 상품은 자녀 마켓에서 사라지고\n다시 되돌릴 수 없어요.'}
        secondaryLabel="삭제하기"
        primaryLabel="취소"
        secondaryTone="danger"
        loading={deleteProduct.isPending}
        onSecondary={() => void handleConfirmDelete()}
        onPrimary={() => setDeleteDialogOpen(false)}
      />
      */}
    </div>
  );
}

export default function MarketDetailPage() {
  return (
    <Suspense fallback={<p className="py-8">상품 정보를 불러오는 중이에요.</p>}>
      <MarketDetailContent />
    </Suspense>
  );
}
