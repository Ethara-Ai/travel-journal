import { useState, useEffect, useRef } from "react";
import { CheckCircle, AlertTriangle, Info, X } from "lucide-react";
import PropTypes from "prop-types";

/**
 * FlashMessage Component
 * Displays temporary notification messages with auto-dismiss
 *
 * @param {string} message - The message to display
 * @param {string} type - Message type: "success" | "error" | "info"
 * @param {Function} onClose - Callback when message is closed
 * @param {boolean} darkMode - Dark mode toggle
 * @param {number} duration - Auto-dismiss duration in ms (default: 5000)
 */
const FlashMessage = ({ message, type = "info", onClose, darkMode, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    // Show the message with a slight delay for animation
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    // Auto-hide after duration
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      // Store the close timer ref so we can clean it up
      closeTimerRef.current = setTimeout(onClose, 300);
    }, duration);

    // Cleanup function - clear ALL timeouts
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, [onClose, duration]);

  // Handle manual close
  const handleClose = () => {
    setIsVisible(false);
    // Clear any existing close timer
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    // Set new close timer for animation
    closeTimerRef.current = setTimeout(onClose, 300);
  };

  const typeStyles = {
    success: {
      icon: <CheckCircle className="h-6 w-6 flex-shrink-0" />,
      classes: darkMode
        ? "bg-green-600/95 border-green-500 text-green-100"
        : "bg-green-500/95 border-green-400 text-white",
      iconContainerBg: darkMode ? "bg-green-500/40" : "bg-green-400/40",
      closeHoverBg: darkMode ? "hover:bg-white/20" : "hover:bg-black/10",
    },
    error: {
      icon: <AlertTriangle className="h-6 w-6 flex-shrink-0" />,
      classes: darkMode ? "bg-red-600/95 border-red-500 text-red-100" : "bg-red-500/95 border-red-400 text-white",
      iconContainerBg: darkMode ? "bg-red-500/40" : "bg-red-400/40",
      closeHoverBg: darkMode ? "hover:bg-white/20" : "hover:bg-black/10",
    },
    info: {
      icon: <Info className="h-6 w-6 flex-shrink-0" />,
      classes: darkMode ? "bg-blue-600/95 border-blue-500 text-blue-100" : "bg-blue-500/95 border-blue-400 text-white",
      iconContainerBg: darkMode ? "bg-blue-500/40" : "bg-blue-400/40",
      closeHoverBg: darkMode ? "hover:bg-white/20" : "hover:bg-black/10",
    },
  };

  const currentStyle = typeStyles[type] || typeStyles.info;

  return (
    <div
      className={`fixed top-5 right-0 left-0 sm:left-auto mx-auto sm:mr-5 z-[100] w-[calc(100%-2.5rem)] sm:w-full max-w-xs sm:max-w-sm p-4 rounded-xl shadow-2xl flex items-start space-x-3 border backdrop-blur-sm transition-all duration-300 ${currentStyle.classes}`}
      style={{
        transform: isVisible ? "translateX(0)" : "translateX(100%)",
        opacity: isVisible ? 1 : 0,
      }}
      role="alert"
      aria-live="polite"
    >
      <div className={`p-1.5 rounded-full ${currentStyle.iconContainerBg}`}>{currentStyle.icon}</div>
      <div className="flex-1 text-sm font-medium pt-0.5">{message}</div>
      <button
        onClick={handleClose}
        aria-label="Close message"
        className={`cursor-pointer p-1 -mr-1 -mt-1 rounded-full transition-colors text-current/80 hover:text-current/100 ${currentStyle.closeHoverBg}`}
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

FlashMessage.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "info"]),
  onClose: PropTypes.func.isRequired,
  darkMode: PropTypes.bool,
  duration: PropTypes.number,
};

FlashMessage.defaultProps = {
  type: "info",
  darkMode: false,
  duration: 5000,
};

export default FlashMessage;
