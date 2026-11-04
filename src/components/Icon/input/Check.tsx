import type { IconProps } from '@/types/icon';

export default function CheckCircle({
  size = 20,
  color = 'var(--color-twilight-indigo-400)',
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
      aria-label="완료"
      {...props}
    >
      <rect width="20" height="20" rx="10" fill="currentColor" />
      <path
        d="M13.0001 6.25007C13.4143 5.69779 14.1978 5.58586 14.7501 6.00007C15.3023 6.41429 15.4143 7.19779 15.0001 7.75007L10.5001 13.7501C10.2927 14.0265 9.98023 14.2045 9.63678 14.2423C9.29323 14.28 8.94901 14.1742 8.68659 13.9493L5.18659 10.9493C4.66246 10.5 4.60164 9.71075 5.05084 9.1866C5.5001 8.66247 6.28938 8.60165 6.81354 9.05085L9.29987 11.1817L13.0001 6.25007Z"
        fill="var(--color-common-0)"
      />
    </svg>
  );
}
