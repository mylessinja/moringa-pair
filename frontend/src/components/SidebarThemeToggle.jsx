import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export default function SidebarThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`w-full justify-start text-zinc-500 dark:text-zinc-400 ${className}`}
    >
      {isDark ? (
        <Sun className="mr-2 h-3.5 w-3.5" strokeWidth={1.75} />
      ) : (
        <Moon className="mr-2 h-3.5 w-3.5" strokeWidth={1.75} />
      )}
      {isDark ? 'Light mode' : 'Dark mode'}
    </Button>
  );
}
