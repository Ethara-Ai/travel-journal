import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

/**
 * ErrorBoundary Component
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console (in production, send to error tracking service)
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });

    // Optional: Send to error tracking service
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, darkMode = false } = this.props;

    if (hasError) {
      // If a custom fallback is provided, use it
      if (fallback) {
        return typeof fallback === "function"
          ? fallback({ error, reset: this.handleReset })
          : fallback;
      }

      // Default fallback UI
      return (
        <div
          className={`min-h-screen flex items-center justify-center p-4 ${
            darkMode
              ? "bg-gradient-to-br from-gray-900 via-slate-900 to-black"
              : "bg-gradient-to-br from-slate-50 via-gray-100 to-stone-200"
          }`}
        >
          <div
            className={`max-w-md w-full p-8 rounded-2xl shadow-2xl border-2 text-center ${
              darkMode
                ? "bg-gray-800/90 border-gray-700/80"
                : "bg-white/95 border-gray-200/80"
            }`}
          >
            <div
              className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                darkMode ? "bg-red-900/40" : "bg-red-100"
              }`}
            >
              <AlertTriangle
                className={`h-8 w-8 ${darkMode ? "text-red-400" : "text-red-500"}`}
              />
            </div>

            <h1
              className={`text-2xl font-bold font-playfair mb-3 ${
                darkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Oops! Something went wrong
            </h1>

            <p
              className={`mb-6 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              We&apos;re sorry, but something unexpected happened. Please try
              refreshing the page or contact support if the problem persists.
            </p>

            {process.env.NODE_ENV === "development" && error && (
              <div
                className={`mb-6 p-4 rounded-lg text-left text-sm overflow-auto max-h-32 ${
                  darkMode
                    ? "bg-gray-900/80 text-red-400 border border-red-900/50"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                <p className="font-mono break-words">{error.toString()}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border-2 ${
                  darkMode
                    ? "bg-gray-700/80 border-gray-600 hover:bg-gray-600 hover:border-gray-500 text-gray-200"
                    : "bg-gray-100 border-gray-200 hover:bg-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                Try Again
              </button>

              <button
                onClick={this.handleReload}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
                  darkMode
                    ? "bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500"
                    : "bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600"
                }`}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

/**
 * withErrorBoundary HOC
 * Wraps a component with an ErrorBoundary
 *
 * @param {React.ComponentType} WrappedComponent - Component to wrap
 * @param {Object} errorBoundaryProps - Props to pass to ErrorBoundary
 * @returns {React.ComponentType} Wrapped component
 */
export const withErrorBoundary = (WrappedComponent, errorBoundaryProps = {}) => {
  const WithErrorBoundary = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundary.displayName = `withErrorBoundary(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithErrorBoundary;
};

export default ErrorBoundary;
