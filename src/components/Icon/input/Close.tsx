import type { IconProps } from '@/types/icon';

export default function CloseCircle({
  size = 20,
  color = 'var(--color-neutral-60)',
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
      aria-label="지우기"
      {...props}
    >
      <rect width="20" height="20" rx="10" fill="currentColor" fillOpacity={0.73} />
      <path
        d="M13.1161 5.11612C13.6043 4.62796 14.3955 4.62796 14.8837 5.11612C15.3719 5.60427 15.3719 6.39554 14.8837 6.88369L11.7675 9.99991L14.8837 13.1161C15.3719 13.6043 15.3719 14.3955 14.8837 14.8837C14.3955 15.3719 13.6043 15.3719 13.1161 14.8837L9.99991 11.7675L6.88369 14.8837C6.39554 15.3719 5.60427 15.3719 5.11612 14.8837C4.62796 14.3955 4.62796 13.6043 5.11612 13.1161L8.23233 9.99991L5.11612 6.88369C4.62796 6.39554 4.62796 5.60427 5.11612 5.11612C5.60427 4.62796 6.39554 4.62796 6.88369 5.11612L9.99991 8.23233L13.1161 5.11612Z"
        fill="var(--color-common-0)"
      />
    </svg>
  );
}
