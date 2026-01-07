import { useState, useEffect, useCallback } from "react";
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

// Data
import { 
  initialTripsData, 
  continentCountryMap, 
  continentColors, 
  countryFlags, 
  months, 
  years 
} from "./data/tripData";

// Styles
import "./styles/TravelJournal.css";

function App() {
  const [allTrips, setAllTrips] = useState([]);
  const [currentTripId, setCurrentTripId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [flashMessage, setFlashMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isDestinationsModalOpen, setIsDestinationsModalOpen] = useState(false);
  const [isTripFormModalOpen, setIsTripFormModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [tripToDeleteId, setTripToDeleteId] = useState(null);

  const showFlashMessage = (message, type) => {
    setFlashMessage({ message, type, id: Date.now() });
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = async () => {
      // Simulate minimum loading time for smooth UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const storedTrips = localStorage.getItem("travelJournalTrips");
      const storedDarkMode = localStorage.getItem("darkMode");

      if (storedTrips) {
        const parsedTrips = JSON.parse(storedTrips);
        // Load initial data if localStorage is empty
        if (parsedTrips.length === 0) {
          setAllTrips(initialTripsData);
        } else {
          setAllTrips(parsedTrips);
        }
      } else {
        setAllTrips(initialTripsData);
      }

      if (storedDarkMode !== null) {
        setDarkMode(storedDarkMode === "true");
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setDarkMode(prefersDark);
      }

      setIsLoading(false);
    };

    loadData();
  }, []);

  // Save trips to localStorage and manage currentTripId
  useEffect(() => {
    localStorage.setItem("travelJournalTrips", JSON.stringify(allTrips));
    if (allTrips.length > 0 && currentTripId === null) {
      setCurrentTripId(allTrips[0].id);
    } else if (allTrips.length > 0 && !allTrips.find((trip) => trip.id === currentTripId)) {
      setCurrentTripId(allTrips[0].id);
    } else if (allTrips.length === 0) {
      setCurrentTripId(null);
    }
  }, [allTrips, currentTripId]);

  // Save dark mode preference and update body/html class for scrollbar theming
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add("dark-mode");
      document.body.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  // Disable background scrolling when any modal is open
  useEffect(() => {
    const isAnyModalOpen = isDestinationsModalOpen || isTripFormModalOpen || isConfirmationModalOpen;
    if (isAnyModalOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    // Cleanup on unmount
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isDestinationsModalOpen, isTripFormModalOpen, isConfirmationModalOpen]);

  const currentTrip = allTrips.find((trip) => trip.id === currentTripId);

  const handlePrevTrip = useCallback(() => {
    if (allTrips.length <= 1) return;
    const currentIndex = allTrips.findIndex((trip) => trip.id === currentTripId);
    const prevIndex = (currentIndex - 1 + allTrips.length) % allTrips.length;
    setCurrentTripId(allTrips[prevIndex].id);
  }, [allTrips, currentTripId]);

  const handleNextTrip = useCallback(() => {
    if (allTrips.length <= 1) return;
    const currentIndex = allTrips.findIndex((trip) => trip.id === currentTripId);
    const nextIndex = (currentIndex + 1) % allTrips.length;
    setCurrentTripId(allTrips[nextIndex].id);
  }, [allTrips, currentTripId]);

  const handleSaveTrip = (savedTrip) => {
    const existingIndex = allTrips.findIndex((t) => t.id === savedTrip.id);
    const isEditing = existingIndex > -1;
    let updatedTrips;
    if (isEditing) {
      updatedTrips = allTrips.map((t) => (t.id === savedTrip.id ? savedTrip : t));
    } else {
      updatedTrips = [...allTrips, savedTrip];
    }
    setAllTrips(updatedTrips);
    setCurrentTripId(savedTrip.id);
    setIsTripFormModalOpen(false);
    setEditingTrip(null);
    showFlashMessage(
      isEditing ? "Trip updated successfully!" : "Trip added successfully!",
      "success"
    );
  };

  const openAddTripModal = () => {
    setEditingTrip(null);
    setIsTripFormModalOpen(true);
  };

  const openEditTripModal = (tripToEdit) => {
    setEditingTrip(tripToEdit);
    setIsTripFormModalOpen(true);
  };

  const handleDeleteRequest = (id) => {
    setTripToDeleteId(id);
    setIsConfirmationModalOpen(true);
  };

  const confirmDeleteTrip = () => {
    if (tripToDeleteId === null) return;
    const deletedTrip = allTrips.find((trip) => trip.id === tripToDeleteId);
    const updatedTrips = allTrips.filter((trip) => trip.id !== tripToDeleteId);
    setAllTrips(updatedTrips);
    if (currentTripId === tripToDeleteId) {
      setCurrentTripId(updatedTrips.length > 0 ? updatedTrips[0].id : null);
    }
    setTripToDeleteId(null);
    showFlashMessage(
      deletedTrip
        ? `"${deletedTrip.city}" trip deleted successfully!`
        : "Trip deleted successfully!",
      "success"
    );
  };

  const getNextTripId = () => {
    return allTrips.length > 0 ? Math.max(...allTrips.map((trip) => trip.id)) + 1 : 1;
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

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
      className={`min-h-screen flex flex-col transition-all duration-700 font-poppins ${darkMode
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
        className={`sticky top-0 py-5 px-6 md:px-8 backdrop-blur-xl border-b z-30 ${darkMode
            ? "border-gray-700/60 bg-gray-900/70"
            : "border-gray-200/60 bg-white/70"
          } transition-all duration-500 shadow-sm`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 1500);
            }}
            className="flex items-center group cursor-pointer bg-transparent border-none outline-none"
            aria-label="Reload Travel Journal"
          >
            <div
              className={`p-2.5 mr-3 rounded-full ${darkMode
                  ? "bg-sky-800/40 group-hover:bg-sky-700/60"
                  : "bg-sky-100/90 group-hover:bg-sky-200/90"
                } transition-all duration-300 transform group-hover:scale-110`}
            >
              <Globe
                className={`h-7 w-7 ${darkMode ? "text-sky-300" : "text-sky-600"
                  } transition-all duration-300 group-hover:rotate-[360deg]`}
              />
            </div>
            <h1
              className={`text-3xl font-bold font-playfair ${darkMode ? "text-gray-100" : "text-gray-900"
                } transition-colors duration-300 group-hover:text-sky-500`}
            >
              Travel
              <span className={`${darkMode ? "text-sky-400" : "text-sky-600"} group-hover:text-indigo-500 transition-colors duration-300`}>Journal</span>
            </h1>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDestinationsModalOpen(true)}
              aria-label="View all destinations"
              className={`relative cursor-pointer px-4 py-2.5 rounded-full flex items-center space-x-2 shadow-md overflow-hidden ${darkMode
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
              className={`relative cursor-pointer px-4 py-2.5 rounded-full flex items-center space-x-2 shadow-md overflow-hidden ${darkMode
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
                index={allTrips.findIndex((t) => t.id === currentTripId)}
                totalTrips={allTrips.length}
                darkMode={darkMode}
                continentColors={continentColors}
                countryFlags={countryFlags}
                onPrev={handlePrevTrip}
                onNext={handleNextTrip}
                onEdit={openEditTripModal}
                onDelete={handleDeleteRequest}
              />
            </div>
          ) : (
            <div
              className={`p-8 md:p-12 rounded-3xl shadow-xl text-center ${darkMode
                  ? "bg-gray-800/70 text-gray-300 border-gray-700/50"
                  : "bg-white/80 text-gray-700 border-gray-200/50"
                } backdrop-blur-xl border animate-fadeIn`}
            >
              <ImageIcon
                className={`h-16 w-16 mx-auto mb-6 ${darkMode ? "text-sky-500" : "text-sky-600"
                  }`}
              />
              <h2
                className={`text-3xl font-bold font-playfair mb-4 ${darkMode ? "text-gray-100" : "text-gray-800"
                  }`}
              >
                Your Adventure Awaits!
              </h2>
              <p className="text-lg mb-8 leading-relaxed">
                It looks like your travel journal is ready for its first story.
                <br />
                Click below to add your maiden voyage or a dream destination.
              </p>
              <button
                onClick={openAddTripModal}
                className={`cursor-pointer px-6 py-3 rounded-full font-semibold flex items-center justify-center mx-auto space-x-2 shadow-lg ${darkMode
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
        isOpen={isDestinationsModalOpen}
        onClose={() => setIsDestinationsModalOpen(false)}
        allTrips={allTrips}
        currentTripId={currentTripId}
        onSelectTrip={setCurrentTripId}
        darkMode={darkMode}
        continentColors={continentColors}
        countryFlags={countryFlags}
        onEditTrip={openEditTripModal}
        onDeleteTrip={handleDeleteRequest}
      />

      <TripFormModal
        isOpen={isTripFormModalOpen}
        onClose={() => {
          setIsTripFormModalOpen(false);
          setEditingTrip(null);
        }}
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
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
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
          onClose={() => setFlashMessage(null)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

export default App;

