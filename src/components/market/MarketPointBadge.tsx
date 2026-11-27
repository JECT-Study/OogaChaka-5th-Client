type MarketPointBadgeProps = {
  points: number;
  className?: string;
};

export default function MarketPointBadge({ points, className = '' }: MarketPointBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`.trim()}>
      <span className="bg-primary-subtle text-primary-strong rounded-sm px-2 py-0.5 text-[14px] leading-[1.429] font-medium">
        포인트
      </span>
      <span className="text-label-neutral text-[20px] leading-[1.5] font-semibold tracking-[-0.4px]">
        {points.toLocaleString()}P
      </span>
    </span>
  );
}
