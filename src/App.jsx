import { useCallback, useState } from "react";
import { Globe, MapPinned, PlusCircle, Image as ImageIcon } from "lucide-react";

// Components
import TripCard from "./components/TripCard";
import TripStats from "./components/TripStats";
import ThemeToggle from "./components/ThemeToggle";
import Footer from "./components/Footer";
import DestinationsModal from "./components/DestinationsModal";
import TripFormModal from "./components/TripFormModal";
import ConfirmationModal from "./components/ConfirmationModal";
import FlashMessage from "./components/FlashMessage";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";

// Hooks
import useTrips from "./hooks/useTrips";
import useFlashMessage from "./hooks/useFlashMessage";
import { useModalManager } from "./hooks/useModal";

// Context
import { ThemeProvider, useThemeContext } from "./context/ThemeContext";

// Data
import { continentCountryMap, continentColors, countryFlags, months, years } from "./data/tripData";

// Styles
import "./styles/TravelJournal.css";

/**
 * Main App Content Component
 * Uses custom hooks for state management
 */
function AppContent() {
  // Theme context
  const { darkMode, toggleDarkMode } = useThemeContext();

  // Trip management
  const {
    allTrips,
    currentTrip,
    currentTripId,
    currentTripIndex,
    isLoading,
    totalTrips,
    saveTrip,
    deleteTrip,
    selectTrip,
    goToPrevTrip,
    goToNextTrip,
    getNextTripId,
  } = useTrips();

  // Flash messages
  const { flashMessage, showSuccess, clearFlashMessage } = useFlashMessage();

  // Modal management
  const { destinationsModal, tripFormModal, confirmationModal } = useModalManager();

  // Track which trip is being edited or deleted
  const [editingTrip, setEditingTrip] = useState(null);
  const [tripToDeleteId, setTripToDeleteId] = useState(null);

  // Handle saving a trip (add or edit)
  const handleSaveTrip = useCallback(
    (savedTrip) => {
      const isEditing = saveTrip(savedTrip);
      tripFormModal.close();
      setEditingTrip(null);
      showSuccess(isEditing ? "Trip updated successfully!" : "Trip added successfully!");
    },
    [saveTrip, tripFormModal, showSuccess],
  );

  // Open add trip modal
  const openAddTripModal = useCallback(() => {
    setEditingTrip(null);
    tripFormModal.open();
  }, [tripFormModal]);

  // Open edit trip modal
  const openEditTripModal = useCallback(
    (tripToEdit) => {
      setEditingTrip(tripToEdit);
      tripFormModal.open();
    },
    [tripFormModal],
  );

  // Request trip deletion (opens confirmation modal)
  const handleDeleteRequest = useCallback(
    (id) => {
      setTripToDeleteId(id);
      confirmationModal.open();
    },
    [confirmationModal],
  );

  // Confirm and execute trip deletion
  const confirmDeleteTrip = useCallback(() => {
    if (tripToDeleteId === null) return;

    const deletedTrip = deleteTrip(tripToDeleteId);
    setTripToDeleteId(null);
    confirmationModal.close();

    showSuccess(deletedTrip ? `"${deletedTrip.city}" trip deleted successfully!` : "Trip deleted successfully!");
  }, [tripToDeleteId, deleteTrip, confirmationModal, showSuccess]);

  // Handle trip selection from destinations modal
  const handleSelectTrip = useCallback(
    (tripId) => {
      selectTrip(tripId);
      destinationsModal.close();
    },
    [selectTrip, destinationsModal],
  );

  // Close form modal handler (memoized to prevent re-renders)
  const handleCloseFormModal = useCallback(() => {
    tripFormModal.close();
    setEditingTrip(null);
  }, [tripFormModal]);

  // Close confirmation modal handler (memoized to prevent re-renders)
  const handleCloseConfirmationModal = useCallback(() => {
    confirmationModal.close();
    setTripToDeleteId(null);
  }, [confirmationModal]);

  // Show loading screen while data is being loaded
  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-all duration-700 font-poppins ${
          darkMode
            ? "bg-gradient-to-br from-gray-900 via-slate-900 to-black"
            : "bg-gradient-to-br from-slate-50 via-gray-100 to-stone-200"
        }`}
      >
        <LoadingSpinner darkMode={darkMode} size="large" text="Loading your adventures..." />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col transition-all duration-700 font-poppins ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-slate-900 to-black"
          : "bg-gradient-to-br from-slate-50 via-gray-100 to-stone-200"
      }`}
    >
      {/* Background Blobs */}
      {darkMode ? (
        <div className="fixed inset-0 overflow-hidden opacity-25 pointer-events-none">
          <div className="absolute -top-1/4 left-1/4 w-72 h-72 rounded-full bg-purple-900/40 blur-3xl animate-float1"></div>
          <div className="absolute top-1/3 -right-1/4 w-96 h-96 rounded-full bg-sky-900/40 blur-3xl animate-float2"></div>
          <div className="absolute bottom-0 -left-1/4 w-80 h-80 rounded-full bg-indigo-900/30 blur-3xl animate-float3"></div>
        </div>
      ) : (
        <div className="fixed inset-0 overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-80 h-80 rounded-full bg-purple-200/80 blur-3xl animate-float3"></div>
          <div className="absolute bottom-1/4 -right-1/4 w-72 h-72 rounded-full bg-sky-200/80 blur-3xl animate-float4"></div>
        </div>
      )}

      {/* Header */}
      <header
        className={`sticky top-0 py-5 px-6 md:px-8 backdrop-blur-xl border-b z-30 ${
          darkMode ? "border-gray-700/60 bg-gray-900/70" : "border-gray-200/60 bg-white/70"
        } transition-all duration-500 shadow-sm`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center group cursor-pointer bg-transparent border-none outline-none"
            aria-label="Reload Travel Journal"
          >
            <div
              className={`p-2.5 mr-3 rounded-full ${
                darkMode ? "bg-sky-800/40 group-hover:bg-sky-700/60" : "bg-sky-100/90 group-hover:bg-sky-200/90"
              } transition-all duration-300 transform group-hover:scale-110`}
            >
              <Globe
                className={`h-7 w-7 ${
                  darkMode ? "text-sky-300" : "text-sky-600"
                } transition-all duration-300 group-hover:rotate-[360deg]`}
              />
            </div>
            <h1
              className={`text-3xl font-bold font-playfair ${
                darkMode ? "text-gray-100" : "text-gray-900"
              } transition-colors duration-300 group-hover:text-sky-500`}
            >
              Travel
              <span
                className={`${darkMode ? "text-sky-400" : "text-sky-600"} group-hover:text-indigo-500 transition-colors duration-300`}
              >
                Journal
              </span>
            </h1>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => destinationsModal.open()}
              aria-label="View all destinations"
              className={`relative cursor-pointer px-4 py-2.5 rounded-full flex items-center space-x-2 shadow-md overflow-hidden ${
                darkMode
                  ? "bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white"
                  : "bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white"
              } transition-all duration-300 transform hover:scale-105 hover:shadow-lg group text-sm font-medium`}
            >
              <span className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all duration-500 opacity-50 group-hover:opacity-100"></span>
              <MapPinned className="h-5 w-5 z-10" />
              <span className="z-10">All Trips</span>
            </button>
            <button
              onClick={openAddTripModal}
              aria-label="Add new trip"
              className={`relative cursor-pointer px-4 py-2.5 rounded-full flex items-center space-x-2 shadow-md overflow-hidden ${
                darkMode
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
              } transition-all duration-300 transform hover:scale-105 hover:shadow-lg group text-sm font-medium`}
            >
              <span className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all duration-500 opacity-50 group-hover:opacity-100"></span>
              <PlusCircle className="h-5 w-5 z-10" />
              <span className="z-10">Add Trip</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto py-8 md:py-12 px-4 md:px-6 z-10 flex-grow">
        <div className="space-y-10 md:space-y-12">
          {currentTrip ? (
            <div className="animate-fadeIn">
              <TripCard
                trip={currentTrip}
                index={currentTripIndex}
                totalTrips={totalTrips}
                darkMode={darkMode}
                continentColors={continentColors}
                countryFlags={countryFlags}
                onPrev={goToPrevTrip}
                onNext={goToNextTrip}
                onEdit={openEditTripModal}
                onDelete={handleDeleteRequest}
              />
            </div>
          ) : (
            <div
              className={`p-8 md:p-12 rounded-3xl shadow-xl text-center ${
                darkMode
                  ? "bg-gray-800/70 text-gray-300 border-gray-700/50"
                  : "bg-white/80 text-gray-700 border-gray-200/50"
              } backdrop-blur-xl border animate-fadeIn`}
            >
              <ImageIcon className={`h-16 w-16 mx-auto mb-6 ${darkMode ? "text-sky-500" : "text-sky-600"}`} />
              <h2 className={`text-3xl font-bold font-playfair mb-4 ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                Your Adventure Awaits!
              </h2>
              <p className="text-lg mb-8 leading-relaxed">
                It looks like your travel journal is ready for its first story.
                <br />
                Click below to add your maiden voyage or a dream destination.
              </p>
              <button
                onClick={openAddTripModal}
                className={`cursor-pointer px-6 py-3 rounded-full font-semibold flex items-center justify-center mx-auto space-x-2 shadow-lg ${
                  darkMode
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                } transition-all duration-300 transform hover:scale-105 hover:shadow-xl group`}
              >
                <PlusCircle className="h-5 w-5" />
                <span>Add Your First Trip</span>
              </button>
            </div>
          )}

          <div className="animate-fadeInUp animation-delay-300">
            <TripStats trips={allTrips} darkMode={darkMode} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer darkMode={darkMode} />

      {/* Theme Toggle */}
      <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {/* Modals */}
      <DestinationsModal
        isOpen={destinationsModal.isOpen}
        onClose={destinationsModal.close}
        allTrips={allTrips}
        currentTripId={currentTripId}
        onSelectTrip={handleSelectTrip}
        darkMode={darkMode}
        continentColors={continentColors}
        countryFlags={countryFlags}
        onEditTrip={openEditTripModal}
        onDeleteTrip={handleDeleteRequest}
      />

      <TripFormModal
        isOpen={tripFormModal.isOpen}
        onClose={handleCloseFormModal}
        onSaveTrip={handleSaveTrip}
        darkMode={darkMode}
        existingTrip={editingTrip}
        nextTripId={getNextTripId()}
        continentCountryMap={continentCountryMap}
        continentColors={continentColors}
        months={months}
        years={years}
      />

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={handleCloseConfirmationModal}
        onConfirm={confirmDeleteTrip}
        title="Confirm Deletion"
        message="Are you sure you want to delete this trip? This action cannot be undone."
        darkMode={darkMode}
        confirmText="Delete Trip"
      />

      {/* Flash Message */}
      {flashMessage && (
        <FlashMessage
          key={flashMessage.id}
          message={flashMessage.message}
          type={flashMessage.type}
          onClose={clearFlashMessage}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

/**
 * App Component
 * Wraps the main content with ThemeProvider and ErrorBoundary for context and error handling
 */
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
