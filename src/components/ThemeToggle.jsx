import { Sun, Moon } from "lucide-react";

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <button
      onClick={toggleDarkMode}
      className={`cursor-pointer fixed bottom-6 right-6 z-40 flex items-center justify-center p-3.5 rounded-full shadow-lg transform transition-all duration-500 ease-out hover:scale-110 ${
        darkMode
          ? "bg-gray-700 hover:bg-gray-600 text-yellow-400 rotate-[360deg]"
          : "bg-white hover:bg-gray-100 text-indigo-600 rotate-0"
      }`}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <Sun className="h-6 w-6 transition-opacity duration-300" />
      ) : (
        <Moon className="h-6 w-6 transition-opacity duration-300" />
      )}
    </button>
  );
};

export default ThemeToggle;

