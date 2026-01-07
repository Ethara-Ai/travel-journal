import { Globe, Plane } from "lucide-react";

const LoadingSpinner = ({ 
  darkMode, 
  size = "default", 
  text = "Loading your adventures...",
  fullScreen = false 
}) => {
  const sizeClasses = {
    small: "w-8 h-8",
    default: "w-16 h-16",
    large: "w-24 h-24",
  };

  const textSizeClasses = {
    small: "text-xs",
    default: "text-sm",
    large: "text-base",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 z-[100] flex items-center justify-center"
    : "flex items-center justify-center py-12";

  return (
    <div
      className={`${containerClasses} ${
        darkMode
          ? fullScreen ? "bg-gray-900/95 backdrop-blur-sm" : ""
          : fullScreen ? "bg-white/95 backdrop-blur-sm" : ""
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Main Globe Animation */}
        <div className="relative">
          {/* Outer rotating ring */}
          <div
            className={`${sizeClasses[size]} rounded-full border-4 border-transparent animate-spin-slow`}
            style={{
              borderTopColor: darkMode ? "#0ea5e9" : "#0284c7",
              borderRightColor: darkMode ? "#6366f1" : "#4f46e5",
              animationDuration: "3s",
            }}
          />

          {/* Middle pulsing ring */}
          <div
            className={`absolute inset-1 rounded-full animate-pulse-ring ${
              darkMode
                ? "bg-gradient-to-br from-sky-500/20 to-indigo-500/20"
                : "bg-gradient-to-br from-sky-400/20 to-indigo-400/20"
            }`}
          />

          {/* Inner rotating ring (opposite direction) */}
          <div
            className={`absolute inset-2 rounded-full border-2 border-transparent animate-spin-reverse`}
            style={{
              borderBottomColor: darkMode ? "#10b981" : "#059669",
              borderLeftColor: darkMode ? "#14b8a6" : "#0d9488",
              animationDuration: "2s",
            }}
          />

          {/* Center Globe Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`p-2 rounded-full animate-bounce-subtle ${
                darkMode
                  ? "bg-gray-800/80"
                  : "bg-white/80"
              }`}
            >
              <Globe
                className={`${
                  size === "small" ? "w-3 h-3" : size === "large" ? "w-8 h-8" : "w-5 h-5"
                } ${
                  darkMode ? "text-sky-400" : "text-sky-600"
                } animate-pulse`}
              />
            </div>
          </div>

          {/* Orbiting Plane */}
          <div
            className="absolute inset-0 animate-orbit"
            style={{ animationDuration: "4s" }}
          >
            <Plane
              className={`${
                size === "small" ? "w-3 h-3" : size === "large" ? "w-6 h-6" : "w-4 h-4"
              } ${
                darkMode ? "text-emerald-400" : "text-emerald-500"
              } transform -rotate-45 -translate-y-1`}
            />
          </div>
        </div>

        {/* Loading Text with Animated Dots */}
        {text && (
          <div className="flex flex-col items-center gap-2">
            <p
              className={`${textSizeClasses[size]} font-medium ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {text}
            </p>
            
            {/* Animated dots */}
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full animate-bounce-dot ${
                    darkMode
                      ? "bg-gradient-to-r from-sky-500 to-indigo-500"
                      : "bg-gradient-to-r from-sky-400 to-indigo-400"
                  }`}
                  style={{
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Progress bar (optional decorative) */}
        <div
          className={`w-48 h-1 rounded-full overflow-hidden ${
            darkMode ? "bg-gray-700" : "bg-gray-200"
          }`}
        >
          <div
            className={`h-full rounded-full animate-loading-bar ${
              darkMode
                ? "bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500"
                : "bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

// Simple spinner variant
export const SimpleSpinner = ({ darkMode, size = "default" }) => {
  const sizeClasses = {
    small: "w-5 h-5 border-2",
    default: "w-8 h-8 border-3",
    large: "w-12 h-12 border-4",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full animate-spin`}
      style={{
        borderColor: darkMode ? "#374151" : "#e5e7eb",
        borderTopColor: darkMode ? "#0ea5e9" : "#0284c7",
        borderRightColor: darkMode ? "#6366f1" : "#4f46e5",
      }}
    />
  );
};

// Dots spinner variant
export const DotsSpinner = ({ darkMode }) => {
  return (
    <div className="flex gap-1.5">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full animate-bounce-dot ${
            darkMode
              ? "bg-gradient-to-r from-sky-500 to-indigo-500"
              : "bg-gradient-to-r from-sky-400 to-indigo-400"
          }`}
          style={{
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
};

export default LoadingSpinner;

