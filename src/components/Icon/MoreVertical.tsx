import { DEFAULT_ICON_COLOR, type IconProps } from '@/types/icon';

export default function MoreVertical({
  size = 18,
  color = DEFAULT_ICON_COLOR,
  style,
  ...props
}: IconProps) {
  return (
    <svg
      width={(size * 4) / 18}
      height={size}
      viewBox="0 0 4 18"
      fill="currentColor"
      style={{ color, ...style }}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="더보기"
      {...props}
    >
      <path d="M0 2C0 0.89543 0.89543 0 2 0C3.10457 0 4 0.89543 4 2C4 3.10457 3.10457 4 2 4C0.89543 4 0 3.10457 0 2Z" />
      <path d="M0 9C0 7.89543 0.89543 7 2 7C3.10457 7 4 7.89543 4 9C4 10.1046 3.10457 11 2 11C0.89543 11 0 10.1046 0 9Z" />
      <path d="M2 14C0.89543 14 0 14.8954 0 16C0 17.1046 0.89543 18 2 18C3.10457 18 4 17.1046 4 16C4 14.8954 3.10457 14 2 14Z" />
    </svg>
  );
}
