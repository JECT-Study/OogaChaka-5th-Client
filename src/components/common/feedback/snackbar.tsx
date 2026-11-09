import type { ReactNode } from 'react';
import { toast, type ExternalToast } from 'sonner';
import { CheckCircle, StatusIcon } from '@/components/Icon/input';

export interface SnackbarOptions extends Omit<ExternalToast, 'closeButton' | 'icon'> {
  message: boolean;
}

export function snackbar(text: ReactNode, { message, ...options }: SnackbarOptions) {
  return toast(text, {
    ...options,
    icon: message ? <CheckCircle size={20} color="var(--color-primary-normal)" /> : <StatusIcon />,
    closeButton: true,
    classNames: {
      ...options.classNames,
      toast: ['snackbar-toast', options.classNames?.toast].filter(Boolean).join(' '),
    },
  });
}
