import { useState } from "react";
import { ChevronRight, Edit2, Trash2, BookMarked } from "lucide-react";
import { hexToRgba } from "../utils/colorUtils";

/**
 * ContinentItem - Displays a collapsible list of trips for a continent
 * 
 * @param {string} continent - Continent name
 * @param {Array} trips - Array of trips in this continent
 * @param {number} currentTripId - Currently selected trip ID
 * @param {function} onSelectTrip - Callback when a trip is selected
 * @param {boolean} darkMode - Theme mode
 * @param {string} continentColor - Color for this continent
 * @param {function} countryFlags - Map of country to flag URLs
 * @param {function} onEditTrip - Callback when edit is clicked
 * @param {function} onDeleteTrip - Callback when delete is clicked
 */
const ContinentItem = ({
  continent,
  trips,
  currentTripId,
  onSelectTrip,
  darkMode,
  continentColor,
  countryFlags = {},
  onEditTrip,
  onDeleteTrip,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-4 last:mb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className={`cursor-pointer flex items-center justify-between w-full py-3 px-4 group transition-all duration-300 rounded-xl ${
          darkMode
            ? "hover:bg-gray-700/60 active:bg-gray-700/80"
            : "hover:bg-gray-100/80 active:bg-gray-200/60"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0 transition-all duration-300 shadow-md"
            style={{
              backgroundColor: continentColor,
              boxShadow: `0 0 0 2px ${
                darkMode ? "rgba(17, 24, 39, 0.7)" : "rgba(255, 255, 255, 0.7)"
              }, 0 0 0 3px ${hexToRgba(continentColor, 0.3)}, 0 1px 3px ${hexToRgba(
                continentColor,
                0.5
              )}`,
            }}
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
        >
          <ChevronRight className="h-5 w-5" />
        </div>
      </button>

      {isOpen && (
        <ul
          className="space-y-1 pl-6 mt-2 border-l-2 ml-[9px] styled-scrollbar"
          style={{ borderColor: hexToRgba(continentColor, 0.3) }}
        >
          {trips.map((trip) => {
            const flagUrl = countryFlags[trip.country];
            const isSelected = currentTripId === trip.id;
            return (
              <li
                key={trip.id}
                className={`group/item flex items-center justify-between transition-all duration-200 rounded-lg ${
                  isSelected
                    ? `font-semibold py-2 pl-3 pr-2 -ml-[1px] shadow-lg`
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
                  className="cursor-pointer flex items-center space-x-3 flex-grow text-left"
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
                    {isSelected && (
                      <span className="ml-1.5 text-white/80 text-xs font-normal">(Viewing)</span>
                    )}
                    {trip.isWishlist && !isSelected && (
                      <BookMarked
                        className={`inline-block ml-1.5 h-3.5 w-3.5 ${
                          darkMode ? "text-pink-400" : "text-pink-500"
                        }`}
                      />
                    )}
                  </span>
                </button>
                <div className="flex items-center space-x-1 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => onEditTrip(trip)}
                    title="Edit Trip"
                    className={`cursor-pointer p-1.5 rounded-md ${
                      isSelected
                        ? "hover:bg-white/20"
                        : darkMode
                          ? "hover:bg-gray-600/50"
                          : "hover:bg-gray-200/70"
                    }`}
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteTrip(trip.id)}
                    title="Delete Trip"
                    className={`cursor-pointer p-1.5 rounded-md ${
                      isSelected
                        ? "hover:bg-white/20"
                        : darkMode
                          ? "hover:bg-gray-600/50"
                          : "hover:bg-gray-200/70"
                    } ${
                      darkMode
                        ? "text-red-400 hover:text-red-300"
                        : "text-red-500 hover:text-red-600"
                    }`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ContinentItem;

