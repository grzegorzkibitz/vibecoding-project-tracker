import { forwardRef } from 'react';
import * as AlertPrimitive from '@radix-ui/react-alert-dialog';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const AlertDialog = AlertPrimitive.Root;
export const AlertDialogTrigger = AlertPrimitive.Trigger;

export const AlertDialogContent = forwardRef(({ className, ...props }, ref) => (
  <AlertPrimitive.Portal>
    <AlertPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/50" />
    <AlertPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-1/2 top-1/2 z-[70] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-card p-6 shadow-lg',
        className,
      )}
      {...props}
    />
  </AlertPrimitive.Portal>
));
AlertDialogContent.displayName = 'AlertDialogContent';

export const AlertDialogTitle = forwardRef(({ className, ...props }, ref) => (
  <AlertPrimitive.Title ref={ref} className={cn('text-lg font-semibold', className)} {...props} />
));
AlertDialogTitle.displayName = 'AlertDialogTitle';

export const AlertDialogDescription = forwardRef(({ className, ...props }, ref) => (
  <AlertPrimitive.Description ref={ref} className={cn('mt-1 text-sm text-muted-foreground', className)} {...props} />
));
AlertDialogDescription.displayName = 'AlertDialogDescription';

export const AlertDialogAction = forwardRef(({ className, ...props }, ref) => (
  <AlertPrimitive.Action ref={ref} className={cn(buttonVariants({ variant: 'destructive' }), className)} {...props} />
));
AlertDialogAction.displayName = 'AlertDialogAction';

export const AlertDialogCancel = forwardRef(({ className, ...props }, ref) => (
  <AlertPrimitive.Cancel ref={ref} className={cn(buttonVariants({ variant: 'outline' }), className)} {...props} />
));
AlertDialogCancel.displayName = 'AlertDialogCancel';
