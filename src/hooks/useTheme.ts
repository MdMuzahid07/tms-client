"use client";

import { useTheme as useNextTheme } from "next-themes";

export type Theme = "light" | "dark" | "system";

interface UseThemeReturn {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
  systemTheme: "light" | "dark";
  isDark: boolean;
  isLight: boolean;
  isSystem: boolean;
  toggleTheme: () => void;
  cycleTheme: () => void;
}

export const useTheme = (): UseThemeReturn => {
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme();

  const currentTheme = (theme as Theme) || "system";
  const currentResolvedTheme = (resolvedTheme as "light" | "dark") || "light";
  const currentSystemTheme = (systemTheme as "light" | "dark") || "light";

  const isDark = currentResolvedTheme === "dark";
  const isLight = currentResolvedTheme === "light";
  const isSystem = currentTheme === "system";

  const toggleTheme = () => {
    if (currentTheme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const cycleTheme = () => {
    if (currentTheme === "light") {
      setTheme("dark");
    } else if (currentTheme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return {
    theme: currentTheme,
    setTheme,
    resolvedTheme: currentResolvedTheme,
    systemTheme: currentSystemTheme,
    isDark,
    isLight,
    isSystem,
    toggleTheme,
    cycleTheme,
  };
};

export default useTheme;
