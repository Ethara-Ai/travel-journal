import { createContext, useContext, useState, useEffect, useCallback } from "react";

/**
 * ThemeContext - Provides dark mode state and toggle function to all components
 * Eliminates prop drilling of darkMode throughout the component tree
 */
const ThemeContext = createContext(null);

/**
 * Custom hook to access theme context
 * @returns {object} Theme state and controls
 * @throws {Error} If used outside of ThemeProvider
 */
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};

/**
 * ThemeProvider Component
 * Wraps the application and provides theme context to all children
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components
 */
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first
    try {
      const storedDarkMode = localStorage.getItem("darkMode");
      if (storedDarkMode !== null) {
        return storedDarkMode === "true";
      }
    } catch (e) {
      console.error("Failed to read dark mode preference from localStorage:", e);
    }

    // Fall back to system preference
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Save preference and update body/html class for scrollbar theming
  useEffect(() => {
    try {
      localStorage.setItem("darkMode", darkMode.toString());
    } catch (e) {
      console.error("Failed to save dark mode preference to localStorage:", e);
    }

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

  const value = {
    darkMode,
    toggleDarkMode,
    setTheme,
    isDark: darkMode,
    isLight: !darkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
