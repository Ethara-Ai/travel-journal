import { memo } from "react";
import PropTypes from "prop-types";
import { Sun, Moon } from "lucide-react";

/**
 * ThemeToggle Component
 *
 * A floating action button for toggling between light and dark mode.
 * Memoized to prevent unnecessary re-renders.
 *
 * @param {boolean} darkMode - Current dark mode state
 * @param {Function} toggleDarkMode - Function to toggle dark mode
 */
const ThemeToggle = memo(function ThemeToggle({ darkMode, toggleDarkMode }) {
  return (
    <button
      onClick={toggleDarkMode}
      type="button"
      className={`cursor-pointer fixed bottom-6 right-6 z-40 flex items-center justify-center p-3.5 rounded-full shadow-lg transform transition-all duration-500 ease-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        darkMode
          ? "bg-gray-700 hover:bg-gray-600 text-yellow-400 rotate-[360deg] focus:ring-yellow-400"
          : "bg-white hover:bg-gray-100 text-indigo-600 rotate-0 focus:ring-indigo-500"
      }`}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={darkMode}
    >
      {darkMode ? (
        <Sun className="h-6 w-6 transition-opacity duration-300" aria-hidden="true" />
      ) : (
        <Moon className="h-6 w-6 transition-opacity duration-300" aria-hidden="true" />
      )}
    </button>
  );
});

ThemeToggle.propTypes = {
  /** Current dark mode state */
  darkMode: PropTypes.bool,
  /** Function to toggle dark mode */
  toggleDarkMode: PropTypes.func.isRequired,
};

ThemeToggle.defaultProps = {
  darkMode: false,
};

export default ThemeToggle;
