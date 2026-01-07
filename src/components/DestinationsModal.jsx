import { useState } from "react";
import { MapPin, Search, X } from "lucide-react";
import CustomDropdown from "./CustomDropdown";
import ContinentItem from "./ContinentItem";

/**
 * DestinationsModal Component
 * 
 * A modal that displays all trips grouped by continent with search and sort functionality.
 * 
 * @param {boolean} isOpen - Whether the modal is open
 * @param {Function} onClose - Handler to close the modal
 * @param {Array} allTrips - Array of all trip objects
 * @param {number} currentTripId - Currently selected trip ID
 * @param {Function} onSelectTrip - Handler to select a trip
 * @param {boolean} darkMode - Dark mode toggle
 * @param {Object} continentColors - Map of continent names to colors (passed from parent)
 * @param {Object} countryFlags - Map of country names to flag URLs (passed from parent)
 * @param {Function} onEditTrip - Handler for editing a trip
 * @param {Function} onDeleteTrip - Handler for deleting a trip
 */
const DestinationsModal = ({
  isOpen,
  onClose,
  allTrips,
  currentTripId,
  onSelectTrip,
  darkMode,
  continentColors = {},
  countryFlags = {},
  onEditTrip,
  onDeleteTrip,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("date-desc");

  const filteredAndSortedTrips = allTrips
    .filter((trip) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        searchLower === "" ||
        trip.city.toLowerCase().includes(searchLower) ||
        trip.country.toLowerCase().includes(searchLower) ||
        trip.continent.toLowerCase().includes(searchLower) ||
        trip.description.toLowerCase().includes(searchLower) ||
        trip.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "rating-desc":
          return b.rating - a.rating;
        case "rating-asc":
          return a.rating - b.rating;
        case "city-asc":
          return a.city.localeCompare(b.city);
        case "city-desc":
          return b.city.localeCompare(a.city);
        default:
          return 0;
      }
    });

  const tripsByContinent = filteredAndSortedTrips.reduce((acc, trip) => {
    if (!acc[trip.continent]) {
      acc[trip.continent] = [];
    }
    acc[trip.continent].push(trip);
    return acc;
  }, {});

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-lg bg-black/60 transition-opacity duration-300 animate-opacityIn">
      <div
        className={`${darkMode
          ? "bg-gray-800/90 border-gray-700/80"
          : "bg-white/95 border-gray-200/80"
          } max-w-2xl w-full mx-auto rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 border-2 animate-scaleIn flex flex-col`}
        style={{ maxHeight: "calc(100vh - 4rem)" }}
      >
        {/* Header */}
        <div
          className={`flex justify-between items-center p-5 border-b ${darkMode ? "border-gray-700" : "border-gray-200"
            }`}
        >
          <h2
            className={`text-2xl font-bold font-playfair ${darkMode ? "text-gray-100" : "text-gray-800"
              }`}
          >
            Explore Destinations
          </h2>
          <button
            onClick={onClose}
            aria-label="Close destinations modal"
            className={`cursor-pointer p-2 rounded-full transition-all duration-300 ${darkMode
              ? "hover:bg-gray-700/80 text-gray-300 hover:text-white"
              : "hover:bg-gray-200/80 text-gray-600 hover:text-gray-900"
              }`}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Search and Sort */}
        <div className="p-5 flex flex-col sm:flex-row gap-3 items-center border-b dark:border-gray-700 border-gray-200">
          <div className="relative flex-grow w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
            </div>
            <input
              type="text"
              placeholder="Search destinations..."
              aria-label="Search destinations"
              className={`w-full py-2.5 pl-10 pr-4 rounded-xl border-2 outline-none ${darkMode
                ? "bg-gray-800/80 border-gray-600 text-white placeholder-gray-400 hover:border-sky-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40"
                : "bg-white border-gray-200 text-gray-800 placeholder-gray-500 hover:border-sky-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
                } shadow-sm transition-all duration-300 text-sm`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-auto sm:min-w-[200px]">
            <CustomDropdown
              options={[
                { value: "date-desc", label: "Date (Newest First)" },
                { value: "date-asc", label: "Date (Oldest First)" },
                { value: "rating-desc", label: "Rating (High to Low)" },
                { value: "rating-asc", label: "Rating (Low to High)" },
                { value: "city-asc", label: "City (A-Z)" },
                { value: "city-desc", label: "City (Z-A)" },
              ]}
              value={sortOption}
              onChange={setSortOption}
              darkMode={darkMode}
              ariaLabel="Sort destinations by"
            />
          </div>
        </div>

        {/* Trip List */}
        <div className="p-5 overflow-y-auto styled-scrollbar flex-grow">
          {Object.keys(tripsByContinent).length > 0 ? (
            <div className="space-y-5">
              {Object.entries(tripsByContinent).map(([continent, continentTrips]) => (
                <ContinentItem
                  key={continent}
                  continent={continent}
                  trips={continentTrips}
                  currentTripId={currentTripId}
                  onSelectTrip={(id) => {
                    onSelectTrip(id);
                    onClose();
                  }}
                  darkMode={darkMode}
                  continentColor={continentColors[continent] || "#6366f1"} // Fallback to indigo
                  countryFlags={countryFlags}
                  onEditTrip={onEditTrip}
                  onDeleteTrip={onDeleteTrip}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div
                className={`p-4 rounded-full mb-4 ${darkMode ? "bg-gray-700/50" : "bg-gray-100"}`}
              >
                <MapPin
                  className={`h-12 w-12 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                />
              </div>
              <p
                className={`${darkMode ? "text-gray-200" : "text-gray-800"
                  } text-xl font-semibold`}
              >
                No Destinations Found
              </p>
              <p
                className={`${darkMode ? "text-gray-400" : "text-gray-500"
                  } text-base mt-2`}
              >
                {searchQuery
                  ? "Try adjusting your search or filter criteria."
                  : "Add some trips to see them here!"}
              </p>
              {searchQuery && (
                <button
                  className={`cursor-pointer mt-6 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${darkMode
                    ? "bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white"
                    : "bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white"
                    } shadow-md hover:shadow-lg hover:scale-[1.02]`}
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DestinationsModal;

