import { memo } from "react";
import { Star } from "lucide-react";
import PropTypes from "prop-types";

/**
 * RatingStars Component
 * Displays a 5-star rating system with optional interactivity
 *
 * @param {number} rating - Current rating value (1-5)
 * @param {boolean} darkMode - Dark mode toggle
 * @param {Function} onRate - Callback when a star is clicked (interactive mode only)
 * @param {boolean} interactive - Whether stars are clickable
 * @param {string} size - Tailwind size classes for stars (e.g., "h-4 w-4")
 * @param {string} label - Optional label for screen readers
 */
const RatingStars = memo(function RatingStars({
  rating,
  darkMode,
  onRate,
  interactive = false,
  size = "h-4 w-4",
  label,
}) {
  // Common star classes
  const getStarClasses = (index) => {
    const isFilled = index < rating;
    const baseClasses = `${size} transition-colors duration-200`;
    const interactiveClasses = interactive ? "cursor-pointer hover:scale-110 transition-transform" : "";

    const colorClasses = isFilled
      ? darkMode
        ? "fill-yellow-400 text-yellow-400"
        : "fill-yellow-500 text-yellow-500"
      : darkMode
        ? "fill-gray-600 text-gray-600"
        : "fill-gray-300 text-gray-400";

    return `${baseClasses} ${interactiveClasses} ${colorClasses}`;
  };

  // Handle keyboard navigation for interactive mode
  const handleKeyDown = (index, event) => {
    if (!interactive || !onRate) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onRate(index + 1);
    }

    // Arrow key navigation
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      const newRating = Math.min(5, (rating || 0) + 1);
      onRate(newRating);
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      const newRating = Math.max(1, (rating || 0) - 1);
      onRate(newRating);
    }
  };

  // Generate aria-label for the rating
  const getAriaLabel = () => {
    if (label) return label;
    if (interactive) {
      return `Rating: ${rating || 0} out of 5 stars. Use arrow keys to change.`;
    }
    return `${rating || 0} out of 5 stars`;
  };

  // For non-interactive display, use a simpler structure
  if (!interactive) {
    return (
      <div className="flex items-center" role="img" aria-label={getAriaLabel()}>
        {[...Array(5)].map((_, index) => (
          <Star key={index} className={getStarClasses(index)} aria-hidden="true" />
        ))}
      </div>
    );
  }

  // Interactive rating with proper accessibility
  return (
    <div className="flex items-center" role="radiogroup" aria-label={label || "Rating"}>
      {[...Array(5)].map((_, index) => (
        <button
          key={index}
          type="button"
          role="radio"
          aria-checked={index + 1 === rating}
          aria-label={`${index + 1} star${index !== 0 ? "s" : ""}`}
          tabIndex={index + 1 === rating || (rating === 0 && index === 0) ? 0 : -1}
          onClick={() => onRate?.(index + 1)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="p-0.5 bg-transparent border-none outline-none focus:ring-2 focus:ring-yellow-400/50 focus:ring-offset-1 rounded-sm"
        >
          <Star className={getStarClasses(index)} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
});

RatingStars.propTypes = {
  /** Current rating value (0-5) */
  rating: PropTypes.number,
  /** Dark mode toggle */
  darkMode: PropTypes.bool,
  /** Callback when a star is clicked (receives rating 1-5) */
  onRate: PropTypes.func,
  /** Whether stars are clickable */
  interactive: PropTypes.bool,
  /** Tailwind size classes for stars */
  size: PropTypes.string,
  /** Optional label for screen readers */
  label: PropTypes.string,
};

RatingStars.defaultProps = {
  rating: 0,
  darkMode: false,
  onRate: undefined,
  interactive: false,
  size: "h-4 w-4",
  label: undefined,
};

export default RatingStars;
