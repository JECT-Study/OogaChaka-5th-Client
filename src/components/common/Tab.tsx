interface ITabProps {
  items: string[];
  current: number;
  onChange: (idx: number) => void;
  size?: 'sm' | 'md' | 'lg';
  rightSlot?: React.ReactNode;
}

const SIZE_CLASS = {
  sm: 'text-body-1-reading',
  md: 'text-heading-2',
  lg: 'text-heading-1',
} as const;

export default function Tab({ items, current, onChange, size = 'md', rightSlot }: ITabProps) {
  return (
    <div className="border-line-normal-normal flex w-full justify-between border-b">
      <li role="tablist" className="flex gap-4">
        {items.map((item, idx) => {
          const active = idx === current;
          return (
            <button
              key={`${item}-${idx}`}
              type="button"
              role="tab"
              aria-selected={active}
              className={`${SIZE_CLASS[size]} ${active ? 'text-label-strong border-b-label-strong border-b-2' : 'text-label-normal/40'}`}
            >
              {item}
            </button>
          );
        })}
      </li>
      <div>{rightSlot}</div>
    </div>
  );
}
