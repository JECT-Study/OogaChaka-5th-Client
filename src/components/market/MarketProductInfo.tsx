import MarketPointBadge from './MarketPointBadge';

interface IMarketProductInfoProps {
  name: string;
  price: number;
}

export default function MarketProductInfo({ name, price }: IMarketProductInfoProps) {
  return (
    <section className="mt-4 flex flex-col items-center">
      <div className="flex items-center justify-center gap-2 py-3">
        <h2 className="text-label-normal text-[18px] leading-[1.445] font-semibold tracking-[-0.0072px]">
          {name}
        </h2>
      </div>
      <MarketPointBadge points={price} />
    </section>
  );
}
