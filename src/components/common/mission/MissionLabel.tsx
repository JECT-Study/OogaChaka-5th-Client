export type MissionLabelProps = {
  date: string;
  number: string;
};

export default function MissionLabel({ date, number }: MissionLabelProps) {
  return (
    <div className="text-label-alternative flex w-full max-w-[336px] items-center justify-between [font-feature-settings:'ss10'_1] text-[12px] leading-[1.273] font-medium tracking-[0.34px]">
      <span>{date}</span>
      <span>NO.{number}</span>
    </div>
  );
}
