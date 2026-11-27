import { Thumbnail } from '@/components';

interface IMarketProductThumbnailProps {
  imageUrl: string | null;
  name: string;
}

export default function MarketProductThumbnail({ imageUrl, name }: IMarketProductThumbnailProps) {
  return (
    <div className="relative overflow-hidden rounded-lg">
      <Thumbnail
        src={imageUrl}
        alt={name}
        loading="eager"
        height={315}
        width="100%"
        className="aspect-auto rounded-lg"
      />
    </div>
  );
}
