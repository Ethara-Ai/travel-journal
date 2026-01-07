import { useState, useRef, useCallback } from "react";
import { X, UploadCloud, PlusCircle, Loader2 } from "lucide-react";
import RatingStars from "./RatingStars";
import CustomDropdown from "./CustomDropdown";
import { compressImage, validateImageFile, formatBytes, getBase64Size } from "../utils/imageUtils";

const currentYear = new Date().getFullYear();

/**
 * TripFormModal Component
 *
 * A modal form for adding or editing trip details.
 * Features image compression and proper form validation.
 *
 * @param {boolean} isOpen - Whether the modal is open
 * @param {Function} onClose - Handler to close the modal
 * @param {Function} onSaveTrip - Handler to save the trip data
 * @param {boolean} darkMode - Dark mode toggle
 * @param {Object} existingTrip - Existing trip data for editing (null for new trips)
 * @param {number} nextTripId - ID for the next new trip
 * @param {Object} continentCountryMap - Map of continents to countries (passed from parent)
 * @param {Object} continentColors - Map of continent names to colors (passed from parent)
 * @param {Array} months - Array of month names (passed from parent)
 * @param {Array} years - Array of years (passed from parent)
 */
const TripFormModal = ({
  isOpen,
  onClose,
  onSaveTrip,
  darkMode,
  existingTrip,
  nextTripId,
  continentCountryMap = {},
  continentColors = {},
  months = [],
  years = [],
}) => {
  if (!isOpen) return null;

  // Use key to force remount of inner form when existingTrip changes
  const formKey = existingTrip?.id ?? "new";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-lg bg-black/60 transition-opacity duration-300 animate-opacityIn">
      <TripFormInner
        key={formKey}
        onClose={onClose}
        onSaveTrip={onSaveTrip}
        darkMode={darkMode}
        existingTrip={existingTrip}
        nextTripId={nextTripId}
        continentCountryMap={continentCountryMap}
        continentColors={continentColors}
        months={months}
        years={years}
      />
    </div>
  );
};

/**
 * Inner form component that remounts when existingTrip changes
 * This avoids the need for useEffect to sync state
 */
