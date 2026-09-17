"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("aether-theme");
    const isDark = saved === "dark";
    setDark(isDark);
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
  }, []);

  function toggleTheme() {
    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.dataset.theme = nextDark ? "dark" : "light";
    window.localStorage.setItem("aether-theme", nextDark ? "dark" : "light");
  }

  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label={dark ? "Use light theme" : "Use dark theme"} title={dark ? "Use light theme" : "Use dark theme"}>
      {dark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
