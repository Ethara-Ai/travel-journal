import { useState, useEffect, useCallback } from "react";
import { initialTripsData } from "../data/tripData";

/**
 * useTrips - Custom hook for managing trip state and CRUD operations
 * Handles localStorage persistence automatically
 * 
 * @returns {object} Trip state and operations
 */
const useTrips = () => {
  const [allTrips, setAllTrips] = useState([]);
  const [currentTripId, setCurrentTripId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load trips from localStorage on mount
  useEffect(() => {
    const loadTrips = async () => {
      // Simulate minimum loading time for smooth UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const storedTrips = localStorage.getItem("travelJournalTrips");

      if (storedTrips) {
        const parsedTrips = JSON.parse(storedTrips);
        if (parsedTrips.length === 0) {
          setAllTrips(initialTripsData);
        } else {
          setAllTrips(parsedTrips);
        }
      } else {
        setAllTrips(initialTripsData);
      }

      setIsLoading(false);
    };

    loadTrips();
  }, []);

  // Save trips to localStorage and manage currentTripId
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("travelJournalTrips", JSON.stringify(allTrips));
    }

    if (allTrips.length > 0 && currentTripId === null) {
      setCurrentTripId(allTrips[0].id);
    } else if (allTrips.length > 0 && !allTrips.find((trip) => trip.id === currentTripId)) {
      setCurrentTripId(allTrips[0].id);
    } else if (allTrips.length === 0) {
      setCurrentTripId(null);
    }
  }, [allTrips, currentTripId, isLoading]);

  // Get current trip
  const currentTrip = allTrips.find((trip) => trip.id === currentTripId);

  // Get current trip index
  const currentTripIndex = allTrips.findIndex((t) => t.id === currentTripId);

  // Navigate to previous trip
  const goToPrevTrip = useCallback(() => {
    if (allTrips.length <= 1) return;
    const currentIndex = allTrips.findIndex((trip) => trip.id === currentTripId);
    const prevIndex = (currentIndex - 1 + allTrips.length) % allTrips.length;
    setCurrentTripId(allTrips[prevIndex].id);
  }, [allTrips, currentTripId]);

  // Navigate to next trip
  const goToNextTrip = useCallback(() => {
    if (allTrips.length <= 1) return;
    const currentIndex = allTrips.findIndex((trip) => trip.id === currentTripId);
    const nextIndex = (currentIndex + 1) % allTrips.length;
    setCurrentTripId(allTrips[nextIndex].id);
  }, [allTrips, currentTripId]);

  // Get next available trip ID
  const getNextTripId = useCallback(() => {
    return allTrips.length > 0 ? Math.max(...allTrips.map((trip) => trip.id)) + 1 : 1;
  }, [allTrips]);

  // Add or update a trip
  const saveTrip = useCallback((tripData) => {
    const existingIndex = allTrips.findIndex((t) => t.id === tripData.id);
    const isEditing = existingIndex > -1;

    let updatedTrips;
    if (isEditing) {
      updatedTrips = allTrips.map((t) => (t.id === tripData.id ? tripData : t));
    } else {
      updatedTrips = [...allTrips, tripData];
    }

    setAllTrips(updatedTrips);
    setCurrentTripId(tripData.id);

    return isEditing;
  }, [allTrips]);

  // Delete a trip
  const deleteTrip = useCallback((tripId) => {
    const deletedTrip = allTrips.find((trip) => trip.id === tripId);
    const updatedTrips = allTrips.filter((trip) => trip.id !== tripId);
    setAllTrips(updatedTrips);

    if (currentTripId === tripId) {
      setCurrentTripId(updatedTrips.length > 0 ? updatedTrips[0].id : null);
    }

    return deletedTrip;
  }, [allTrips, currentTripId]);

  // Select a specific trip
  const selectTrip = useCallback((tripId) => {
    setCurrentTripId(tripId);
  }, []);

  // Get a trip by ID
  const getTripById = useCallback((tripId) => {
    return allTrips.find((trip) => trip.id === tripId);
  }, [allTrips]);

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

