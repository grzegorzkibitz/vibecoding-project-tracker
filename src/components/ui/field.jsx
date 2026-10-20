import { forwardRef } from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils';

const fieldBase =
  'w-full rounded-md border border-input bg-card px-3 text-sm placeholder:text-muted-foreground disabled:opacity-50 aria-[invalid=true]:border-destructive';

export const Label = forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn('text-sm font-medium', className)} {...props} />
));
Label.displayName = 'Label';

export const Input = forwardRef(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(fieldBase, 'h-10', className)} {...props} />
));
Input.displayName = 'Input';

export const Textarea = forwardRef(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(fieldBase, 'min-h-20 py-2', className)} {...props} />
));
Textarea.displayName = 'Textarea';

// Native <select>: fully keyboard and screen-reader accessible, styled to match.
export const Select = forwardRef(({ className, children, ...props }, ref) => (
  <select ref={ref} className={cn(fieldBase, 'h-10', className)} {...props}>
    {children}
  </select>
));
Select.displayName = 'Select';
