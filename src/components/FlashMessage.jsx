import { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, Info, X } from "lucide-react";

const FlashMessage = ({ message, type, onClose, darkMode }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [onClose]);

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
      classes: darkMode
        ? "bg-red-600/95 border-red-500 text-red-100"
        : "bg-red-500/95 border-red-400 text-white",
      iconContainerBg: darkMode ? "bg-red-500/40" : "bg-red-400/40",
      closeHoverBg: darkMode ? "hover:bg-white/20" : "hover:bg-black/10",
    },
    info: {
      icon: <Info className="h-6 w-6 flex-shrink-0" />,
      classes: darkMode
        ? "bg-blue-600/95 border-blue-500 text-blue-100"
        : "bg-blue-500/95 border-blue-400 text-white",
      iconContainerBg: darkMode ? "bg-blue-500/40" : "bg-blue-400/40",
      closeHoverBg: darkMode ? "hover:bg-white/20" : "hover:bg-black/10",
    },
  };

  const currentStyle = typeStyles[type];

  return (
    <div
      className={`fixed top-5 right-0 left-0 sm:left-auto mx-auto sm:mr-5 z-[100] w-[calc(100%-2.5rem)] sm:w-full max-w-xs sm:max-w-sm p-4 rounded-xl shadow-2xl flex items-start space-x-3 border backdrop-blur-sm transition-all duration-300 ${currentStyle.classes}`}
      style={{
        transform: isVisible ? "translateX(0)" : "translateX(100%)",
        opacity: isVisible ? 1 : 0,
      }}
      role="alert"
    >
      <div className={`p-1.5 rounded-full ${currentStyle.iconContainerBg}`}>
        {currentStyle.icon}
      </div>
      <div className="flex-1 text-sm font-medium pt-0.5">{message}</div>
      <button
        onClick={onClose}
        aria-label="Close message"
        className={`p-1 -mr-1 -mt-1 rounded-full transition-colors text-current/80 hover:text-current/100 ${currentStyle.closeHoverBg}`}
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default FlashMessage;

