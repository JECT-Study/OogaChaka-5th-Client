export interface AvatarFallbackProps {
  width?: number | string;
  height?: number | string;
  color?: string;
  className?: string;
}

export default function AvatarFallback({
  width = '100%',
  height = '100%',
  color = 'var(--Static-White, #FCFCFC)',
  className,
}: AvatarFallbackProps) {
  return (
    <svg
      viewBox="0 0 42 46"
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="21.0021" cy="9.31657" r="9.31657" fill={color} />

      <path
        d="M0.870205 31.1567C2.37919 25.8946 7.19125 22.2685 12.6654 22.2686L29.3024 22.2686C34.8911 22.2686 39.7738 26.045 41.1789 31.4542L41.7083 33.4925C43.2471 39.6408 38.5973 45.5978 32.2593 45.5978H10.1222C3.73586 45.5978 -1.05346 39.7545 0.200385 33.4925L0.870205 31.1567Z"
        fill={color}
      />
    </svg>
  );
}
