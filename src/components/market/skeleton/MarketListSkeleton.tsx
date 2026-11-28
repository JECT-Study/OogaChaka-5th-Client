import { MARKET_MESSAGES } from '@/constants/market';

export default function MarketListSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label={MARKET_MESSAGES.loading.listAriaLabel}
      className="grid grid-cols-2 gap-x-2.75 gap-y-4 pt-4"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="flex flex-col gap-2.5">
          <div className="bg-neutral-10 aspect-square w-full animate-pulse rounded-md" />
          <div className="bg-neutral-10 h-5 w-3/4 animate-pulse rounded" />
          <div className="bg-neutral-10 h-5 w-1/2 animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}
