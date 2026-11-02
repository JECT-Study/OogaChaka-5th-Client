interface IPageIndicatorProps {
  total: number;
  current: number;
  size?: 'sm' | 'md';
}
const SIZE_CLASS = {
  sm: 'size-1.5',
  md: 'size-2.5',
} as const;

export default function PageIndicator({ total, size = 'md', current = 0 }: IPageIndicatorProps) {
  return (
    <div className="flex h-4 items-center gap-2.5">
      {Array.from({ length: total }, (_, idx) => (
        <div
          key={idx}
          className={`${SIZE_CLASS[size]} rounded-full ${
            idx === current ? 'bg-label-normal' : 'bg-label-normal/16'
          }`}
        />
      ))}
    </div>
  );
}
