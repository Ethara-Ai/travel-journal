import { useState, memo } from "react";
import PropTypes from "prop-types";
import {
  Calendar,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Banknote,
  Edit2,
  Trash2,
  Heart,
  CheckCircle,
  AlertTriangle,
  ImageOff,
} from "lucide-react";
import RatingStars from "./RatingStars";
import InfoCard from "./InfoCard";

/**
 * TripCard Component
 *
 * Displays a single trip in a card format with image carousel, details, and actions.
 * Memoized to prevent unnecessary re-renders when parent state changes.
 *
 * @param {Object} trip - The trip data object
 * @param {number} index - Current index in the trips array
 * @param {number} totalTrips - Total number of trips
 * @param {boolean} darkMode - Dark mode toggle
 * @param {Object} continentColors - Map of continent names to colors (passed from parent)
 * @param {Object} countryFlags - Map of country names to flag URLs (passed from parent)
 * @param {Function} onPrev - Handler for previous trip navigation
 * @param {Function} onNext - Handler for next trip navigation
 * @param {Function} onEdit - Handler for editing a trip
 * @param {Function} onDelete - Handler for deleting a trip
 */
const TripCard = memo(function TripCard({
  trip,
  index,
  totalTrips,
  darkMode,
  continentColors = {},
  countryFlags = {},
  onPrev,
  onNext,
  onEdit,
  onDelete,
}) {
  const tripColor = continentColors[trip.continent] || "#6366f1"; // Fallback to indigo
  const flagUrl = countryFlags[trip.country];
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`relative w-full lg:min-w-5xl xl:min-w-6xl ${
        darkMode ? "bg-gray-800/80 border-gray-700/70" : "bg-white/90 border-gray-200/80"
      } backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 border-2 hover:shadow-3xl group isolate`}
    >
      {/* Hero Image Section - Fixed height with aspect ratio fallback for consistent sizing */}
      <div className="relative h-[300px] sm:h-[350px] md:h-[420px] lg:h-[480px] w-full flex-shrink-0 overflow-hidden rounded-t-3xl">
        <div className="absolute inset-0 overflow-hidden rounded-t-3xl bg-gray-200 dark:bg-gray-700">
          {imageError || !trip.image ? (
            <div
              className={`w-full h-full flex items-center justify-center ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
            >
              <ImageOff className={`w-24 h-24 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
            </div>
          ) : (
            <img
              src={trip.image}
              alt={trip.imageAlt}
              onError={() => setImageError(true)}
              loading="eager"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
            />
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* Wishlist Badge */}
        {trip.isWishlist && (
          <div
            title="Wishlist Trip"
            className={`absolute top-5 left-5 ${
              darkMode ? "bg-pink-600/90 text-white" : "bg-pink-500/90 text-white"
            } backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-semibold shadow-lg flex items-center space-x-1.5 z-10`}
          >
            <Heart className="h-4 w-4 fill-current" />
            <span>Wishlist</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-5 right-5 flex gap-2 z-20">
          <button
            onClick={() => onEdit(trip)}
            title="Edit Trip"
            aria-label="Edit trip"
            className={`cursor-pointer p-2.5 rounded-full backdrop-blur-lg shadow-lg transform transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ring-1 ${
              darkMode
                ? "bg-gray-800/70 text-gray-100 hover:bg-gray-700 ring-gray-600 focus:ring-sky-400"
                : "bg-white/80 text-gray-700 hover:bg-gray-50 ring-gray-300 focus:ring-sky-500"
            }`}
          >
            <Edit2 className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(trip.id)}
            title="Delete Trip"
            aria-label="Delete trip"
            className={`cursor-pointer p-2.5 rounded-full backdrop-blur-lg shadow-lg transform transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ring-1 ${
              darkMode
                ? "bg-red-900/50 text-red-300 hover:bg-red-700/70 hover:text-red-100 ring-red-700/80 focus:ring-red-400"
                : "bg-red-100/80 text-red-600 hover:bg-red-200/90 hover:text-red-700 ring-red-300/90 focus:ring-red-500"
            }`}
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute top-1/2 left-0 right-0 flex justify-between px-3 transform -translate-y-1/2 z-10">
          <button
            onClick={onPrev}
            disabled={totalTrips <= 1}
            aria-label="Previous trip"
            className={`cursor-pointer p-3 rounded-full ${
              darkMode
                ? "bg-gray-900/70 text-gray-100 hover:bg-gray-800/90"
                : "bg-white/80 text-gray-800 hover:bg-white"
            } backdrop-blur-lg shadow-xl transform transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 ring-2 ${
              darkMode ? "ring-gray-700 focus:ring-sky-400" : "ring-gray-300 focus:ring-sky-500"
            } disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100`}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={onNext}
            disabled={totalTrips <= 1}
            aria-label="Next trip"
            className={`cursor-pointer p-3 rounded-full ${
              darkMode
                ? "bg-gray-900/70 text-gray-100 hover:bg-gray-800/90"
                : "bg-white/80 text-gray-800 hover:bg-white"
            } backdrop-blur-lg shadow-xl transform transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 ring-2 ${
              darkMode ? "ring-gray-700 focus:ring-sky-400" : "ring-gray-300 focus:ring-sky-500"
            } disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100`}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Title and Rating Overlay */}
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 md:bottom-6 md:left-6 md:right-6 z-10">
          <div className="flex items-end justify-between gap-2 sm:gap-3">
            <div className="min-w-0 overflow-hidden flex-1 mr-1">
              <h2
                className="font-playfair font-bold text-white shadow-2xl leading-tight break-words text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
                style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}
              >
                {trip.city}
              </h2>
              <div className="flex items-center mt-1 sm:mt-1.5">
                {flagUrl && (
                  <img
                    src={flagUrl}
                    alt={`${trip.country} flag`}
                    className="h-4 sm:h-5 md:h-6 w-auto rounded-sm shadow-md mr-1.5 sm:mr-2 border border-white/30"
                  />
                )}
                <p
                  className="font-medium text-gray-200 truncate text-xs sm:text-sm md:text-base"
                  style={{ textShadow: "0 1px 5px rgba(0,0,0,0.7)" }}
                >
                  {trip.country}
                </p>
              </div>
            </div>

            {/* Rating Badge */}
            <div
              className={`backdrop-blur-md rounded-lg sm:rounded-xl shadow-md sm:shadow-lg flex items-center border flex-shrink-0 px-1.5 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 space-x-1 sm:space-x-1.5 ${
                darkMode ? "bg-gray-900/60 border-gray-700 text-gray-100" : "bg-white/70 border-gray-300 text-gray-800"
              }`}
            >
              <RatingStars rating={trip.rating} darkMode={darkMode} size="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              <span className={`font-bold text-xs sm:text-sm ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                {trip.rating.toFixed(1)}/5
              </span>
            </div>
          </div>

          {/* Pagination Dots */}
          {totalTrips > 1 && (
            <div className="flex space-x-1 sm:space-x-1.5 mt-2.5 sm:mt-3 md:mt-4 justify-center">
              {[...Array(totalTrips)].map((_, i) => (
                <button
                  key={i}
                  onClick={i < index ? onPrev : i > index ? onNext : undefined}
                  aria-label={`Go to trip ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  className={`cursor-pointer rounded-full transition-all duration-500 ease-out focus:outline-none h-1.5 w-1.5 sm:h-2 sm:w-2 ${
                    i === index ? "w-3 sm:w-4 bg-white shadow-sm" : "bg-white/60 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 md:p-8">
        {/* Date and Tags */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <div
            className={`flex items-center text-sm font-medium ${
              darkMode
                ? "text-gray-300 bg-gray-700/60 border-gray-600/80"
                : "text-gray-600 bg-gray-100/80 border-gray-200/90"
            } px-4 py-2.5 rounded-full shadow-sm border transition-all duration-300 hover:shadow-md`}
          >
            <Calendar className="h-5 w-5 mr-2.5 opacity-80" aria-hidden="true" />
            <span>{trip.date}</span>
          </div>
          {trip.tags && trip.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center" role="list" aria-label="Trip tags">
              {trip.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  role="listitem"
                  className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                    darkMode
                      ? "bg-gray-700/50 border-gray-600 text-gray-300"
                      : "bg-gray-100 border-gray-300 text-gray-600"
                  }`}
                  style={{ borderColor: `${tripColor}80` }}
                >
                  #{tag}
                </span>
              ))}
              {trip.tags.length > 3 && <span className="text-xs text-gray-500">+{trip.tags.length - 3} more</span>}
            </div>
          )}
        </div>

        {/* Description */}
        <p
          className={`${
            darkMode ? "text-gray-300" : "text-gray-700"
          } mb-8 leading-relaxed text-base md:text-lg transition-colors duration-300`}
        >
          {trip.description}
        </p>

        {/* Highlights and Considerations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Highlights */}
          <div
            className={`border-2 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
              darkMode
                ? "border-emerald-800/60 bg-gradient-to-br from-emerald-900/30 to-gray-800/60"
                : "border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 to-white"
            } backdrop-blur-sm`}
          >
            <h3
              className={`text-xl font-semibold ${
                darkMode ? "text-gray-100" : "text-gray-800"
              } mb-4 flex items-center transition-colors duration-300`}
            >
              <div
                className={`p-2.5 rounded-full ${
                  darkMode ? "bg-emerald-900/50" : "bg-emerald-100"
                } mr-3 transition-colors duration-300 shadow-inner`}
              >
                <CheckCircle
                  className={`h-6 w-6 ${
                    darkMode ? "text-emerald-300" : "text-emerald-500"
                  } transition-colors duration-300`}
                  aria-hidden="true"
                />
              </div>
              Highlights
            </h3>
            <ul className="space-y-2.5" aria-label="Trip highlights">
              {trip.highlights.map((highlight, idx) => (
                <li
                  key={idx}
                  className={`${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  } flex items-start transition-all duration-200 text-base hover:translate-x-1`}
                >
                  <div
                    className="mr-3 mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: "#10b981" }}
                    aria-hidden="true"
                  ></div>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Considerations */}
          <div
            className={`border-2 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
              darkMode
                ? "border-rose-800/60 bg-gradient-to-br from-rose-900/30 to-gray-800/60"
                : "border-rose-200/80 bg-gradient-to-br from-rose-50/70 to-white"
            } backdrop-blur-sm`}
          >
            <h3
              className={`text-xl font-semibold ${
                darkMode ? "text-gray-100" : "text-gray-800"
              } mb-4 flex items-center transition-colors duration-300`}
            >
              <div
                className={`p-2.5 rounded-full ${
                  darkMode ? "bg-rose-900/50" : "bg-rose-100"
                } mr-3 transition-colors duration-300 shadow-inner`}
              >
                <AlertTriangle
                  className={`h-6 w-6 ${darkMode ? "text-rose-300" : "text-rose-500"} transition-colors duration-300`}
                  aria-hidden="true"
                />
              </div>
              Considerations
            </h3>
            <ul className="space-y-2.5" aria-label="Trip considerations">
              {trip.lowlights.map((lowlight, idx) => (
                <li
                  key={idx}
                  className={`${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  } flex items-start transition-all duration-200 text-base hover:translate-x-1`}
                >
                  <div className="mr-3 mt-1.5 w-2 h-2 bg-rose-400 rounded-full flex-shrink-0" aria-hidden="true"></div>
                  <span>{lowlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InfoCard icon={BookOpen} title="Travel Notes" value={trip.notes} darkMode={darkMode} color={tripColor} />
          <InfoCard
            icon={Banknote}
            title="Budget / Expenses"
            value={trip.expenses}
            darkMode={darkMode}
            color={tripColor}
          />
        </div>
      </div>
    </div>
  );
});

TripCard.propTypes = {
  /** The trip data object */
  trip: PropTypes.shape({
    id: PropTypes.number.isRequired,
    city: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    continent: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    highlights: PropTypes.arrayOf(PropTypes.string).isRequired,
    lowlights: PropTypes.arrayOf(PropTypes.string).isRequired,
    image: PropTypes.string,
    imageAlt: PropTypes.string,
    notes: PropTypes.string,
    expenses: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    isWishlist: PropTypes.bool,
  }).isRequired,
  /** Current index in the trips array */
  index: PropTypes.number.isRequired,
  /** Total number of trips */
  totalTrips: PropTypes.number.isRequired,
  /** Dark mode toggle */
  darkMode: PropTypes.bool,
  /** Map of continent names to colors */
  continentColors: PropTypes.object,
  /** Map of country names to flag URLs */
  countryFlags: PropTypes.object,
  /** Handler for previous trip navigation */
  onPrev: PropTypes.func.isRequired,
  /** Handler for next trip navigation */
  onNext: PropTypes.func.isRequired,
  /** Handler for editing a trip */
  onEdit: PropTypes.func.isRequired,
  /** Handler for deleting a trip */
  onDelete: PropTypes.func.isRequired,
};

TripCard.defaultProps = {
  darkMode: false,
  continentColors: {},
  countryFlags: {},
};

export default TripCard;
