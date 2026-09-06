import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'success' | 'danger';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: Variant;
  full?: boolean;
  size?: 'md' | 'lg' | 'sm';
  icon?: ReactNode;
  className?: string;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-action-primary-bg text-action-primary-fg shadow-[0_4px_0_0_var(--color-orange-dark)] active:shadow-none',
  secondary: 'bg-action-secondary-bg text-action-secondary-fg border border-navy/15 shadow-[0_4px_0_0_rgba(20,33,61,0.08)] active:shadow-none',
  ghost: 'bg-transparent text-navy',
  success: 'bg-green text-white shadow-[0_6px_0_0_var(--color-green-dark)] active:shadow-none',
  danger: 'bg-red-soft text-white shadow-[0_6px_0_0_#8e3323] active:shadow-none',
};

const SIZE_CLASSES = {
  sm: 'min-h-11 px-4 py-2 text-sm',
  md: 'min-h-12 px-6 py-3 text-base',
  lg: 'min-h-[52px] px-8 py-4 text-lg',
};

export function Button({ variant = 'primary', full, size = 'md', icon, children, className = '', disabled, ...rest }: ButtonProps) {
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.96, y: 2 }}
      className={`font-display inline-flex items-center justify-center gap-2 rounded-[var(--radius-lg)] font-bold transition-[transform,filter,opacity,box-shadow] duration-150 active:brightness-95 disabled:pointer-events-none disabled:opacity-40 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${full ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...(rest as any)}
    >
      {icon}
      {children}
    </motion.button>
  );
}
