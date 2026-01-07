import { useState, useRef, useEffect } from "react";

/**
 * Tooltip - A reusable tooltip component
 * 
 * @param {string} content - Tooltip text content
 * @param {React.ReactNode} children - Element to attach tooltip to
 * @param {string} position - "top" | "bottom" | "left" | "right"
 * @param {boolean} darkMode - Theme mode
 * @param {number} delay - Delay before showing tooltip (ms)
 * @param {string} className - Additional CSS classes
 */
const Tooltip = ({
  content,
  children,
  position = "top",
  darkMode = false,
  delay = 200,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let x = 0;
      let y = 0;

      switch (position) {
        case "top":
          x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          y = triggerRect.top - tooltipRect.height - 8;
          break;
        case "bottom":
          x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          y = triggerRect.bottom + 8;
          break;
        case "left":
          x = triggerRect.left - tooltipRect.width - 8;
          y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          break;
        case "right":
          x = triggerRect.right + 8;
          y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          break;
      }

      // Keep tooltip within viewport
      x = Math.max(8, Math.min(x, window.innerWidth - tooltipRect.width - 8));
      y = Math.max(8, Math.min(y, window.innerHeight - tooltipRect.height - 8));

      setCoords({ x, y });
    }
  }, [isVisible, position]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const arrowClasses = {
    top: "bottom-[-4px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent",
    bottom: "top-[-4px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent",
    left: "right-[-4px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent",
    right: "left-[-4px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent",
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className={`inline-block ${className}`}
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`fixed z-[200] px-3 py-2 text-sm font-medium rounded-lg shadow-lg transition-opacity duration-200 max-w-xs ${
            darkMode
              ? "bg-gray-700 text-white"
              : "bg-gray-900 text-white"
          }`}
          style={{
            left: coords.x,
            top: coords.y,
          }}
        >
          {content}
          {/* Arrow */}
          <div
            className={`absolute w-0 h-0 border-4 ${arrowClasses[position]} ${
              darkMode ? "border-gray-700" : "border-gray-900"
            }`}
          />
        </div>
      )}
    </>
  );
};

/**
 * TooltipWrapper - Simple tooltip with just a wrapper
 */
export const TooltipWrapper = ({ text, children, darkMode, position = "top" }) => {
  if (!text) return children;
  
  return (
    <Tooltip content={text} darkMode={darkMode} position={position}>
      {children}
    </Tooltip>
  );
};

export default Tooltip;

