import type { IconProps } from '@/types/icon';

export default function StatusIcon({ size = 22, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="오류"
      {...props}
    >
      <rect x="1" y="1" width="20" height="20" rx="10" fill="#666666" fillOpacity="0.73" />
      <path
        d="M12.25 10.3496L12.25 15.3496C12.25 16.04 11.6904 16.5996 11 16.5996C10.3096 16.5996 9.75 16.04 9.75 15.3496L9.75 10.3496C9.75 9.65925 10.3096 9.09961 11 9.09961C11.6904 9.09961 12.25 9.65925 12.25 10.3496Z"
        fill="#FCFCFC"
      />
      <path
        d="M11 7.90039C10.3096 7.90039 9.75 7.34075 9.75 6.65039C9.75 5.96003 10.3096 5.40039 11 5.40039C11.6904 5.40039 12.25 5.96003 12.25 6.65039C12.25 7.34075 11.6904 7.90039 11 7.90039Z"
        fill="#FCFCFC"
      />
    </svg>
  );
}
