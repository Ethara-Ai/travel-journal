import { Plane, MapPin, Compass, Globe, Search, Plus } from "lucide-react";

/**
 * EmptyState - A reusable empty state component
 * 
 * @param {string} title - Main title text
 * @param {string} description - Description text
 * @param {string} icon - "plane" | "map" | "compass" | "globe" | "search" | "custom"
 * @param {React.ReactNode} customIcon - Custom icon component
 * @param {boolean} darkMode - Theme mode
 * @param {string} actionLabel - Action button label
 * @param {function} onAction - Action button callback
 * @param {string} variant - "default" | "compact" | "card"
 * @param {string} className - Additional CSS classes
 */
const EmptyState = ({
  title = "No items found",
  description = "Get started by adding your first item.",
  icon = "compass",
  customIcon,
  darkMode = false,
  actionLabel,
  onAction,
  variant = "default",
  className = "",
}) => {
  const icons = {
    plane: Plane,
    map: MapPin,
    compass: Compass,
    globe: Globe,
    search: Search,
  };

  const IconComponent = icons[icon] || icons.compass;

  const sizeClasses = {
    default: {
      container: "py-16 px-8",
      icon: "h-16 w-16",
      title: "text-xl",
      description: "text-base",
    },
    compact: {
      container: "py-8 px-4",
      icon: "h-12 w-12",
      title: "text-lg",
      description: "text-sm",
    },
    card: {
      container: "py-12 px-6",
      icon: "h-14 w-14",
      title: "text-lg",
      description: "text-sm",
    },
  };

  const sizes = sizeClasses[variant];

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${sizes.container} ${
        variant === "card"
          ? `rounded-2xl border-2 border-dashed ${
              darkMode
                ? "bg-gray-800/30 border-gray-700"
                : "bg-gray-50 border-gray-300"
            }`
          : ""
      } ${className}`}
    >
      {/* Icon */}
      <div
        className={`mb-6 p-4 rounded-2xl ${
          darkMode
            ? "bg-gradient-to-br from-sky-900/50 to-indigo-900/50"
            : "bg-gradient-to-br from-sky-100 to-indigo-100"
        }`}
      >
        {customIcon || (
          <IconComponent
            className={`${sizes.icon} ${
              darkMode ? "text-sky-400" : "text-sky-600"
            }`}
          />
        )}
      </div>

      {/* Title */}
      <h3
        className={`font-semibold mb-2 ${sizes.title} ${
          darkMode ? "text-gray-100" : "text-gray-800"
        }`}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className={`max-w-sm mb-6 ${sizes.description} ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {description}
      </p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className={`cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
            darkMode
              ? "bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-lg shadow-sky-900/30"
              : "bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white shadow-lg shadow-sky-500/30"
          }`}
        >
          <Plus className="h-4 w-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

/**
 * NoResultsState - Pre-styled for search results
 */
export const NoResultsState = ({ query, darkMode, onClear, className = "" }) => {
  return (
    <EmptyState
      icon="search"
      title="No results found"
      description={
        query
          ? `We couldn't find anything matching "${query}". Try different keywords.`
          : "Try adjusting your search or filters."
      }
      actionLabel={query ? "Clear Search" : undefined}
      onAction={onClear}
      darkMode={darkMode}
      variant="compact"
      className={className}
    />
  );
};

/**
 * NoTripsState - Pre-styled for empty trips
 */
export const NoTripsState = ({ darkMode, onAddTrip, className = "" }) => {
  return (
    <EmptyState
      icon="plane"
      title="No adventures yet!"
      description="Start documenting your travel memories by adding your first trip."
      actionLabel="Add Your First Trip"
      onAction={onAddTrip}
      darkMode={darkMode}
      className={className}
    />
  );
};

export default EmptyState;

