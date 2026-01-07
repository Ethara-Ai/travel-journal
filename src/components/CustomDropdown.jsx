import { useState, useRef, useEffect, memo } from "react";
import PropTypes from "prop-types";
import { ChevronDown, Check } from "lucide-react";

/**
 * CustomDropdown Component
 *
 * A reusable, accessible dropdown select component with custom styling.
 * Memoized to prevent unnecessary re-renders.
 *
 * @param {Array} options - Array of option objects with value and label
 * @param {string|number} value - Currently selected value
 * @param {Function} onChange - Callback when selection changes
 * @param {string} placeholder - Placeholder text when no selection
 * @param {boolean} darkMode - Dark mode toggle
 * @param {boolean} disabled - Whether the dropdown is disabled
 * @param {boolean} error - Whether to show error styling
 * @param {string} className - Additional CSS classes
 * @param {string} ariaLabel - Accessible label for the dropdown
 * @param {string} id - HTML id attribute
 */
const CustomDropdown = memo(function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  darkMode = false,
  disabled = false,
  error = false,
  className = "",
  ariaLabel,
  id,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Find the label for the current value
  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption?.label || placeholder;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (disabled) return;

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          // Move to next option
          const currentIndex = options.findIndex((opt) => opt.value === value);
          const nextIndex = Math.min(currentIndex + 1, options.length - 1);
          onChange(options[nextIndex].value);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (isOpen) {
          // Move to previous option
          const currentIndex = options.findIndex((opt) => opt.value === value);
          const prevIndex = Math.max(currentIndex - 1, 0);
          onChange(options[prevIndex].value);
        }
        break;
      case "Home":
        event.preventDefault();
        if (options.length > 0) {
          onChange(options[0].value);
        }
        break;
      case "End":
        event.preventDefault();
        if (options.length > 0) {
          onChange(options[options.length - 1].value);
        }
        break;
      default:
        break;
    }
  };

  // Base styles matching the website UI
  const baseClasses =
    "w-full p-2.5 rounded-xl border-2 transition-all duration-300 text-sm cursor-pointer flex items-center justify-between shadow-sm";

  // State-based styles with sky/indigo theme
  const stateClasses = disabled
    ? darkMode
      ? "bg-gray-800/50 border-gray-700 text-gray-500 cursor-not-allowed"
      : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
    : error
      ? darkMode
        ? "bg-gray-800/80 border-red-500 text-white hover:border-red-400"
        : "bg-white border-red-400 text-gray-900 hover:border-red-500"
      : darkMode
        ? "bg-gray-800/80 border-gray-600 text-white hover:border-sky-500 hover:bg-gray-800"
        : "bg-white border-gray-200 text-gray-900 hover:border-sky-400 hover:bg-gray-50";

  // Focus/open state with sky theme
  const focusClasses = isOpen
    ? darkMode
      ? "ring-2 ring-sky-500/40 border-sky-500 bg-gray-800"
      : "ring-2 ring-sky-500/30 border-sky-500 bg-white"
    : "";

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        id={id}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={id ? `${id}-listbox` : undefined}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`${baseClasses} ${stateClasses} ${focusClasses} focus:outline-none`}
      >
        <span className={!selectedOption ? (darkMode ? "text-gray-400" : "text-gray-500") : ""}>{displayText}</span>
        <ChevronDown
          className={`h-4 w-4 transition-all duration-300 ${isOpen ? "rotate-180" : ""} ${
            isOpen ? (darkMode ? "text-sky-400" : "text-sky-500") : darkMode ? "text-gray-400" : "text-gray-500"
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && !disabled && (
        <div
          id={id ? `${id}-listbox` : undefined}
          className={`absolute z-50 w-full mt-1.5 rounded-xl border-2 shadow-xl overflow-hidden backdrop-blur-sm ${
            darkMode ? "bg-gray-800/95 border-gray-600/80" : "bg-white/95 border-gray-200/80"
          }`}
          role="listbox"
          aria-label={ariaLabel}
        >
          <div className="max-h-60 overflow-y-auto dropdown-scrollbar py-1">
            {options.map((option, index) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={value === option.value}
                onClick={() => handleSelect(option.value)}
                className={`cursor-pointer w-full px-3 py-2.5 text-left text-sm flex items-center justify-between transition-all duration-200 ${
                  value === option.value
                    ? darkMode
                      ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-medium"
                      : "bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-medium"
                    : darkMode
                      ? "text-gray-200 hover:bg-gray-700/80 hover:text-sky-300"
                      : "text-gray-700 hover:bg-sky-50 hover:text-sky-600"
                } ${index === 0 ? "rounded-t-lg" : ""} ${index === options.length - 1 ? "rounded-b-lg" : ""}`}
              >
                <span>{option.label}</span>
                {value === option.value && <Check className="h-4 w-4 flex-shrink-0" aria-hidden="true" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

CustomDropdown.propTypes = {
  /** Array of option objects with value and label */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  /** Currently selected value */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Callback when selection changes */
  onChange: PropTypes.func.isRequired,
  /** Placeholder text when no selection */
  placeholder: PropTypes.string,
  /** Dark mode toggle */
  darkMode: PropTypes.bool,
  /** Whether the dropdown is disabled */
  disabled: PropTypes.bool,
  /** Whether to show error styling */
  error: PropTypes.bool,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Accessible label for the dropdown */
  ariaLabel: PropTypes.string,
  /** HTML id attribute */
  id: PropTypes.string,
};

CustomDropdown.defaultProps = {
  value: undefined,
  placeholder: "Select an option",
  darkMode: false,
  disabled: false,
  error: false,
  className: "",
  ariaLabel: undefined,
  id: undefined,
};

export default CustomDropdown;
