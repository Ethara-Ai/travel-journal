/**
 * Badge - A reusable badge/tag component
 * 
 * @param {string} children - Badge content
 * @param {string} variant - "default" | "success" | "warning" | "error" | "info" | "custom"
 * @param {string} size - "small" | "default" | "large"
 * @param {boolean} darkMode - Theme mode
 * @param {boolean} removable - Show remove button
 * @param {function} onRemove - Callback when remove is clicked
 * @param {React.ReactNode} icon - Optional icon to display
 * @param {boolean} pill - Use fully rounded corners
 * @param {boolean} outline - Use outline style
 * @param {string} customColor - Custom color (when variant is "custom")
 * @param {string} className - Additional CSS classes
 */
const Badge = ({
  children,
  variant = "default",
  size = "default",
  darkMode = false,
  removable = false,
  onRemove,
  icon,
  pill = true,
  outline = false,
  customColor,
  className = "",
}) => {
  const sizeClasses = {
    small: "px-2 py-0.5 text-[10px]",
    default: "px-2.5 py-1 text-xs",
    large: "px-3 py-1.5 text-sm",
  };

  const iconSizeClasses = {
    small: "h-3 w-3",
    default: "h-3.5 w-3.5",
    large: "h-4 w-4",
  };

  const getVariantClasses = () => {
    const variants = {
      default: {
        solid: darkMode
          ? "bg-gray-700 text-gray-200"
          : "bg-gray-200 text-gray-700",
        outline: darkMode
          ? "border-gray-600 text-gray-300"
          : "border-gray-300 text-gray-600",
      },
      success: {
        solid: darkMode
          ? "bg-emerald-900/60 text-emerald-300"
          : "bg-emerald-100 text-emerald-700",
        outline: darkMode
          ? "border-emerald-600 text-emerald-400"
          : "border-emerald-500 text-emerald-600",
      },
      warning: {
        solid: darkMode
          ? "bg-amber-900/60 text-amber-300"
          : "bg-amber-100 text-amber-700",
        outline: darkMode
          ? "border-amber-600 text-amber-400"
          : "border-amber-500 text-amber-600",
      },
      error: {
        solid: darkMode
          ? "bg-red-900/60 text-red-300"
          : "bg-red-100 text-red-700",
        outline: darkMode
          ? "border-red-600 text-red-400"
          : "border-red-500 text-red-600",
      },
      info: {
        solid: darkMode
          ? "bg-sky-900/60 text-sky-300"
          : "bg-sky-100 text-sky-700",
        outline: darkMode
          ? "border-sky-600 text-sky-400"
          : "border-sky-500 text-sky-600",
      },
      primary: {
        solid: darkMode
          ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white"
          : "bg-gradient-to-r from-sky-500 to-indigo-500 text-white",
        outline: darkMode
          ? "border-sky-500 text-sky-400"
          : "border-sky-500 text-sky-600",
      },
      custom: {
        solid: customColor || (darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-700"),
        outline: customColor || (darkMode ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-600"),
      },
    };

    return variants[variant]?.[outline ? "outline" : "solid"] || variants.default.solid;
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium transition-all duration-200 ${
        sizeClasses[size]
      } ${pill ? "rounded-full" : "rounded-md"} ${
        outline ? "border-2 bg-transparent" : ""
      } ${getVariantClasses()} ${className}`}
    >
      {icon && <span className={iconSizeClasses[size]}>{icon}</span>}
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className={`ml-0.5 cursor-pointer transition-opacity hover:opacity-70 ${iconSizeClasses[size]}`}
          aria-label="Remove"
        >
          <svg viewBox="0 0 14 14" fill="currentColor">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L7 6.293l1.646-1.647a.5.5 0 0 1 .708.708L7.707 7l1.647 1.646a.5.5 0 0 1-.708.708L7 7.707l-1.646 1.647a.5.5 0 0 1-.708-.708L6.293 7 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </button>
      )}
    </span>
  );
};

/**
 * BadgeGroup - Display multiple badges
 */
export const BadgeGroup = ({ badges = [], darkMode, variant, size, className = "" }) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {badges.map((badge, index) => (
        <Badge
          key={index}
          darkMode={darkMode}
          variant={badge.variant || variant}
          size={size}
          icon={badge.icon}
          removable={badge.removable}
          onRemove={badge.onRemove}
        >
          {badge.label || badge}
        </Badge>
      ))}
    </div>
  );
};

/**
 * StatusBadge - Pre-styled status badge
 */
export const StatusBadge = ({ status, darkMode, className = "" }) => {
  const statusConfig = {
    active: { variant: "success", label: "Active" },
    inactive: { variant: "default", label: "Inactive" },
    pending: { variant: "warning", label: "Pending" },
    error: { variant: "error", label: "Error" },
    completed: { variant: "success", label: "Completed" },
    inProgress: { variant: "info", label: "In Progress" },
    visited: { variant: "success", label: "Visited" },
    wishlist: { variant: "primary", label: "Wishlist" },
  };

  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <Badge variant={config.variant} darkMode={darkMode} className={className}>
      {config.label}
    </Badge>
  );
};

export default Badge;

