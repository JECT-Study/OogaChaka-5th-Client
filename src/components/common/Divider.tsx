export type DividerSize = 'xs' | 'sm' | 'md' | 'lg';

export interface IDividerProps {
  size?: DividerSize;
}

const SIZE_CLASS: Record<DividerSize, string> = {
  xs: 'h-[1px]',
  sm: 'h-[2px]',
  md: 'h-1',
  lg: 'h-3',
};

export default function Divider({ size = 'lg' }: IDividerProps) {
  return (
    <div role="separator" className={`bg-line-normal-normal w-full shrink-0 ${SIZE_CLASS[size]}`} />
  );
}