const TripFormInner = ({
  onClose,
  onSaveTrip,
  darkMode,
  existingTrip,
  nextTripId,
  continentCountryMap,
  continentColors,
  months,
  years,
}) => {
  const defaultContinent = Object.keys(continentCountryMap)[0] || "";
  const initialContinent = existingTrip?.continent || defaultContinent;
  const initialCountry = existingTrip?.country || continentCountryMap[defaultContinent]?.[0]?.name || "";

  const initialDateParts = (existingTrip?.date || `${months[new Date().getMonth()]} ${currentYear}`).split(" ");

  const [continent, setContinent] = useState(initialContinent);
  const [country, setCountry] = useState(initialCountry);
  const [city, setCity] = useState(existingTrip?.city || "");
  const [selectedMonth, setSelectedMonth] = useState(initialDateParts[0]);
  const [selectedYear, setSelectedYear] = useState(parseInt(initialDateParts[1]) || currentYear);
  const [rating, setRating] = useState(existingTrip?.rating || 0);
  const [description, setDescription] = useState(existingTrip?.description || "");
  const [highlights, setHighlights] = useState(existingTrip?.highlights?.join("\n") || "");
  const [lowlights, setLowlights] = useState(existingTrip?.lowlights?.join("\n") || "");
  const [imagePreview, setImagePreview] = useState(existingTrip?.image || null);
  const [imageBase64, setImageBase64] = useState(existingTrip?.image || null);
  const [imageAlt, setImageAlt] = useState(existingTrip?.imageAlt || "");
  const [notes, setNotes] = useState(existingTrip?.notes || "");
  const [expenses, setExpenses] = useState(existingTrip?.expenses || "");
  const [tags, setTags] = useState(existingTrip?.tags?.join(", ") || "");
  const [isWishlist, setIsWishlist] = useState(existingTrip?.isWishlist || false);
  const [errors, setErrors] = useState({});
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState(null);

  const fileInputRef = useRef(null);

  /**
   * Handle image file selection with compression
   */
  const handleImageChange = useCallback(async (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;

    // Validate file first
    const validation = validateImageFile(file, { maxFileSizeMB: 10 });
    if (!validation.isValid) {
      setErrors((prev) => ({ ...prev, imageFile: validation.error }));
      return;
    }

    // Clear any previous image errors
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.imageFile;
      return newErrors;
    });

    setIsCompressing(true);
    setCompressionInfo(null);

    try {
      const originalSize = file.size;

      // Compress the image
      const compressedBase64 = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 0.8,
        mimeType: "image/jpeg",
      });

      const compressedSize = getBase64Size(compressedBase64);
      const savings = originalSize - compressedSize;
      const savingsPercent = Math.round((savings / originalSize) * 100);

      setImagePreview(compressedBase64);
      setImageBase64(compressedBase64);
      setCompressionInfo({
        originalSize: formatBytes(originalSize),
        compressedSize: formatBytes(compressedSize),
        savings: savingsPercent > 0 ? `${savingsPercent}% smaller` : "No compression needed",
      });
    } catch (error) {
      console.error("Image compression failed:", error);
      setErrors((prev) => ({ ...prev, imageFile: "Failed to process image. Please try another." }));
    } finally {
      setIsCompressing(false);
    }
  }, []);

  /**
   * Remove selected image
   */
  const removeImage = useCallback(() => {
    setImagePreview(null);
    setImageBase64(null);
    setCompressionInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  /**
   * Handle continent change and auto-select first country
   */
  const handleContinentChange = useCallback(
    (newContinent) => {
      setContinent(newContinent);
      const countriesInContinent = continentCountryMap[newContinent] || [];
      if (countriesInContinent.length > 0) {
        setCountry(countriesInContinent[0].name);
      } else {
        setCountry("");
      }
    },
    [continentCountryMap],
  );

  /**
   * Validate form and return validation result
   * Returns the errors object directly instead of relying on state
   */
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!continent) newErrors.continent = "Continent is required.";
    if (!country) newErrors.country = "Country is required.";
    if (!city.trim()) newErrors.city = "City is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (rating === 0) newErrors.rating = "Rating must be at least 1 star.";
    if (!highlights.trim()) newErrors.highlights = "Highlights are required.";
    if (!notes.trim()) newErrors.notes = "Travel notes are required.";
    if (!expenses.trim()) newErrors.expenses = "Expenses/budget is required.";
    if (!imageBase64 && !existingTrip?.image) newErrors.imageFile = "Trip image is required.";

    setErrors(newErrors);

    // Return the errors object directly for immediate use
    return newErrors;
  }, [continent, country, city, description, rating, highlights, notes, expenses, imageBase64, existingTrip?.image]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      // Validate and get errors directly (not from state)
      const validationErrors = validateForm();
      const isValid = Object.keys(validationErrors).length === 0;

      if (!isValid) {
        // Use the returned errors, not the state
        const firstErrorKey = Object.keys(validationErrors)[0];
        if (firstErrorKey) {
          const errorElement = document.getElementById(firstErrorKey);
          errorElement?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      const tripData = {
        id: existingTrip?.id || nextTripId,
        continent,
        country,
        city,
        date: `${selectedMonth} ${selectedYear}`,
        rating,
        description,
        highlights: highlights
          .split("\n")
          .map((h) => h.trim())
          .filter(Boolean),
        lowlights: lowlights
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean),
        image: imageBase64 || existingTrip?.image || `https://source.unsplash.com/800x600/?${city},${country}`,
        imageAlt: imageAlt.trim() || `Image of ${city}, ${country}`,
        color: continentColors[continent] || "#6366f1",
        notes,
        expenses,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        isWishlist,
      };

      onSaveTrip(tripData);
    },
    [
      validateForm,
      existingTrip,
      nextTripId,
      continent,
      country,
      city,
      selectedMonth,
      selectedYear,
      rating,
      description,
      highlights,
      lowlights,
      imageBase64,
      imageAlt,
      continentColors,
      notes,
      expenses,
      tags,
      isWishlist,
      onSaveTrip,
    ],
  );

  // Styling classes
  const inputBaseClass = `w-full p-2.5 rounded-xl border-2 transition-all duration-300 text-sm outline-none`;
  const inputNormalClass = (fieldName) =>
    `${inputBaseClass} ${
      darkMode ? "bg-gray-800/80 placeholder-gray-400 text-white" : "bg-white placeholder-gray-500 text-gray-900"
    } ${
      errors[fieldName]
        ? darkMode
          ? "border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-400/50"
          : "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
        : darkMode
          ? "border-gray-600 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50"
          : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
    }`;
  const labelClass = (required = false) =>
    `block text-xs font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"} ${
      required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ""
    }`;
  const errorTextClass = `text-xs mt-1 ${darkMode ? "text-red-400" : "text-red-500"}`;

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800/90 border-gray-700/80" : "bg-white/95 border-gray-200/80"
      } max-w-xl w-full mx-auto rounded-2xl shadow-2xl transform transition-all duration-300 border-2 animate-scaleIn flex flex-col`}
      style={{ maxHeight: "calc(100vh - 4rem)" }}
    >
      {/* Header */}
      <div
        className={`flex justify-between items-center p-5 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
      >
        <h2 className={`text-xl font-bold font-playfair ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
          {existingTrip ? "Edit Trip" : "Add New Trip"}
        </h2>
        <button
          onClick={onClose}
          aria-label="Close form"
          className={`cursor-pointer p-2 rounded-full transition-all duration-300 ${
            darkMode ? "hover:bg-gray-700/80 text-gray-300" : "hover:bg-gray-200/80 text-gray-700"
          }`}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto styled-scrollbar flex-grow" noValidate>
        {/* Continent & Country */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="continent" className={labelClass(true)}>
              Continent
            </label>
            <CustomDropdown
              id="continent"
              options={Object.keys(continentCountryMap).map((cont) => ({
                value: cont,
                label: cont,
              }))}
              value={continent}
              onChange={handleContinentChange}
              darkMode={darkMode}
              error={!!errors.continent}
              ariaLabel="Select continent"
            />
            {errors.continent && <p className={errorTextClass}>{errors.continent}</p>}
          </div>
          <div>
            <label htmlFor="country" className={labelClass(true)}>
              Country
            </label>
            <CustomDropdown
              id="country"
              options={(continentCountryMap[continent] || []).map((c) => ({
                value: c.name,
                label: c.name,
              }))}
              value={country}
              onChange={setCountry}
              darkMode={darkMode}
              error={!!errors.country}
              disabled={(continentCountryMap[continent] || []).length === 0}
              placeholder="Select a country"
              ariaLabel="Select country"
            />
            {errors.country && <p className={errorTextClass}>{errors.country}</p>}
          </div>
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className={labelClass(true)}>
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className={inputNormalClass("city")}
          />
          {errors.city && <p className={errorTextClass}>{errors.city}</p>}
        </div>

        {/* Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="month" className={labelClass()}>
              Month
            </label>
            <CustomDropdown
              id="month"
              options={months.map((m) => ({
                value: m,
                label: m,
              }))}
              value={selectedMonth}
              onChange={setSelectedMonth}
              darkMode={darkMode}
              ariaLabel="Select month"
            />
          </div>
          <div>
            <label htmlFor="year" className={labelClass()}>
              Year
            </label>
            <CustomDropdown
              id="year"
              options={years.map((y) => ({
                value: y,
                label: y.toString(),
              }))}
              value={selectedYear}
              onChange={setSelectedYear}
              darkMode={darkMode}
              ariaLabel="Select year"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className={labelClass(true)}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your trip..."
            rows="3"
            className={`${inputNormalClass("description")} resize-none`}
          />
          {errors.description && <p className={errorTextClass}>{errors.description}</p>}
        </div>

        {/* Image Upload */}
        <div>
          <label className={labelClass(true)}>Trip Image</label>
          <label
            htmlFor="imageUpload"
            className={`mt-1 flex flex-col justify-center items-center px-6 py-5 border-2 ${
              darkMode ? "border-gray-600 hover:border-gray-500" : "border-gray-300 hover:border-gray-400"
            } ${errors.imageFile ? (darkMode ? "border-red-500" : "border-red-400") : ""} border-dashed rounded-md ${
              isCompressing ? "cursor-wait opacity-70" : "cursor-pointer"
            } transition-colors duration-200`}
          >
            {isCompressing ? (
              <>
                <Loader2 className={`mx-auto h-8 w-8 ${darkMode ? "text-blue-400" : "text-blue-500"} animate-spin`} />
                <p className={`text-xs mt-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Compressing image...</p>
              </>
            ) : (
              <>
                <UploadCloud className={`mx-auto h-8 w-8 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                <div className={`flex text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  <span
                    className={`font-medium ${
                      darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"
                    }`}
                  >
                    Upload a file
                  </span>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                  PNG, JPG, GIF up to 10MB (auto-compressed)
                </p>
              </>
            )}
            <input
              id="imageUpload"
              name="imageUpload"
              type="file"
              accept="image/png, image/jpeg, image/gif, image/webp"
              className="sr-only"
              ref={fileInputRef}
              onChange={handleImageChange}
              disabled={isCompressing}
            />
          </label>
          {errors.imageFile && <p className={errorTextClass}>{errors.imageFile}</p>}
          {compressionInfo && (
            <p className={`text-xs mt-1 ${darkMode ? "text-green-400" : "text-green-600"}`}>
              ✓ Compressed: {compressionInfo.originalSize} → {compressionInfo.compressedSize} ({compressionInfo.savings}
              )
            </p>
          )}
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={removeImage}
              className="cursor-pointer absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Image Alt Text */}
        <div>
          <label htmlFor="imageAlt" className={labelClass()}>
            Image Alt Text
          </label>
          <input
            type="text"
            id="imageAlt"
            name="imageAlt"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            placeholder="Describe the image for accessibility"
            className={inputNormalClass("imageAlt")}
          />
        </div>

        {/* Rating */}
        <div>
          <label className={labelClass(true)}>Rating (1-5)</label>
          <div
            className={`flex space-x-1 p-1 rounded-md ${
              errors.rating ? (darkMode ? "ring-1 ring-red-500" : "ring-1 ring-red-400") : ""
            }`}
          >
            <RatingStars rating={rating} darkMode={darkMode} onRate={setRating} interactive size="h-6 w-6" />
          </div>
          {errors.rating && <p className={errorTextClass}>{errors.rating}</p>}
        </div>

        {/* Highlights */}
        <div>
          <label htmlFor="highlights" className={labelClass(true)}>
            Highlights (one per line)
          </label>
          <textarea
            id="highlights"
            name="highlights"
            value={highlights}
            onChange={(e) => setHighlights(e.target.value)}
            placeholder="Enter highlights, one per line..."
            rows="3"
            className={`${inputNormalClass("highlights")} resize-none`}
          />
          {errors.highlights && <p className={errorTextClass}>{errors.highlights}</p>}
        </div>

        {/* Lowlights */}
        <div>
          <label htmlFor="lowlights" className={labelClass()}>
            Lowlights (one per line)
          </label>
          <textarea
            id="lowlights"
            name="lowlights"
            value={lowlights}
            onChange={(e) => setLowlights(e.target.value)}
            placeholder="Enter lowlights, one per line..."
            rows="2"
            className={`${inputNormalClass("lowlights")} resize-none`}
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className={labelClass(true)}>
            Travel Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes about your trip..."
            rows="3"
            className={`${inputNormalClass("notes")} resize-none`}
          />
          {errors.notes && <p className={errorTextClass}>{errors.notes}</p>}
        </div>

        {/* Expenses */}
        <div>
          <label htmlFor="expenses" className={labelClass(true)}>
            Expenses / Budget
          </label>
          <input
            type="text"
            id="expenses"
            name="expenses"
            value={expenses}
            onChange={(e) => setExpenses(e.target.value)}
            placeholder="e.g., $500, €300"
            className={inputNormalClass("expenses")}
          />
          {errors.expenses && <p className={errorTextClass}>{errors.expenses}</p>}
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className={labelClass()}>
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., beach, adventure, food"
            className={inputNormalClass("tags")}
          />
        </div>

        {/* Wishlist Toggle */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isWishlist"
            name="isWishlist"
            checked={isWishlist}
            onChange={(e) => setIsWishlist(e.target.checked)}
            className={`h-4 w-4 rounded ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-400"
                : "bg-white border-gray-300 text-blue-600 focus:ring-blue-500"
            }`}
          />
          <label htmlFor="isWishlist" className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Add to Wishlist (future trip)
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isCompressing}
            className={`cursor-pointer w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg ${
              darkMode
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white"
                : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
            } transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          >
            <PlusCircle className="h-5 w-5" />
            <span>{existingTrip ? "Save Changes" : "Add Trip"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default TripFormModal;
