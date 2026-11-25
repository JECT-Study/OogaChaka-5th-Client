export type MissionRequestHeaderProps = {
  onViewAll: () => void;
};

export default function MissionRequestHeader({ onViewAll }: MissionRequestHeaderProps) {
  return (
    <div className="flex w-full max-w-[335px] items-center justify-between">
      <h2 className="text-heading-2 text-label-normal">미션 요청</h2>
      <button
        type="button"
        onClick={onViewAll}
        className="text-primary-strong cursor-pointer [font-feature-settings:'ss10'_1] text-[16px] leading-6 font-semibold tracking-[-0.352px]"
      >
        전체보기
      </button>
    </div>
  );
}
