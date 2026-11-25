'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type CSSProperties } from 'react';
import { FloatButton, Header, Thumbnail } from '@/components';
// [삭제 기능 보류] import { snackbar } from '@/components';
import Button from '@/components/common/button/Button';
import Empty from '@/components/overlay/Empty';
import ConfirmDialog from '@/components/market/ConfirmDialog';
import MarketKebabMenu from '@/components/market/MarketKebabMenu';
import { useGetProduct } from '@/hook/useGetProduct';
// [삭제 기능 보류] import { useDeleteProduct } from '@/hook/useGetProduct';
import { parseMarketError } from '@/service/market';
import { MARKET_CONSTRAINTS, type MarketItem } from '@/types/market/types';
import { ROUTES } from '@/constants/routes';

type ManageMode = 'normal' | 'edit' | 'delete';

const HEADER_ACTION_STYLE = {
  '--button-bg': 'var(--color-primary-normal)',
  '--button-border': 'var(--color-periwinkle-400)',
  borderWidth: '1.5px',
} as CSSProperties;

export default function MarketPage() {
  const router = useRouter();
  const [manageMode, setManageMode] = useState<ManageMode>('normal');
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  // [삭제 기능 보류] const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { data, isPending, isError, error, refetch } = useGetProduct();
  // [삭제 기능 보류] const deleteProduct = useDeleteProduct();

  const products = data?.items ?? [];
  const itemCount = data?.totalElements ?? products.length;
  const selectedItem = products.find((item) => item.itemId === selectedItemId) ?? null;

  function enterManageMode(mode: 'edit' | 'delete') {
    setManageMode(mode);
    setSelectedItemId(null);
  }

  function exitManageMode() {
    setManageMode('normal');
    setSelectedItemId(null);
  }

  function handleRegisterClick() {
    if (itemCount >= MARKET_CONSTRAINTS.MAX_ITEMS) {
      setLimitModalOpen(true);
      return;
    }
    router.push(ROUTES.parent.marketRegister);
  }

  function handleHeaderActionClick() {
    if (!selectedItem) {
      exitManageMode();
      return;
    }

    if (manageMode === 'edit') {
      // 관리 모드를 먼저 풀면 이동 전에 일반 목록이 한 번 더 그려지므로 바로 이동한다.
      router.push(ROUTES.parent.marketEdit(selectedItem.itemId));
      return;
    }

    // [삭제 기능 보류]
    // if (manageMode === 'delete') {
      // setDeleteDialogOpen(true);
    // }
  }

  // [삭제 기능 보류]
  // async function handleConfirmDelete() {
    // if (!selectedItem || deleteProduct.isPending) return;
    // try {
      // await deleteProduct.mutateAsync(selectedItem.itemId);
      // setDeleteDialogOpen(false);
      // exitManageMode();
      // snackbar('상품을 삭제했어요.', { message: true, position: 'bottom-center' });
    // } catch (mutationError) {
      // const { message } = parseMarketError(mutationError);
      // snackbar(message, { message: false, position: 'bottom-center' });
    // }
  // }

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
            selectable={manageMode !== 'normal'}
            selected={selectedItemId === product.itemId}
            onToggleSelect={() => {
              setSelectedItemId(product.itemId);
              if (manageMode === 'edit') {
                // 선택 표시를 유지한 채 바로 이동한다. 페이지를 떠나면 관리 모드 상태는 초기화된다.
                router.push(ROUTES.parent.marketEdit(product.itemId));
              }
              // [삭제 기능 보류]
              // else if (manageMode === 'delete') {
              //   setDeleteDialogOpen(true);
              // }
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
            manageMode === 'normal' ? (
              <MarketKebabMenu
                items={[
                  {
                    id: 'delete',
                    label: '삭제하기',
                    disabled: products.length === 0,
                    // [삭제 기능 보류] 메뉴는 보이게 두고 동작만 막아 둔다.
                    // onSelect: () => enterManageMode('delete'),
                    onSelect: () => {},
                  },
                  {
                    id: 'edit',
                    label: '수정하기',
                    disabled: products.length === 0,
                    onSelect: () => enterManageMode('edit'),
                  },
                ]}
              />
            ) : (
              <Button
                size="small"
                variant="primary"
                appearance="filled"
                style={HEADER_ACTION_STYLE}
                className="border border-periwinkle-400"
                onClick={handleHeaderActionClick}
              >
                {manageMode === 'delete' ? '삭제하기' : '저장하기'}
              </Button>
            )
          }
        />
      </div>

      {renderProducts()}

      {manageMode === 'normal' && (
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
          // [삭제 기능 보류] 삭제 모드 대신 수정 모드로 진입
          // enterManageMode('delete');
          enterManageMode('edit');
        }}
        onPrimary={() => setLimitModalOpen(false)}
      />

      {/* 상품 삭제 확인 모달 */}
      {/* [삭제 기능 보류]
      <ConfirmDialog
        open={deleteDialogOpen && Boolean(selectedItem)}
        title="상품을 삭제할까요?"
        description={
          selectedItem
            ? `'${selectedItem.name}' 상품을 삭제하면\n자녀 마켓에서 더 이상 볼 수 없어요.`
            : undefined
        }
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

function ProductCard({
  product,
  selectable,
  selected,
  onToggleSelect,
  eager,
}: {
  product: MarketItem;
  eager: boolean;
  selectable: boolean;
  selected: boolean;
  onToggleSelect: () => void;
}) {
  const cardBody = (
    <article className="relative min-w-0 text-left">
      <div className="relative overflow-hidden rounded-md">
        <Thumbnail
          src={product.imageUrl}
          alt={product.name}
          loading={eager ? 'eager' : undefined}
          className="w-full rounded-none"
        />
        <span className="pointer-events-none absolute inset-0 bg-[rgba(143,143,143,0.1)]" />
        {/* 선택 테두리는 오버레이로 그려 썸네일 크기가 바뀌지 않게 한다. */}
        {selected && (
          <span className="pointer-events-none absolute inset-0 rounded-md border-2 border-primary-strong" />
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

  if (selectable) {
    return (
      <button
        type="button"
        aria-pressed={selected}
        onClick={onToggleSelect}
        className="block w-full min-w-0 focus-visible:outline-none"
      >
        {cardBody}
      </button>
    );
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
