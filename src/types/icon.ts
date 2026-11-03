import type { MouseEventHandler, SVGProps } from 'react';

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'width' | 'height' | 'color' | 'children'> & {
  size?: number;
  color?: string;
  onClick?: MouseEventHandler<SVGSVGElement>;
};

export const DEFAULT_ICON_COLOR = 'var(--color-neutral-80)';

export type NavIconProps = {
  active?: boolean;
};
