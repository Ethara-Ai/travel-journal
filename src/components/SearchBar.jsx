import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

/**
 * SearchBar - A reusable search component with optional filters
 *
 * @param {string} value - Current search value
 * @param {function} onChange - Callback when search value changes
 * @param {string} placeholder - Placeholder text
 * @param {boolean} darkMode - Theme mode
 * @param {boolean} showClearButton - Show clear button when there's text
 * @param {boolean} autoFocus - Auto focus on mount
 * @param {function} onSubmit - Callback on Enter press
 * @param {React.ReactNode} filterComponent - Optional filter dropdown component
 * @param {string} size - "small" | "default" | "large"
 * @param {string} className - Additional CSS classes
 */
const SearchBar = ({
  value = "",
  onChange,
  placeholder = "Search...",
  darkMode = false,
  showClearButton = true,
  autoFocus = false,
  onSubmit,
  filterComponent,
  size = "default",
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSubmit) {
      onSubmit(value);
    }
    if (e.key === "Escape") {
      onChange("");
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  const sizeClasses = {
    small: "py-2 pl-9 pr-9 text-xs",
    default: "py-2.5 pl-10 pr-10 text-sm",
    large: "py-3 pl-12 pr-12 text-base",
  };

  const iconSizeClasses = {
    small: "h-4 w-4",
    default: "h-5 w-5",
    large: "h-6 w-6",
  };

  const iconLeftClasses = {
    small: "left-2.5",
    default: "left-3",
    large: "left-4",
  };

  const iconRightClasses = {
    small: "right-2.5",
    default: "right-3",
    large: "right-4",
  };

  return (
    <div className={`relative flex items-center gap-2 ${className}`}>
      <div className="relative flex-grow">
        {/* Search Icon */}
        <div
          className={`absolute inset-y-0 ${iconLeftClasses[size]} flex items-center pointer-events-none transition-colors duration-200`}
        >
          <Search
            className={`${iconSizeClasses[size]} ${
              isFocused ? (darkMode ? "text-sky-400" : "text-sky-500") : darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full ${sizeClasses[size]} rounded-xl border-2 outline-none transition-all duration-300 ${
            darkMode
              ? "bg-gray-800/80 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
          } ${
            isFocused
              ? darkMode
                ? "border-sky-500 ring-2 ring-sky-500/40"
                : "border-sky-500 ring-2 ring-sky-500/30"
              : darkMode
                ? "hover:border-sky-500"
                : "hover:border-sky-400"
          }`}
          aria-label={placeholder}
        />

        {/* Clear Button */}
        {showClearButton && value && (
          <button
            onClick={handleClear}
            className={`absolute inset-y-0 ${iconRightClasses[size]} flex items-center cursor-pointer transition-all duration-200 ${
              darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"
            }`}
            aria-label="Clear search"
          >
            <X className={iconSizeClasses[size]} />
          </button>
        )}
      </div>

      {/* Optional Filter Component */}
      {filterComponent && <div className="flex-shrink-0">{filterComponent}</div>}
    </div>
  );
};

/**
 * SearchBarWithSuggestions - Search bar with autocomplete suggestions
 */
export const SearchBarWithSuggestions = ({
  value = "",
  onChange,
  suggestions = [],
  onSelectSuggestion,
  placeholder = "Search...",
  darkMode = false,
  maxSuggestions = 5,
  className = "",
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef(null);

  const filteredSuggestions = suggestions
    .filter((s) => s.toLowerCase().includes(value.toLowerCase()))
    .slice(0, maxSuggestions);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (suggestion) => {
    onChange(suggestion);
    onSelectSuggestion?.(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <SearchBar
        value={value}
        onChange={(val) => {
          onChange(val);
          setShowSuggestions(val.length > 0);
        }}
        placeholder={placeholder}
        darkMode={darkMode}
        autoFocus={false}
      />

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          className={`absolute z-50 w-full mt-1.5 rounded-xl border-2 shadow-xl overflow-hidden ${
            darkMode ? "bg-gray-800/95 border-gray-600/80" : "bg-white/95 border-gray-200/80"
          }`}
        >
          <div className="max-h-60 overflow-y-auto dropdown-scrollbar py-1">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSelect(suggestion)}
                className={`cursor-pointer w-full px-4 py-2.5 text-left text-sm transition-all duration-200 ${
                  darkMode
                    ? "text-gray-200 hover:bg-gray-700/80 hover:text-sky-300"
                    : "text-gray-700 hover:bg-sky-50 hover:text-sky-600"
                }`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
