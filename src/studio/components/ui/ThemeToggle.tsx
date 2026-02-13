import { cn } from './cn';
import { useTheme } from '../../hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md';
}

export function ThemeToggle({ className, size = 'md' }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme, isDark } = useTheme();

  const sizeClasses = {
    sm: 'h-7 w-7 text-sm',
    md: 'h-8 w-8 text-base',
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'inline-flex items-center justify-center rounded-control border transition-all duration-200',
        'border-studio-border bg-white hover:bg-studio-panel',
        'dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-studio-blue/30',
        sizeClasses[size],
        className
      )}
      title={`Theme: ${theme === 'system' ? `System (${resolvedTheme})` : theme} (Ctrl+Shift+L)`}
      aria-label={`Current theme: ${theme}. Click to toggle.`}
    >
      {isDark ? (
        <span aria-hidden="true">🌙</span>
      ) : (
        <span aria-hidden="true">☀️</span>
      )}
    </button>
  );
}

interface ThemeSelectorProps {
  className?: string;
}

export function ThemeSelector({ className }: ThemeSelectorProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
        className={cn(
          'h-8 rounded-control border px-2 text-sm',
          'border-studio-border bg-white',
          'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100',
          'focus:border-studio-blue focus:outline-none focus:ring-2 focus:ring-studio-blue/20'
        )}
        aria-label="Select theme"
      >
        <option value="light">☀️ Light</option>
        <option value="dark">🌙 Dark</option>
        <option value="system">💻 System ({resolvedTheme})</option>
      </select>
    </div>
  );
}
