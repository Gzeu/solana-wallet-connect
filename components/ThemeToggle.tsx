'use client';

import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Component pentru toggle-ul de tema cu animații smooth
 */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme, isSystemPreference } = useTheme();

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-solana-purple focus:ring-offset-2 focus:ring-offset-transparent group ${className}`}
      style={{
        background: isDark 
          ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        boxShadow: isDark
          ? '0 4px 14px 0 rgba(147, 51, 234, 0.3)'
          : '0 4px 14px 0 rgba(251, 191, 36, 0.4)',
      }}
      aria-label={isDark ? 'Comută la modul luminos' : 'Comută la modul întunecat'}
      title={isDark ? 'Modul luminos' : 'Modul întunecat'}
    >
      {/* Sun Icon */}
      <svg
        className={`absolute w-6 h-6 text-white transition-all duration-500 transform ${
          isDark 
            ? 'opacity-0 rotate-90 scale-0' 
            : 'opacity-100 rotate-0 scale-100'
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>

      {/* Moon Icon */}
      <svg
        className={`absolute w-6 h-6 text-white transition-all duration-500 transform ${
          isDark 
            ? 'opacity-100 rotate-0 scale-100' 
            : 'opacity-0 -rotate-90 scale-0'
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>

      {/* Glow effect on hover */}
      <div 
        className={`absolute inset-0 rounded-full transition-opacity duration-300 opacity-0 group-hover:opacity-20`}
        style={{
          background: isDark 
            ? 'radial-gradient(circle, rgba(147, 51, 234, 0.8) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(251, 191, 36, 0.8) 0%, transparent 70%)',
        }}
      />
    </button>
  );
}

/**
 * Compact version pentru navbar sau header
 */
export function ThemeToggleCompact({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-solana-purple/50 ${className}`}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
      }}
      aria-label={isDark ? 'Modul luminos' : 'Modul întunecat'}
    >
      {isDark ? (
        <svg className="w-4 h-4" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg className="w-4 h-4" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
}

/**
 * Theme selector dropdown pentru settings
 */
export function ThemeSelector({ className = '' }: { className?: string }) {
  const { theme, setTheme, isSystemPreference, setSystemPreference } = useTheme();

  const handleThemeChange = (value: string) => {
    if (value === 'system') {
      setSystemPreference(true);
    } else {
      setTheme(value as Theme);
    }
  };

  const currentValue = isSystemPreference ? 'system' : theme;

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
        Temă interfață
      </label>
      <select
        value={currentValue}
        onChange={(e) => handleThemeChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-solana-purple"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)',
          color: 'var(--text-primary)',
        }}
      >
        <option value="system">🔄 Automată (sistem)</option>
        <option value="light">☀️ Luminos</option>
        <option value="dark">🌙 Întunecat</option>
      </select>
      
      {isSystemPreference && (
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          Tema se schimbă automat cu preferințele sistemului
        </p>
      )}
    </div>
  );
}