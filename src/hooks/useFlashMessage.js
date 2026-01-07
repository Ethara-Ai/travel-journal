import { useState, useCallback } from "react";

/**
 * useFlashMessage - Custom hook for managing flash/toast messages
 * 
 * @returns {object} Flash message state and show function
 */
const useFlashMessage = () => {
  const [flashMessage, setFlashMessage] = useState(null);

  // Show a flash message
  const showFlashMessage = useCallback((message, type = "info") => {
    setFlashMessage({
      message,
      type,
      id: Date.now(),
    });
  }, []);

  // Show success message
  const showSuccess = useCallback((message) => {
    showFlashMessage(message, "success");
  }, [showFlashMessage]);

  // Show error message
  const showError = useCallback((message) => {
    showFlashMessage(message, "error");
  }, [showFlashMessage]);

  // Show info message
  const showInfo = useCallback((message) => {
    showFlashMessage(message, "info");
  }, [showFlashMessage]);

  // Clear flash message
  const clearFlashMessage = useCallback(() => {
    setFlashMessage(null);
  }, []);

  return {
    flashMessage,
    showFlashMessage,
    showSuccess,
    showError,
    showInfo,
    clearFlashMessage,
  };
};

export default useFlashMessage;

