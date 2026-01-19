'use client';

import { Toaster as Sonner } from 'sonner';
import { useTheme } from 'next-themes';

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          error:
            'group-[.toaster]:bg-destructive group-[.toaster]:text-destructive-foreground group-[.toaster]:border-destructive',
          success:
            'group-[.toaster]:bg-primary group-[.toaster]:text-primary-foreground group-[.toaster]:border-primary',
        },
      }}
      position="bottom-right"
      richColors
      closeButton
      {...props}
    />
  );
}

// Re-export toast function for convenience
export { toast } from 'sonner';
