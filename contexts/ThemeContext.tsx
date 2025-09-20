'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isSystemPreference: boolean;
  setSystemPreference: (useSystem: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [isSystemPreference, setSystemPreference] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('solana-theme') as Theme;
    const savedSystemPref = localStorage.getItem('solana-system-pref') === 'true';
    
    if (savedSystemPref) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setThemeState(systemTheme);
      setSystemPreference(true);
    } else if (savedTheme) {
      setThemeState(savedTheme);
      setSystemPreference(false);
    } else {
      // Default to system preference if no saved setting
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setThemeState(systemTheme);
      setSystemPreference(true);
    }
    
    setIsMounted(true);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (!isSystemPreference || !isMounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setThemeState(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isSystemPreference, isMounted]);

  // Apply theme to document
  useEffect(() => {
    if (!isMounted) return;

    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    
    // Save preferences
    if (!isSystemPreference) {
      localStorage.setItem('solana-theme', theme);
    }
    localStorage.setItem('solana-system-pref', isSystemPreference.toString());
  }, [theme, isSystemPreference, isMounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    setSystemPreference(false);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const handleSystemPreference = (useSystem: boolean) => {
    setSystemPreference(useSystem);
    
    if (useSystem) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setThemeState(systemTheme);
    }
  };

  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
    isSystemPreference,
    setSystemPreference: handleSystemPreference,
  };

  // Prevent hydration mismatch
  if (!isMounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook pentru utilizarea Theme Context
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Hook pentru detectarea theme-ului fără Context (pentru componente simple)
 */
export function useThemeDetection() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('dark');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute('data-theme') as Theme;
      if (theme) {
        setCurrentTheme(theme);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // Initial theme detection
    const theme = document.documentElement.getAttribute('data-theme') as Theme;
    if (theme) {
      setCurrentTheme(theme);
    }

    return () => observer.disconnect();
  }, []);

  return currentTheme;
}