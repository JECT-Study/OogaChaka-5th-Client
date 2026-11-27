import { MARKET_MESSAGES } from '@/constants';

interface IMarketGuardianMessageProps {
  message: string | null;
}

export default function MarketGuardianMessage({ message }: IMarketGuardianMessageProps) {
  return (
    <section className="bg-neutral-5 mt-6 flex items-center gap-[9px] rounded-md px-4 py-4">
      <span className="text-label-neutral shrink-0 text-[16px] leading-[1.5] font-semibold tracking-[-0.352px]">
        보호자
      </span>
      <span aria-hidden className="bg-line-normal-normal h-5 w-[1.5px] shrink-0" />
      <p className="text-label-neutral min-w-0 flex-1 text-[16px] leading-[1.5] font-normal tracking-[0.0144px] break-words whitespace-pre-line">
        {message || MARKET_MESSAGES.detail.emptyPurchaseMessage}
      </p>
    </section>
  );
}
