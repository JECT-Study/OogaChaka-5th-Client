'use client';

import type { ComponentProps } from 'react';
import { Toaster as SonnerToaster } from 'sonner';
import { CheckCircle, ErrorCircle, SnackbarClose, WarningCircle } from '@/components/Icon/input';

export type ToasterProps = ComponentProps<typeof SonnerToaster>;

export default function Toaster({ toastOptions, icons, ...props }: ToasterProps) {
  return (
    <SonnerToaster
      position="top-center"
      icons={{
        success: <CheckCircle size={20} />,
        error: <ErrorCircle size={20} />,
        warning: <WarningCircle size={20} />,
        close: <SnackbarClose />,
        ...icons,
      }}
      toastOptions={{
        closeButtonAriaLabel: '닫기',
        ...toastOptions,
        classNames: {
          toast:
            "!rounded-md data-[mounted=true]:!opacity-[0.84] !bg-cool-neutral-90 !text-static-white !border-transparent font-features-['ss10']",
          info: '[&>[data-icon]]:!text-primary-normal',
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  );
}
