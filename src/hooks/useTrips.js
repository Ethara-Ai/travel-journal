import { useState, useEffect, useCallback, useMemo } from "react";
import { initialTripsData } from "../data/tripData";

/**
 * useTrips - Custom hook for managing trip state and CRUD operations
 * Handles localStorage persistence automatically with proper error handling
 *
 * @returns {object} Trip state and operations
 */
const useTrips = () => {
  const [allTrips, setAllTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Derive currentTripId from selectedTripId and allTrips
  // This avoids calling setState inside useEffect
  const currentTripId = useMemo(() => {
    if (allTrips.length === 0) return null;
    if (selectedTripId !== null && allTrips.find((trip) => trip.id === selectedTripId)) {
      return selectedTripId;
    }
    return allTrips[0].id;
  }, [allTrips, selectedTripId]);

  // Load trips from localStorage on mount
  useEffect(() => {
    const loadTrips = () => {
      try {
        const storedTrips = localStorage.getItem("travelJournalTrips");

        if (storedTrips) {
          const parsedTrips = JSON.parse(storedTrips);

          // Validate that parsedTrips is an array
          if (!Array.isArray(parsedTrips)) {
            console.error("Stored trips is not an array, loading initial data");
            setAllTrips(initialTripsData);
          } else if (parsedTrips.length === 0) {
            // Load initial data if localStorage has empty array
            setAllTrips(initialTripsData);
          } else {
            setAllTrips(parsedTrips);
          }
        } else {
          setAllTrips(initialTripsData);
        }
      } catch (error) {
        console.error("Failed to parse trips from localStorage:", error);
        // Fall back to initial data on error
        setAllTrips(initialTripsData);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrips();
  }, []);

  // Save trips to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && allTrips.length >= 0) {
      try {
        localStorage.setItem("travelJournalTrips", JSON.stringify(allTrips));
      } catch (error) {
        console.error("Failed to save trips to localStorage:", error);
        // Could be quota exceeded - notify user in production
      }
    }
  }, [allTrips, isLoading]);

  // Get current trip
  const currentTrip = useMemo(() => {
    return allTrips.find((trip) => trip.id === currentTripId);
  }, [allTrips, currentTripId]);

  // Get current trip index
  const currentTripIndex = useMemo(() => {
    return allTrips.findIndex((t) => t.id === currentTripId);
  }, [allTrips, currentTripId]);

  // Navigate to previous trip
  const goToPrevTrip = useCallback(() => {
    if (allTrips.length <= 1) return;
    const currentIndex = allTrips.findIndex((trip) => trip.id === currentTripId);
    const prevIndex = (currentIndex - 1 + allTrips.length) % allTrips.length;
    setSelectedTripId(allTrips[prevIndex].id);
  }, [allTrips, currentTripId]);

  // Navigate to next trip
  const goToNextTrip = useCallback(() => {
    if (allTrips.length <= 1) return;
    const currentIndex = allTrips.findIndex((trip) => trip.id === currentTripId);
    const nextIndex = (currentIndex + 1) % allTrips.length;
    setSelectedTripId(allTrips[nextIndex].id);
  }, [allTrips, currentTripId]);

  // Get next available trip ID
  const getNextTripId = useCallback(() => {
    return allTrips.length > 0 ? Math.max(...allTrips.map((trip) => trip.id)) + 1 : 1;
  }, [allTrips]);

  // Add or update a trip
  const saveTrip = useCallback(
    (tripData) => {
      const existingIndex = allTrips.findIndex((t) => t.id === tripData.id);
      const isEditing = existingIndex > -1;

      let updatedTrips;
      if (isEditing) {
        updatedTrips = allTrips.map((t) => (t.id === tripData.id ? tripData : t));
      } else {
        updatedTrips = [...allTrips, tripData];
      }

      setAllTrips(updatedTrips);
      setSelectedTripId(tripData.id);

      return isEditing;
    },
    [allTrips],
  );

  // Delete a trip
  const deleteTrip = useCallback(
    (tripId) => {
      const deletedTrip = allTrips.find((trip) => trip.id === tripId);
      const updatedTrips = allTrips.filter((trip) => trip.id !== tripId);
      setAllTrips(updatedTrips);

      // If we deleted the current trip, reset selection
      if (currentTripId === tripId) {
        setSelectedTripId(updatedTrips.length > 0 ? updatedTrips[0].id : null);
      }

      return deletedTrip;
    },
    [allTrips, currentTripId],
  );

  // Select a specific trip
  const selectTrip = useCallback((tripId) => {
    setSelectedTripId(tripId);
  }, []);

  // Get a trip by ID
  const getTripById = useCallback(
    (tripId) => {
      return allTrips.find((trip) => trip.id === tripId);
    },
    [allTrips],
  );

  return {
    // State
    allTrips,
    currentTrip,
    currentTripId,
    currentTripIndex,
    isLoading,
    totalTrips: allTrips.length,

    // Actions
    saveTrip,
    deleteTrip,
    selectTrip,
    goToPrevTrip,
    goToNextTrip,
    getNextTripId,
    getTripById,
  };
};

export default useTrips;
