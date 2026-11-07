import type { IconProps } from '@/types/icon';

export type AvatarDefaultProps = Omit<IconProps, 'size'> & {
  width?: number | string;
  height?: number | string;
};

export default function AvatarDefault({
  width = '100%',
  height = '100%',
  color = '#FCFCFC',
  style,
  ...props
}: AvatarDefaultProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 42 46"
      fill="none"
      style={{ color, ...style }}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <circle cx="21.0021" cy="9.31657" r="9.31657" fill="currentColor" />
      <path
        d="M0.870205 31.1567C2.37919 25.8946 7.19125 22.2685 12.6654 22.2686L29.3024 22.2686C34.8911 22.2686 39.7738 26.045 41.1789 31.4542L41.7083 33.4925C43.2471 39.6408 38.5973 45.5978 32.2593 45.5978H10.1222C3.73586 45.5978 -1.05346 39.7545 0.200385 33.4925L0.870205 31.1567Z"
        fill="currentColor"
      />
    </svg>
  );
}
