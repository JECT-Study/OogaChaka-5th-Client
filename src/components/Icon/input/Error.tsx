import type { IconProps } from '@/types/icon';

export default function ErrorCircle({
  size = 20,
  color = 'var(--color-status-foreground-danger)',
  style,
  ...props
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="1 1 20 20"
      fill="none"
      style={{ color, ...style }}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="오류"
      {...props}
    >
      <rect x="1" y="1" width="20" height="20" rx="10" fill="currentColor" />
      <path
        d="M9.75 11.6504L9.75 6.65039C9.75 5.96003 10.3096 5.40039 11 5.40039C11.6904 5.40039 12.25 5.96003 12.25 6.65039L12.25 11.6504C12.25 12.3407 11.6904 12.9004 11 12.9004C10.3096 12.9004 9.75 12.3407 9.75 11.6504Z"
        fill="var(--color-common-0)"
      />
      <path
        d="M11 14.1006C11.6904 14.1006 12.25 14.6602 12.25 15.3506C12.25 16.0409 11.6904 16.6006 11 16.6006C10.3096 16.6006 9.75 16.0409 9.75 15.3506C9.75 14.6602 10.3096 14.1006 11 14.1006Z"
        fill="var(--color-common-0)"
      />
    </svg>
  );
}
