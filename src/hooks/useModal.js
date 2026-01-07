import { useState, useCallback, useEffect } from "react";

/**
 * useModal - Custom hook for managing modal state
 * Automatically handles body scroll lock
 * 
 * @param {boolean} initialState - Initial open/closed state
 * @returns {object} Modal state and controls
 */
const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState(null);

  // Open modal with optional data
  const open = useCallback((modalData = null) => {
    setData(modalData);
    setIsOpen(true);
  }, []);

  // Close modal and clear data
  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  // Toggle modal
  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
  };
};

/**
 * useModalManager - Manages multiple modals and handles scroll lock
 * 
 * @returns {object} Modal states and controls
 */
export const useModalManager = () => {
  const destinationsModal = useModal();
  const tripFormModal = useModal();
  const confirmationModal = useModal();

  // Check if any modal is open
  const isAnyModalOpen =
    destinationsModal.isOpen ||
    tripFormModal.isOpen ||
    confirmationModal.isOpen;

  // Handle body scroll lock
  useEffect(() => {
    if (isAnyModalOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isAnyModalOpen]);

  return {
    destinationsModal,
    tripFormModal,
    confirmationModal,
    isAnyModalOpen,
  };
};

export default useModal;

