export type MissionTitleProps = {
  title?: string;
  count?: number;
};

export default function MissionTitle({ title = '오늘의 미션', count }: MissionTitleProps) {
  return (
    <div className="text-headline-1-normal text-label-normal flex w-full max-w-83.75 items-center gap-2">
      <span>{title}</span>
      {count !== undefined && <span className="text-primary-normal">{count}개</span>}
    </div>
  );
}
