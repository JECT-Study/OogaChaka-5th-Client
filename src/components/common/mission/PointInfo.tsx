export type PointInfoProps = {
  value: string;
  label: string;
};

export default function PointInfo({ value, label }: PointInfoProps) {
  return (
    <div className="flex w-[95px] shrink-0 flex-col items-start gap-[3.846px] overflow-hidden">
      <span className="text-label-normal w-full font-['Google_Sans_Flex',Pretendard,sans-serif] text-[13.462px] leading-[1.5] font-semibold tracking-[-0.2813px]">
        {value}
      </span>
      <span className="text-label-neutral w-full [font-feature-settings:'ss10'_1] text-[12.5px] leading-[1.385] tracking-[0.0313px]">
        {label}
      </span>
    </div>
  );
}
