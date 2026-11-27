export default function MarketDetailSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-4 pt-2">
      <div className="bg-neutral-10 h-[315px] w-full animate-pulse rounded-lg" />
      <div className="bg-neutral-10 mx-auto h-6 w-1/2 animate-pulse rounded" />
      <div className="bg-neutral-10 mx-auto h-6 w-1/3 animate-pulse rounded" />
      <div className="bg-neutral-10 h-14 w-full animate-pulse rounded-md" />
    </div>
  );
}
