'use client';
import { Thumbnail, Header, FloatButton } from '@/components';
import { useGetProduct } from '@/hook/useGetProduct';
import type { MarketItem } from '@/types/market/types';

export default function MarketPage() {
  const { data, isPending, isError } = useGetProduct();
  const products = data?.items ?? [];

  function renderProducts() {
    switch (true) {
      case isPending:
        return <p className="py-8">상품을 불러오는 중이에요.</p>;
      case isError:
        return (
          <p role="alert" className="py-8">
            상품을 불러오지 못했어요.
          </p>
        );
      case products.length === 0:
        return <p className="py-12 text-center">등록된 상품이 없어요.</p>;
      default:
        return (
          <div className="grid grid-cols-2 gap-x-2.75 gap-y-4 pt-4">
            {products.map((product) => (
              <ProductCard key={product.itemId} product={product} />
            ))}
          </div>
        );
    }
  }

  return (
    <div className="relative flex flex-1 flex-col pb-24">
      <div className="sticky top-0 z-20 bg-white">
        <Header type="sub" title="포인트 마켓" />
      </div>
      {renderProducts()}
      <FloatButton
        icon={<span className="text-3xl leading-none">+</span>}
        label="상품 등록"
        className="fixed right-5 bottom-[calc(95px+env(safe-area-inset-bottom,0px))] z-10 shadow-lg"
      />
    </div>
  );
}

function ProductCard({ product }: { product: MarketItem }) {
  return (
    <article className="relative min-w-0">
      <div className="relative">
        <Thumbnail src={product.imageUrl} alt={product.name} className="w-full rounded-md" />
        <span className="pointer-events-none absolute inset-0 rounded-md bg-[rgba(143,143,143,0.1)]" />
      </div>
      <span className="mt-3 block truncate text-[18px] font-semibold">{product.name}</span>
      <span className="mt-1 flex items-center gap-2">
        <span className="rounded-lg bg-[#f5f4fe] px-2 py-0.5 text-sm text-[#794dda]">포인트</span>
        <span className="text-xl font-semibold">{product.price.toLocaleString()}P</span>
      </span>
    </article>
  );
}
