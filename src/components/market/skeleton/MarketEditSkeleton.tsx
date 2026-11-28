export default function MarketEditSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-4 pt-4">
      <div className="bg-neutral-10 size-[162px] animate-pulse rounded-md" />
      <div className="bg-neutral-10 h-12 w-full animate-pulse rounded-md" />
      <div className="bg-neutral-10 h-12 w-full animate-pulse rounded-md" />
      <div className="bg-neutral-10 h-28 w-full animate-pulse rounded-md" />
    </div>
  );
}
