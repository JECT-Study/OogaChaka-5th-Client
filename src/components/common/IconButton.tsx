import type { ButtonHTMLAttributes, ComponentType } from 'react';
import type { IconProps } from '@/types/icon';

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  icon: ComponentType<IconProps>;
  label: string;
  iconSize?: number;
  iconColor?: string;
};

export default function IconButton({
  icon: Icon,
  label,
  iconSize,
  iconColor,
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={['grid size-11 shrink-0 place-items-center', className].filter(Boolean).join(' ')}
      {...props}
    >
      <Icon size={iconSize} color={iconColor} aria-hidden />
    </button>
  );
}
