import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  icon?: ReactNode;
  fullWidth?: boolean;
};

export function Button({
  variant = 'primary',
  icon,
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-60';

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-sky-600 text-white hover:bg-sky-700',
    secondary: 'bg-slate-900 text-white hover:bg-slate-800',
    outline: 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50',
    ghost: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} px-4 py-3 text-sm ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
