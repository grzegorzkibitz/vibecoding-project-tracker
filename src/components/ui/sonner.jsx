import { Toaster as Sonner } from 'sonner';

// shadcn-style Sonner toaster, themed with our tokens. Bottom-right, 4 s, light only (DESIGN.md §8).
export function Toaster(props) {
  return (
    <Sonner
      theme="light"
      position="bottom-right"
      duration={4000}
      toastOptions={{
        classNames: {
          toast: 'rounded-lg border border-border bg-card text-foreground shadow-lg text-sm',
          description: 'text-muted-foreground',
          actionButton: '!bg-primary !text-primary-foreground !font-medium',
        },
      }}
      {...props}
    />
  );
}

export { toast } from 'sonner';
