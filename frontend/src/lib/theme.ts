import { useCallback, useEffect, useState } from "react";

const KEY = "gitfolio.theme";
type Theme = "light" | "dark";

function current(): Theme {
  // Light is the default for a new visitor; OS preference is deliberately ignored.
  // A stored choice always wins, so a manual switch persists.
  const stored = localStorage.getItem(KEY);
  return stored === "dark" ? "dark" : "light";
}

function apply(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => current());

  useEffect(() => {
    apply(theme);
    localStorage.setItem(KEY, theme);
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  return { theme, toggle };
}
