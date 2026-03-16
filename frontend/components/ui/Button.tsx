import { clsx } from 'clsx';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ children, variant = 'primary', loading, size = 'md', className, ...props }: ButtonProps) {
  const base = 'inline-flex items-center gap-2 font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-primary hover:bg-primary-dark text-white',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-200',
    danger: 'bg-red-700 hover:bg-red-600 text-white',
    ghost: 'text-slate-400 hover:text-white hover:bg-slate-800',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };

  return (
    <button className={clsx(base, variants[variant], sizes[size], className)} disabled={loading || props.disabled} {...props}>
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
