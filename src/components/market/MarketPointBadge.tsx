interface IMarketPointBadgeProps {
  points: number;
  size?: 'md' | 'sm';
  prefix?: string;
  className?: string;
}

const SIZE_STYLES = {
  md: {
    wrapper: 'gap-2',
    chip: 'text-[14px] leading-[1.429] font-medium',
    value: 'text-[20px] leading-[1.5] font-semibold tracking-[-0.4px]',
  },
  sm: {
    wrapper: 'gap-1',
    chip: 'text-[13px] leading-[1.385] font-normal tracking-[0.0325px]',
    value: 'text-[14px] leading-[1.5] font-semibold tracking-[-0.2926px]',
  },
} as const;

export default function MarketPointBadge({
  points,
  size = 'md',
  prefix = '',
  className = '',
}: IMarketPointBadgeProps) {
  const styles = SIZE_STYLES[size];

  return (
    <span className={`inline-flex items-center ${styles.wrapper} ${className}`.trim()}>
      <span
        className={`bg-primary-subtle text-primary-strong rounded-sm px-2 py-0.5 ${styles.chip}`}
      >
        포인트
      </span>
      <span className={`text-label-neutral ${styles.value}`}>
        {prefix}
        {points.toLocaleString()}P
      </span>
    </span>
  );
}
