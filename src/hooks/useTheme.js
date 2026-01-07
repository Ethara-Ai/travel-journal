/**
 * useTheme - Custom hook for managing dark/light mode
 *
 * This hook re-exports from ThemeContext to avoid code duplication.
 * Use this hook in components that need access to theme state.
 *
 * @returns {object} Theme state and controls
 * @property {boolean} darkMode - Current dark mode state
 * @property {Function} toggleDarkMode - Function to toggle dark mode
 * @property {Function} setTheme - Function to explicitly set theme (isDark: boolean)
 * @property {boolean} isDark - Alias for darkMode
 * @property {boolean} isLight - Inverse of darkMode
 *
 * @example
 * const { darkMode, toggleDarkMode } = useTheme();
 *
 * @throws {Error} If used outside of ThemeProvider
 */
import { useThemeContext } from "../context/ThemeContext";

const useTheme = () => {
  return useThemeContext();
};

export default useTheme;
