/**
 * Test Utilities
 * Custom render function and testing helpers for React Testing Library
 */

import { render } from "@testing-library/react";
import { vi } from "vitest";

/**
 * Custom render function that can wrap components with providers
 * @param {React.ReactElement} ui - Component to render
 * @param {Object} options - Render options
 * @param {Object} options.providerProps - Props to pass to providers
 * @param {Object} renderOptions - Additional render options
 * @returns {Object} Render result with custom utilities
 */
const customRender = (ui, { ...renderOptions } = {}) => {
  // Wrapper component for providers (can be extended with context providers)
  // Note: Add providerProps parameter when implementing context providers
  const Wrapper = ({ children }) => {
    return children;
  };

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    // Add custom utilities here if needed
  };
};

/**
 * Create a mock trip object for testing
 * @param {Object} overrides - Properties to override
 * @returns {Object} Mock trip object
 */
export const createMockTrip = (overrides = {}) => ({
  id: 1,
  continent: "Europe",
  country: "Italy",
  city: "Rome",
  date: "May 2023",
  rating: 5,
  description: "A historic city with ancient ruins, stunning art, and delicious cuisine.",
  highlights: ["Visited the Colosseum and Roman Forum", "Tossed a coin in the Trevi Fountain"],
  lowlights: ["Can be very crowded"],
  image: "https://example.com/rome.jpg",
  imageAlt: "The Colosseum in Rome",
  color: "#7c3aed",
  notes: "Wear comfortable shoes.",
  expenses: "$2,500 for a 7-day trip",
  tags: ["history", "art", "food"],
  isWishlist: false,
  ...overrides,
});

/**
 * Create multiple mock trips for testing
 * @param {number} count - Number of trips to create
 * @param {Function} customizer - Function to customize each trip
 * @returns {Array} Array of mock trips
 */
export const createMockTrips = (count = 3, customizer = null) => {
  const continents = ["Europe", "Asia", "North America", "South America", "Africa", "Oceania"];
  const countries = ["Italy", "Japan", "Canada", "Brazil", "Egypt", "Australia"];
  const cities = ["Rome", "Kyoto", "Banff", "Rio de Janeiro", "Luxor", "Sydney"];

  return Array.from({ length: count }, (_, index) => {
    const baseTrip = {
      id: index + 1,
      continent: continents[index % continents.length],
      country: countries[index % countries.length],
      city: cities[index % cities.length],
      date: `Month ${index + 1} 2024`,
      rating: (index % 5) + 1,
      description: `Description for trip ${index + 1}`,
      highlights: [`Highlight ${index + 1}`],
      lowlights: [`Lowlight ${index + 1}`],
      image: `https://example.com/image${index + 1}.jpg`,
      imageAlt: `Image for trip ${index + 1}`,
      color: "#7c3aed",
      notes: `Notes for trip ${index + 1}`,
      expenses: `$${(index + 1) * 1000}`,
      tags: ["tag1", "tag2"],
      isWishlist: index % 3 === 0,
    };

    return customizer ? customizer(baseTrip, index) : baseTrip;
  });
};

/**
 * Create a mock user object for testing
 * @param {Object} overrides - Properties to override
 * @returns {Object} Mock user object
 */
export const createMockUser = (overrides = {}) => ({
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: null,
  initials: "JD",
  ...overrides,
});

/**
 * Wait for a specified duration
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after the duration
 */
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Wait for loading states to resolve
 * Use with async testing
 */
export const waitForLoadingToFinish = () => wait(1100);

/**
 * Mock functions for common callbacks
 */
export const createMockHandlers = () => ({
  onClick: vi.fn(),
  onChange: vi.fn(),
  onSubmit: vi.fn(),
  onClose: vi.fn(),
  onOpen: vi.fn(),
  onDelete: vi.fn(),
  onSave: vi.fn(),
  onSelect: vi.fn(),
  onRate: vi.fn(),
  onRemove: vi.fn(),
  onClear: vi.fn(),
  onAction: vi.fn(),
});

/**
 * Create props for dark mode testing
 * @param {boolean} darkMode - Whether dark mode is enabled
 * @returns {Object} Props object with darkMode
 */
export const withDarkMode = (darkMode = true) => ({ darkMode });

/**
 * Assert that an element has specific Tailwind classes
 * @param {HTMLElement} element - Element to check
 * @param {Array<string>} classes - Array of class names to check
 * @returns {boolean} Whether all classes are present
 */
export const hasClasses = (element, classes) => {
  return classes.every((className) => element.classList.contains(className));
};

/**
 * Get computed style value for an element
 * @param {HTMLElement} element - Element to check
 * @param {string} property - CSS property name
 * @returns {string} Computed style value
 */
export const getComputedStyleValue = (element, property) => {
  return window.getComputedStyle(element).getPropertyValue(property);
};

/**
 * Simulate keyboard events
 */
export const keyboard = {
  enter: { key: "Enter", code: "Enter", keyCode: 13 },
  escape: { key: "Escape", code: "Escape", keyCode: 27 },
  space: { key: " ", code: "Space", keyCode: 32 },
  arrowUp: { key: "ArrowUp", code: "ArrowUp", keyCode: 38 },
  arrowDown: { key: "ArrowDown", code: "ArrowDown", keyCode: 40 },
  arrowLeft: { key: "ArrowLeft", code: "ArrowLeft", keyCode: 37 },
  arrowRight: { key: "ArrowRight", code: "ArrowRight", keyCode: 39 },
  tab: { key: "Tab", code: "Tab", keyCode: 9 },
  backspace: { key: "Backspace", code: "Backspace", keyCode: 8 },
};

/**
 * Mock timers utilities
 */
export const mockTimers = {
  useFakeTimers: () => vi.useFakeTimers(),
  useRealTimers: () => vi.useRealTimers(),
  advanceTimers: (ms) => vi.advanceTimersByTime(ms),
  runAllTimers: () => vi.runAllTimers(),
};

// Re-export everything from React Testing Library
export * from "@testing-library/react";

// Export custom render as the default render
export { customRender as render };
