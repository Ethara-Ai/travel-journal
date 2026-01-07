import { useState, useEffect, useCallback } from "react";

/**
 * useTheme - Custom hook for managing dark/light mode
 * Persists preference to localStorage
 * Respects system preference on first load
 * 
 * @returns {object} Theme state and toggle function
 */
const useTheme = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode !== null) {
      return storedDarkMode === "true";
    }
    // Fall back to system preference
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Save preference and update body/html class for scrollbar theming
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add("dark-mode");
      document.body.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  // Explicitly set dark mode
  const setTheme = useCallback((isDark) => {
    setDarkMode(isDark);
  }, []);

  return {
    darkMode,
    toggleDarkMode,
    setTheme,
    isDark: darkMode,
    isLight: !darkMode,
  };
};

export default useTheme;

