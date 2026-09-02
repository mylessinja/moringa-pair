import { cn } from '@/lib/utils';

export default function Logo({ className = '', label, subtitle, mark = 'M' }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
        {mark}
      </span>
      <span className="flex flex-col">
        {label ? (
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">{label}</span>
        ) : (
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-gray-300 leading-tight">Moringa<span className="text-primary">Pair</span></span>
        )}
        {subtitle && (
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-tight">{subtitle}</span>
        )}
      </span>
    </span>
  );
}
