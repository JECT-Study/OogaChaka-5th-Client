import { DEFAULT_ICON_COLOR, type IconProps } from '@/types/icon';

export default function ChevronLeft({
  size = 14,
  color = DEFAULT_ICON_COLOR,
  style,
  ...props
}: IconProps) {
  return (
    <svg
      width={(size * 8) / 14}
      height={size}
      viewBox="0 0 8 14"
      fill="currentColor"
      style={{ color, ...style }}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="이전"
      {...props}
    >
      <path d="M2.41421 7L7.70711 1.70711C8.09763 1.31658 8.09763 0.683417 7.70711 0.292893C7.31658 -0.0976311 6.68342 -0.0976311 6.29289 0.292893L0.292893 6.29289C-0.0976311 6.68342 -0.0976311 7.31658 0.292893 7.70711L6.29289 13.7071C6.68342 14.0976 7.31658 14.0976 7.70711 13.7071C8.09763 13.3166 8.09763 12.6834 7.70711 12.2929L2.41421 7Z" />
    </svg>
  );
}
