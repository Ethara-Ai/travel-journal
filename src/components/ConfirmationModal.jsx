import { AlertTriangle } from "lucide-react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  darkMode,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 backdrop-blur-md bg-black/60 transition-opacity duration-300 animate-opacityIn">
      <div
        className={`${
          darkMode
            ? "bg-gray-800/90 border-gray-700"
            : "bg-white/95 border-gray-200"
        } max-w-md w-full mx-auto rounded-2xl shadow-2xl border-2 animate-scaleIn`}
      >
        <div className="p-6">
          <div className="flex items-start">
            <div
              className={`p-2.5 rounded-full mr-4 ${
                darkMode ? "bg-red-900/40" : "bg-red-100"
              }`}
            >
              <AlertTriangle
                className={`h-6 w-6 ${darkMode ? "text-red-300" : "text-red-500"}`}
              />
            </div>
            <div>
              <h3
                className={`text-lg font-semibold font-playfair ${
                  darkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {title}
              </h3>
              <p
                className={`mt-1 text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
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
            onClick={onClose}
            className={`cursor-pointer px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border-2 ${
              darkMode
                ? "bg-gray-700/80 border-gray-600 hover:bg-gray-600 hover:border-gray-500 text-gray-200"
                : "bg-gray-100 border-gray-200 hover:bg-gray-200 hover:border-gray-300 text-gray-700"
            }`}
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`cursor-pointer px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] ${
              darkMode
                ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500"
                : "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

