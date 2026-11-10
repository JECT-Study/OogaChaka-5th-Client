import type { IconProps } from '@/types/icon';

export default function WarningTriangle({
  size = 20,
  color = 'var(--color-status-foreground-warning)',
  style,
  ...props
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      style={{ color, ...style }}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="경고"
      {...props}
    >
      <path
        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l7.464 12.928c.674 1.167-.168 2.627-1.515 2.627H2.536c-1.347 0-2.189-1.46-1.515-2.627L8.485 2.495z"
        fill="currentColor"
      />
      <rect x="9" y="6.75" width="2" height="4.75" rx="1" fill="#171719" />
      <circle cx="10" cy="14.25" r="1.1" fill="#171719" />
    </svg>
  );
}
