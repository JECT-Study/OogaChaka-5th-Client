import PointInfo, { type PointInfoProps } from './PointInfo';

export type PointBoardProps = {
  items: readonly PointInfoProps[];
};

export default function PointBoard({ items }: PointBoardProps) {
  return (
    <div className="flex max-w-full items-center gap-2.5 overflow-x-auto">
      {items.map((item, index) => (
        <PointInfo key={`${item.label}-${index}`} {...item} />
      ))}
    </div>
  );
}
