import { useState, useEffect, useRef } from "react";
import { X, UploadCloud, PlusCircle } from "lucide-react";
import RatingStars from "./RatingStars";
import CustomDropdown from "./CustomDropdown";

const currentYear = new Date().getFullYear();

/**
 * TripFormModal Component
 * 
 * A modal form for adding or editing trip details.
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
  years = []
}) => {
  const defaultContinent = Object.keys(continentCountryMap)[0] || "";
  const [continent, setContinent] = useState(existingTrip?.continent || defaultContinent);
  const [country, setCountry] = useState(
    existingTrip?.country || continentCountryMap[defaultContinent]?.[0]?.name || ""
  );
  const [city, setCity] = useState(existingTrip?.city || "");

  const initialDateParts = (
    existingTrip?.date || `${months[new Date().getMonth()]} ${currentYear}`
  ).split(" ");
  const [selectedMonth, setSelectedMonth] = useState(initialDateParts[0]);
  const [selectedYear, setSelectedYear] = useState(parseInt(initialDateParts[1]) || currentYear);

  const [rating, setRating] = useState(existingTrip?.rating || 0);
  const [description, setDescription] = useState(existingTrip?.description || "");
  const [highlights, setHighlights] = useState(existingTrip?.highlights?.join("\n") || "");
  const [lowlights, setLowlights] = useState(existingTrip?.lowlights?.join("\n") || "");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(existingTrip?.image || null);
  const [imageBase64, setImageBase64] = useState(existingTrip?.image || null);

  const [imageAlt, setImageAlt] = useState(existingTrip?.imageAlt || "");
  const [notes, setNotes] = useState(existingTrip?.notes || "");
  const [expenses, setExpenses] = useState(existingTrip?.expenses || "");
  const [tags, setTags] = useState(existingTrip?.tags?.join(", ") || "");
  const [isWishlist, setIsWishlist] = useState(existingTrip?.isWishlist || false);

  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (existingTrip) {
      setContinent(existingTrip.continent);
      setCountry(existingTrip.country);
      setCity(existingTrip.city);
      const dateParts = existingTrip.date.split(" ");
      setSelectedMonth(dateParts[0]);
      setSelectedYear(parseInt(dateParts[1]));
      setRating(existingTrip.rating);
      setDescription(existingTrip.description);
      setHighlights(existingTrip.highlights.join("\n"));
      setLowlights(existingTrip.lowlights.join("\n"));
      setImagePreview(existingTrip.image);
      setImageBase64(existingTrip.image);
      setImageAlt(existingTrip.imageAlt);
      setNotes(existingTrip.notes);
      setExpenses(existingTrip.expenses);
      setTags(existingTrip.tags.join(", "));
      setIsWishlist(existingTrip.isWishlist);
      setImageFile(null);
    } else {
      const defaultNewContinent = Object.keys(continentCountryMap)[0] || "";
      setContinent(defaultNewContinent);
      setCountry(continentCountryMap[defaultNewContinent]?.[0]?.name || "");
      setCity("");
      setSelectedMonth(months[new Date().getMonth()] || "January");
      setSelectedYear(currentYear);
      setRating(0);
      setDescription("");
      setHighlights("");
      setLowlights("");
      setImageFile(null);
      setImagePreview(null);
      setImageBase64(null);
      setImageAlt("");
      setNotes("");
      setExpenses("");
      setTags("");
      setIsWishlist(false);
    }
  }, [existingTrip, isOpen, continentCountryMap, months]);

  const handleImageChange = (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    if (!existingTrip || continent !== existingTrip.continent) {
      const countriesInContinent = continentCountryMap[continent] || [];
      if (countriesInContinent.length > 0) {
        if (!countriesInContinent.find((c) => c.name === country)) {
          setCountry(countriesInContinent[0].name);
        }
      } else {
        setCountry("");
      }
    }
  }, [continent, country, existingTrip]);

  const validateForm = () => {
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
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const errorElement = document.getElementById(firstErrorKey);
        errorElement?.focus();
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
      highlights: highlights.split("\n").map((h) => h.trim()).filter(Boolean),
      lowlights: lowlights.split("\n").map((l) => l.trim()).filter(Boolean),
      image: imageBase64 || `https://source.unsplash.com/800x600/?${city},${country}`,
      imageAlt: imageAlt.trim() || `Image of ${city}, ${country}`,
      color: continentColors[continent] || "#6366f1", // Fallback to indigo
      notes,
      expenses,
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      isWishlist,
    };
    onSaveTrip(tripData);
    onClose();
  };

  if (!isOpen) return null;

  const inputBaseClass = `w-full p-2.5 rounded-xl border-2 transition-all duration-300 text-sm outline-none`;
  const inputNormalClass = (fieldName) =>
    `${inputBaseClass} ${
      darkMode
        ? "bg-gray-800/80 placeholder-gray-400 text-white"
        : "bg-white placeholder-gray-500 text-gray-900"
    } ${
      errors[fieldName]
        ? darkMode
          ? "border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/30"
          : "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-400/30"
        : darkMode
          ? "border-gray-600 hover:border-sky-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40"
          : "border-gray-200 hover:border-sky-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
    }`;
  const labelClass = (required = false) =>
    `block mb-1.5 text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}${
      required ? " after:content-['*'] after:ml-0.5 after:text-red-500" : ""
    }`;
  const errorTextClass = "text-xs text-red-500 mt-1";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-lg bg-black/60 transition-opacity duration-300 animate-opacityIn">
      <div
        className={`${
          darkMode
            ? "bg-gray-800/90 border-gray-700/80"
            : "bg-white/95 border-gray-200/80"
        } max-w-xl w-full mx-auto rounded-2xl shadow-2xl transform transition-all duration-300 border-2 animate-scaleIn flex flex-col`}
        style={{ maxHeight: "calc(100vh - 4rem)" }}
      >
        {/* Header */}
        <div
          className={`flex justify-between items-center p-5 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h2
            className={`text-xl font-bold font-playfair ${
              darkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            {existingTrip ? "Edit Trip" : "Add New Trip"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close form"
            className={`cursor-pointer p-2 rounded-full transition-all duration-300 ${
              darkMode
                ? "hover:bg-gray-700/80 text-gray-300"
                : "hover:bg-gray-200/80 text-gray-700"
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 overflow-y-auto styled-scrollbar flex-grow"
          noValidate
        >
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
                onChange={setContinent}
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

          {/* City & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className={labelClass(true)}>
                City
              </label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputNormalClass("city")}
                placeholder="e.g. Rome"
                required
              />
              {errors.city && <p className={errorTextClass}>{errors.city}</p>}
            </div>
            <div>
              <label className={labelClass(true)}>Date</label>
              <div className="flex gap-2">
                <CustomDropdown
                  options={months.map((month) => ({
                    value: month,
                    label: month,
                  }))}
                  value={selectedMonth}
                  onChange={setSelectedMonth}
                  darkMode={darkMode}
                  ariaLabel="Select month"
                  className="flex-1"
                />
                <CustomDropdown
                  options={years.map((year) => ({
                    value: year,
                    label: year.toString(),
                  }))}
                  value={selectedYear}
                  onChange={(val) => setSelectedYear(parseInt(val))}
                  darkMode={darkMode}
                  ariaLabel="Select year"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={labelClass(true)}>
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputNormalClass("description")}
              rows={3}
              placeholder="A brief description of your trip experience."
            />
            {errors.description && <p className={errorTextClass}>{errors.description}</p>}
          </div>

          {/* Image Upload */}
          <div>
            <label className={labelClass(true)}>Trip Image</label>
            {imagePreview && (
              <div className="my-2.5 rounded-lg overflow-hidden shadow-md relative group">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="cursor-pointer absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <label
              htmlFor="imageUpload"
              className={`mt-1 flex flex-col justify-center items-center px-6 py-5 border-2 ${
                darkMode
                  ? "border-gray-600 hover:border-gray-500"
                  : "border-gray-300 hover:border-gray-400"
              } ${
                errors.imageFile ? (darkMode ? "border-red-500" : "border-red-400") : ""
              } border-dashed rounded-md cursor-pointer transition-colors duration-200`}
            >
              <UploadCloud
                className={`mx-auto h-8 w-8 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              />
              <div
                className={`flex text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                <span
                  className={`font-medium ${
                    darkMode
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-600 hover:text-blue-500"
                  }`}
                >
                  Upload a file
                </span>
                <input
                  id="imageUpload"
                  name="imageUpload"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                PNG, JPG, GIF up to 5MB
              </p>
              {imageFile && (
                <p
                  className={`text-xs mt-1 ${darkMode ? "text-green-400" : "text-green-600"}`}
                >
                  {imageFile.name}
                </p>
              )}
            </label>
            {errors.imageFile && <p className={errorTextClass}>{errors.imageFile}</p>}
          </div>

          {/* Image Alt Text */}
          <div>
            <label htmlFor="imageAlt" className={labelClass()}>
              Image Alt Text (Accessibility)
            </label>
            <input
              type="text"
              id="imageAlt"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              className={inputNormalClass("imageAlt")}
              placeholder="e.g., Sunset over Eiffel Tower"
            />
          </div>

          {/* Rating & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div>
              <label className={labelClass(true)}>Rating (1-5)</label>
              <div
                className={`flex space-x-1 p-1 rounded-md ${
                  errors.rating
                    ? darkMode
                      ? "ring-1 ring-red-500"
                      : "ring-1 ring-red-400"
                    : ""
                }`}
              >
                <RatingStars
                  rating={rating}
                  darkMode={darkMode}
                  onRate={setRating}
                  interactive
                  size="h-6 w-6"
                />
              </div>
              {errors.rating && <p className={errorTextClass}>{errors.rating}</p>}
            </div>
            <div>
              <label htmlFor="tags" className={labelClass()}>
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className={inputNormalClass("tags")}
                placeholder="e.g. adventure, beach, food"
              />
            </div>
          </div>

          {/* Highlights */}
          <div>
            <label htmlFor="highlights" className={labelClass(true)}>
              Highlights (one per line)
            </label>
            <textarea
              id="highlights"
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              className={inputNormalClass("highlights")}
              rows={3}
              placeholder="What made it special?&#x0a;e.g., Amazing pasta dishes"
            />
            {errors.highlights && <p className={errorTextClass}>{errors.highlights}</p>}
          </div>

          {/* Lowlights */}
          <div>
            <label htmlFor="lowlights" className={labelClass()}>
              Considerations (one per line)
            </label>
            <textarea
              id="lowlights"
              value={lowlights}
              onChange={(e) => setLowlights(e.target.value)}
              className={inputNormalClass("lowlights")}
              rows={3}
              placeholder="Anything to keep in mind?&#x0a;e.g., Book popular attractions early"
            />
            {errors.lowlights && <p className={errorTextClass}>{errors.lowlights}</p>}
          </div>

          {/* Notes & Expenses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="notes" className={labelClass(true)}>
                Travel Notes
              </label>
              <input
                type="text"
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={inputNormalClass("notes")}
                placeholder="e.g. Best coffee shop: Cafe Central"
              />
              {errors.notes && <p className={errorTextClass}>{errors.notes}</p>}
            </div>
            <div>
              <label htmlFor="expenses" className={labelClass(true)}>
                Expenses / Daily Budget
              </label>
              <input
                type="text"
                id="expenses"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
                className={inputNormalClass("expenses")}
                placeholder="e.g. Approx. $100/day"
              />
              {errors.expenses && <p className={errorTextClass}>{errors.expenses}</p>}
            </div>
          </div>

          {/* Trip Type Toggle */}
          <div>
            <label className={labelClass()}>Trip Type</label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setIsWishlist(false)}
                className={`cursor-pointer flex-1 text-center py-2.5 rounded-xl border-2 font-medium text-sm transition-all duration-300 ${
                  !isWishlist
                    ? darkMode
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-500 text-white shadow-md"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-400 text-white shadow-md"
                    : darkMode
                      ? "bg-gray-800/80 border-gray-600 text-gray-300 hover:border-emerald-500 hover:text-emerald-400"
                      : "bg-white border-gray-200 text-gray-600 hover:border-emerald-400 hover:text-emerald-600"
                }`}
              >
                Visited
              </button>
              <button
                type="button"
                onClick={() => setIsWishlist(true)}
                className={`cursor-pointer flex-1 text-center py-2.5 rounded-xl border-2 font-medium text-sm transition-all duration-300 ${
                  isWishlist
                    ? darkMode
                      ? "bg-gradient-to-r from-pink-600 to-rose-600 border-pink-500 text-white shadow-md"
                      : "bg-gradient-to-r from-pink-500 to-rose-500 border-pink-400 text-white shadow-md"
                    : darkMode
                      ? "bg-gray-800/80 border-gray-600 text-gray-300 hover:border-pink-500 hover:text-pink-400"
                      : "bg-white border-gray-200 text-gray-600 hover:border-pink-400 hover:text-pink-600"
                }`}
              >
                Wishlist
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end items-center pt-4 border-t dark:border-gray-700 border-gray-200 mt-2">
            <button
              type="button"
              onClick={onClose}
              className={`cursor-pointer px-5 py-2.5 rounded-xl font-medium mr-3 transition-all duration-300 text-sm border-2 ${
                darkMode
                  ? "bg-gray-700/80 border-gray-600 hover:bg-gray-600 hover:border-gray-500 text-gray-200"
                  : "bg-gray-100 border-gray-200 hover:bg-gray-200 hover:border-gray-300 text-gray-700"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`cursor-pointer px-6 py-2.5 rounded-xl font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] text-sm ${
                darkMode
                  ? "bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500"
                  : "bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600"
              } flex items-center`}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              {existingTrip ? "Save Changes" : "Add Trip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripFormModal;

