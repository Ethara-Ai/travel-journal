import { useState, memo } from "react";
import PropTypes from "prop-types";
import { ChevronRight, Edit2, Trash2, BookMarked } from "lucide-react";
import { hexToRgba } from "../utils/colorUtils";

/**
 * ContinentItem Component
 *
 * Displays a collapsible list of trips for a continent.
 * Memoized to prevent unnecessary re-renders when parent state changes.
 *
 * @param {string} continent - Continent name
 * @param {Array} trips - Array of trips in this continent
 * @param {number} currentTripId - Currently selected trip ID
 * @param {Function} onSelectTrip - Callback when a trip is selected
 * @param {boolean} darkMode - Theme mode
 * @param {string} continentColor - Color for this continent
 * @param {Object} countryFlags - Map of country to flag URLs
 * @param {Function} onEditTrip - Callback when edit is clicked
 * @param {Function} onDeleteTrip - Callback when delete is clicked
 */
const ContinentItem = memo(function ContinentItem({
  continent,
  trips,
  currentTripId,
  onSelectTrip,
  darkMode,
  continentColor,
  countryFlags = {},
  onEditTrip,
  onDeleteTrip,
}) {
  const [isOpen, setIsOpen] = useState(true);

  // Handle keyboard navigation for the continent toggle
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="mb-4 last:mb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-controls={`continent-trips-${continent.replace(/\s+/g, "-").toLowerCase()}`}
        className={`cursor-pointer flex items-center justify-between w-full py-3 px-4 group transition-all duration-300 rounded-xl ${
          darkMode ? "hover:bg-gray-700/60 active:bg-gray-700/80" : "hover:bg-gray-100/80 active:bg-gray-200/60"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0 transition-all duration-300 shadow-md"
            style={{
              backgroundColor: continentColor,
              boxShadow: `0 0 0 2px ${
                darkMode ? "rgba(17, 24, 39, 0.7)" : "rgba(255, 255, 255, 0.7)"
              }, 0 0 0 3px ${hexToRgba(continentColor, 0.3)}, 0 1px 3px ${hexToRgba(continentColor, 0.5)}`,
            }}
            aria-hidden="true"
          ></div>
          <h3
            className={`text-lg font-semibold ${
              darkMode ? "text-gray-100" : "text-gray-800"
            } transition-colors duration-300`}
          >
            {continent} ({trips.length})
          </h3>
        </div>
        <div
          className={`transform transition-all duration-300 ${
            isOpen ? "rotate-90 text-opacity-100" : "rotate-0 text-opacity-70"
          } ${darkMode ? "text-gray-400" : "text-gray-500"} group-hover:text-opacity-100`}
          aria-hidden="true"
        >
          <ChevronRight className="h-5 w-5" />
        </div>
      </button>

      {isOpen && (
        <ul
          id={`continent-trips-${continent.replace(/\s+/g, "-").toLowerCase()}`}
          className="space-y-1 pl-6 mt-2 border-l-2 ml-[9px] styled-scrollbar"
          style={{ borderColor: hexToRgba(continentColor, 0.3) }}
          role="list"
          aria-label={`Trips in ${continent}`}
        >
          {trips.map((trip) => {
            const flagUrl = countryFlags[trip.country];
            const isSelected = currentTripId === trip.id;

            return (
              <li
                key={trip.id}
                className={`group/item flex items-center justify-between transition-all duration-200 rounded-lg ${
                  isSelected
                    ? "font-semibold py-2 pl-3 pr-2 -ml-[1px] shadow-lg"
                    : `${
                        darkMode
                          ? "text-gray-300 hover:text-gray-100 hover:bg-gray-700/40"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/60"
                      } py-1.5 px-3 hover:pl-4`
                }`}
                style={{
                  backgroundColor: isSelected ? `${continentColor}E6` : "transparent",
                  color: isSelected ? "white" : undefined,
                  transitionProperty: "background-color, transform, padding, color",
                }}
              >
                <button
                  onClick={() => onSelectTrip(trip.id)}
                  className="cursor-pointer flex items-center space-x-3 flex-grow text-left bg-transparent border-none outline-none focus:ring-2 focus:ring-offset-1 rounded-md"
                  style={{
                    focusRingColor: isSelected ? "rgba(255,255,255,0.5)" : continentColor,
                  }}
                  aria-current={isSelected ? "true" : undefined}
                  aria-label={`View ${trip.city}, ${trip.country}${trip.isWishlist ? " (Wishlist)" : ""}`}
                >
                  {flagUrl && (
                    <img
                      src={flagUrl}
                      alt={`${trip.country} flag`}
                      className={`h-5 w-7 rounded-sm object-cover flex-shrink-0 shadow ${
                        isSelected
                          ? "border border-white/40"
                          : darkMode
                            ? "border border-gray-600/50"
                            : "border border-gray-300/70"
                      }`}
                    />
                  )}
                  <span className="text-sm">
                    {trip.city}, {trip.country}
                    {isSelected && <span className="ml-1.5 text-white/80 text-xs font-normal">(Viewing)</span>}
                    {trip.isWishlist && !isSelected && (
                      <BookMarked
                        className={`inline-block ml-1.5 h-3.5 w-3.5 ${darkMode ? "text-pink-400" : "text-pink-500"}`}
                        aria-label="Wishlist item"
                      />
                    )}
                  </span>
                </button>
                <div className="flex items-center space-x-1 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => onEditTrip(trip)}
                    title="Edit Trip"
                    aria-label={`Edit ${trip.city} trip`}
                    className={`cursor-pointer p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                      isSelected
                        ? "hover:bg-white/20 focus:ring-white/50"
                        : darkMode
                          ? "hover:bg-gray-600/50 focus:ring-sky-400"
                          : "hover:bg-gray-200/70 focus:ring-sky-500"
                    }`}
                  >
                    <Edit2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => onDeleteTrip(trip.id)}
                    title="Delete Trip"
                    aria-label={`Delete ${trip.city} trip`}
                    className={`cursor-pointer p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                      isSelected
                        ? "hover:bg-white/20 focus:ring-white/50"
                        : darkMode
                          ? "hover:bg-gray-600/50 focus:ring-red-400"
                          : "hover:bg-gray-200/70 focus:ring-red-500"
                    } ${darkMode ? "text-red-400 hover:text-red-300" : "text-red-500 hover:text-red-600"}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
});

ContinentItem.propTypes = {
  /** Continent name */
  continent: PropTypes.string.isRequired,
  /** Array of trips in this continent */
  trips: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      city: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
      isWishlist: PropTypes.bool,
    }),
  ).isRequired,
  /** Currently selected trip ID */
  currentTripId: PropTypes.number,
  /** Callback when a trip is selected */
  onSelectTrip: PropTypes.func.isRequired,
  /** Dark mode toggle */
  darkMode: PropTypes.bool,
  /** Color for this continent */
  continentColor: PropTypes.string.isRequired,
  /** Map of country names to flag URLs */
  countryFlags: PropTypes.object,
  /** Callback when edit is clicked */
  onEditTrip: PropTypes.func,
  /** Callback when delete is clicked */
  onDeleteTrip: PropTypes.func,
};

ContinentItem.defaultProps = {
  currentTripId: null,
  darkMode: false,
  countryFlags: {},
  onEditTrip: () => {},
  onDeleteTrip: () => {},
};

export default ContinentItem;
