import { memo } from "react";
import PropTypes from "prop-types";
import { AlertTriangle } from "lucide-react";

/**
 * ConfirmationModal Component
 *
 * A reusable confirmation dialog for destructive or important actions.
 * Memoized to prevent unnecessary re-renders.
 *
 * @param {boolean} isOpen - Whether the modal is open
 * @param {Function} onClose - Handler to close the modal
 * @param {Function} onConfirm - Handler for confirmation action
 * @param {string} title - Modal title
 * @param {string} message - Confirmation message
 * @param {boolean} darkMode - Dark mode toggle
 * @param {string} confirmText - Text for confirm button
 * @param {string} cancelText - Text for cancel button
 */
const ConfirmationModal = memo(function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  darkMode = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) {
  if (!isOpen) return null;

  // Handle confirm click - only call onConfirm, let parent handle closing
  const handleConfirm = () => {
    onConfirm();
    // Note: Parent component is responsible for closing the modal after confirmation
    // This prevents race conditions and double-state-updates
  };

  // Handle escape key press
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 backdrop-blur-md bg-black/60 transition-opacity duration-300 animate-opacityIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-message"
      onKeyDown={handleKeyDown}
    >
      <div
        className={`${
          darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/95 border-gray-200"
        } max-w-md w-full mx-auto rounded-2xl shadow-2xl border-2 animate-scaleIn`}
        role="document"
      >
        <div className="p-6">
          <div className="flex items-start">
            <div
              className={`p-2.5 rounded-full mr-4 flex-shrink-0 ${darkMode ? "bg-red-900/40" : "bg-red-100"}`}
              aria-hidden="true"
            >
              <AlertTriangle className={`h-6 w-6 ${darkMode ? "text-red-300" : "text-red-500"}`} />
            </div>
            <div>
              <h3
                id="confirmation-modal-title"
                className={`text-lg font-semibold font-playfair ${darkMode ? "text-gray-100" : "text-gray-900"}`}
              >
                {title}
              </h3>
              <p
                id="confirmation-modal-message"
                className={`mt-1 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                {message}
              </p>
            </div>
          </div>
        </div>
        <div
          className={`px-6 py-4 bg-opacity-50 rounded-b-2xl flex justify-end space-x-3 ${
            darkMode ? "bg-gray-700/30" : "bg-gray-100/50"
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className={`cursor-pointer px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              darkMode
                ? "bg-gray-700/80 border-gray-600 hover:bg-gray-600 hover:border-gray-500 text-gray-200 focus:ring-gray-500"
                : "bg-gray-100 border-gray-200 hover:bg-gray-200 hover:border-gray-300 text-gray-700 focus:ring-gray-400"
            }`}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`cursor-pointer px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              darkMode
                ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 focus:ring-red-400"
                : "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 focus:ring-red-500"
            }`}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
});

ConfirmationModal.propTypes = {
  /** Whether the modal is open */
  isOpen: PropTypes.bool.isRequired,
  /** Handler to close the modal */
  onClose: PropTypes.func.isRequired,
  /** Handler for confirmation action */
  onConfirm: PropTypes.func.isRequired,
  /** Modal title */
  title: PropTypes.string,
  /** Confirmation message */
  message: PropTypes.string,
  /** Dark mode toggle */
  darkMode: PropTypes.bool,
  /** Text for confirm button */
  confirmText: PropTypes.string,
  /** Text for cancel button */
  cancelText: PropTypes.string,
};

ConfirmationModal.defaultProps = {
  title: "Confirm Action",
  message: "Are you sure you want to proceed?",
  darkMode: false,
  confirmText: "Confirm",
  cancelText: "Cancel",
};

export default ConfirmationModal;
