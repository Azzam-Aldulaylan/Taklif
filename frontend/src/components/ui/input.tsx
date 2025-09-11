import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, ...props }, ref) => {
    const [direction, setDirection] = React.useState<'ltr' | 'rtl'>('rtl');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      
      // Only auto-detect direction for non-search inputs (inputs without search-input class)
      if (!className?.includes('search-input')) {
        // Detect if text contains Arabic characters
        const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
        const hasArabic = arabicRegex.test(value);
        
        // Set direction based on content
        if (value.length === 0) {
          setDirection('rtl'); // Default to RTL for Arabic placeholders
        } else if (hasArabic) {
          setDirection('rtl');
        } else {
          setDirection('ltr');
        }
      }

      // Call original onChange if provided
      if (props.onChange) {
        props.onChange(e);
      }
    };

    // For search inputs, don't apply automatic direction detection
    const inputDirection = className?.includes('search-input') ? undefined : direction;

    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            !className?.includes('search-input') && (direction === 'rtl' ? 'text-right' : 'text-left'),
            error && 'border-red-500 focus-visible:ring-red-500',
            className
          )}
          dir={inputDirection}
          {...props}
          onChange={handleChange}
          ref={ref}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };
