import { useCallback, useEffect, useState } from "react";

const KEY = "gitfolio.theme";
type Theme = "light" | "dark";

function current(): Theme {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
  } catch (_) {}
  // Dark is the default for a new visitor; OS preference is deliberately ignored.
  // A stored choice always wins, so a manual switch persists.
  return "dark";
}

function apply(theme: Theme) {
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }
}

// Ensure theme class is applied as early as possible
apply(current());

const listeners = new Set<(t: Theme) => void>();

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => current());

  useEffect(() => {
    listeners.add(setTheme);
    return () => {
      listeners.delete(setTheme);
    };
  }, []);

  useEffect(() => {
    apply(theme);
  }, [theme]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && (e.newValue === "light" || e.newValue === "dark")) {
        setTheme(e.newValue);
        apply(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(KEY, next);
      } catch (_) {}
      apply(next);
      listeners.forEach((listener) => {
        if (listener !== setTheme) {
          listener(next);
        }
      });
      return next;
    });
  }, []);

  return { theme, toggle };
}
