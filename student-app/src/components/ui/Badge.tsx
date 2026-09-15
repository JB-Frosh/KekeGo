type BadgeProps = {
  children: React.ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
};

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  const palette: Record<NonNullable<BadgeProps['tone']>, string> = {
    neutral: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-rose-100 text-rose-700',
    info: 'bg-sky-100 text-sky-700',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${palette[tone]}`}>
      {children}
    </span>
  );
}
