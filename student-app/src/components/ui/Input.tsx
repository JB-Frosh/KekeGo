import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <label className="block w-full text-left">
      {label ? <span className="mb-1.5 block text-xs font-medium text-slate-600">{label}</span> : null}
      <input
        className={`w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 ${error ? 'border-rose-300' : ''} ${className}`}
        {...props}
      />
      {error ? <span className="mt-1 block text-xs text-rose-500">{error}</span> : null}
    </label>
  );
}
