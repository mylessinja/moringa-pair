import { cn } from '@/lib/utils';

export default function Logo({ className = '' }) {
  return (
    <span className={cn('inline-flex items-center gap-2 font-bold text-lg tracking-tight text-slate-900 dark:text-gray-300', className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
        M
      </span>
      Moringa<span className="text-primary">Pair</span>
    </span>
  );
}
