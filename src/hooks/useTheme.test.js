/**
 * Unit tests for useTheme hook
 * Tests theme state management, localStorage persistence, and DOM class manipulation
 *
 * Note: useTheme now re-exports from ThemeContext, so tests use ThemeProvider wrapper
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ThemeProvider } from "../context/ThemeContext";
import useTheme from "./useTheme";

// Wrapper component for hooks that need ThemeProvider
const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

describe("useTheme", () => {
  beforeEach(() => {
    // Reset localStorage mock
    window.localStorage.getItem.mockClear();
    window.localStorage.setItem.mockClear();
    window.localStorage.store = {};

    // Reset document classes
    document.documentElement.classList.remove("dark-mode");
    document.body.classList.remove("dark-mode");

    // Reset matchMedia mock
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    // Clean up document classes
    document.documentElement.classList.remove("dark-mode");
    document.body.classList.remove("dark-mode");
  });

  // ============================================
  // Initial State Tests
  // ============================================
  describe("initial state", () => {
    it("provides all expected properties and methods", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current).toHaveProperty("darkMode");
      expect(result.current).toHaveProperty("isDark");
      expect(result.current).toHaveProperty("isLight");
      expect(typeof result.current.toggleDarkMode).toBe("function");
      expect(typeof result.current.setTheme).toBe("function");
    });

    it("defaults to light mode when no stored preference and system prefers light", () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.darkMode).toBe(false);
      expect(result.current.isDark).toBe(false);
      expect(result.current.isLight).toBe(true);
    });

    it("respects system dark mode preference when no stored preference", () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.darkMode).toBe(true);
      expect(result.current.isDark).toBe(true);
      expect(result.current.isLight).toBe(false);
    });

    it("uses stored dark mode preference over system preference", () => {
      window.localStorage.store.darkMode = "true";
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.darkMode).toBe(true);
    });

    it("uses stored light mode preference over system preference", () => {
      window.localStorage.store.darkMode = "false";
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.darkMode).toBe(false);
    });
  });

  // ============================================
  // Toggle Tests
  // ============================================
  describe("toggleDarkMode", () => {
    it("toggles from light to dark mode", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.darkMode).toBe(false);

      act(() => {
        result.current.toggleDarkMode();
      });

      expect(result.current.darkMode).toBe(true);
    });

    it("toggles from dark to light mode", () => {
      window.localStorage.store.darkMode = "true";
      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.darkMode).toBe(true);

      act(() => {
        result.current.toggleDarkMode();
      });

      expect(result.current.darkMode).toBe(false);
    });

    it("toggles multiple times correctly", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.darkMode).toBe(false);

      act(() => {
        result.current.toggleDarkMode();
      });
      expect(result.current.darkMode).toBe(true);

      act(() => {
        result.current.toggleDarkMode();
      });
      expect(result.current.darkMode).toBe(false);

      act(() => {
        result.current.toggleDarkMode();
      });
      expect(result.current.darkMode).toBe(true);
    });
  });

  // ============================================
  // setTheme Tests
  // ============================================
  describe("setTheme", () => {
    it("sets dark mode to true", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme(true);
      });

      expect(result.current.darkMode).toBe(true);
    });

    it("sets dark mode to false", () => {
      window.localStorage.store.darkMode = "true";
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme(false);
      });

      expect(result.current.darkMode).toBe(false);
    });

    it("can set the same value without error", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme(false);
      });

      expect(result.current.darkMode).toBe(false);

      act(() => {
        result.current.setTheme(false);
      });

      expect(result.current.darkMode).toBe(false);
    });

    it("handles boolean-like truthy values", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme(1);
      });

      expect(result.current.darkMode).toBe(true);
    });

    it("handles boolean-like falsy values", () => {
      window.localStorage.store.darkMode = "true";
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme(0);
      });

      expect(result.current.darkMode).toBe(false);
    });
  });

  // ============================================
  // localStorage Persistence Tests
  // ============================================
  describe("localStorage persistence", () => {
    it("saves dark mode preference to localStorage", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme(true);
      });

      expect(window.localStorage.store.darkMode).toBe("true");
    });

    it("saves light mode preference to localStorage", () => {
      window.localStorage.store.darkMode = "true";
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme(false);
      });

      expect(window.localStorage.store.darkMode).toBe("false");
    });

    it("saves preference on toggle", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.toggleDarkMode();
      });

      expect(window.localStorage.store.darkMode).toBe("true");

      act(() => {
        result.current.toggleDarkMode();
      });

      expect(window.localStorage.store.darkMode).toBe("false");
    });

    it("reads darkMode from localStorage on initialization", () => {
      window.localStorage.store.darkMode = "true";

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.darkMode).toBe(true);
    });
  });

  // ============================================
  // DOM Class Manipulation Tests
  // ============================================
  describe("DOM class manipulation", () => {
    it("adds dark-mode class to documentElement when dark mode is enabled", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme(true);
      });

      expect(document.documentElement.classList.contains("dark-mode")).toBe(true);
    });

    it("adds dark-mode class to body when dark mode is enabled", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme(true);
      });

      expect(document.body.classList.contains("dark-mode")).toBe(true);
    });

    it("removes dark-mode class from documentElement when light mode is enabled", () => {
      document.documentElement.classList.add("dark-mode");
      window.localStorage.store.darkMode = "true";

      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme(false);
      });

      expect(document.documentElement.classList.contains("dark-mode")).toBe(false);
    });

    it("removes dark-mode class from body when light mode is enabled", () => {
      document.body.classList.add("dark-mode");
      window.localStorage.store.darkMode = "true";

      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme(false);
      });

      expect(document.body.classList.contains("dark-mode")).toBe(false);
    });

    it("updates DOM classes on toggle", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(document.documentElement.classList.contains("dark-mode")).toBe(false);
      expect(document.body.classList.contains("dark-mode")).toBe(false);

      act(() => {
        result.current.toggleDarkMode();
      });

      expect(document.documentElement.classList.contains("dark-mode")).toBe(true);
      expect(document.body.classList.contains("dark-mode")).toBe(true);

      act(() => {
        result.current.toggleDarkMode();
      });

      expect(document.documentElement.classList.contains("dark-mode")).toBe(false);
      expect(document.body.classList.contains("dark-mode")).toBe(false);
    });

    it("sets initial DOM classes based on stored preference", () => {
      window.localStorage.store.darkMode = "true";

      renderHook(() => useTheme(), { wrapper });

      expect(document.documentElement.classList.contains("dark-mode")).toBe(true);
      expect(document.body.classList.contains("dark-mode")).toBe(true);
    });
  });

  // ============================================
  // isDark and isLight Computed Properties Tests
  // ============================================
  describe("isDark and isLight computed properties", () => {
    it("isDark mirrors darkMode state", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.isDark).toBe(false);

      act(() => {
        result.current.setTheme(true);
      });

      expect(result.current.isDark).toBe(true);
    });

    it("isLight is opposite of darkMode state", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.isLight).toBe(true);

      act(() => {
        result.current.setTheme(true);
      });

      expect(result.current.isLight).toBe(false);
    });

    it("isDark and isLight are always opposite", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.isDark).not.toBe(result.current.isLight);

      act(() => {
        result.current.toggleDarkMode();
      });

      expect(result.current.isDark).not.toBe(result.current.isLight);

      act(() => {
        result.current.toggleDarkMode();
      });

      expect(result.current.isDark).not.toBe(result.current.isLight);
    });
  });

  // ============================================
  // Function Reference Stability Tests
  // ============================================
  describe("function reference stability (useCallback)", () => {
    it("toggleDarkMode maintains stable reference across renders", () => {
      const { result, rerender } = renderHook(() => useTheme(), { wrapper });
      const firstRef = result.current.toggleDarkMode;

      rerender();

      expect(result.current.toggleDarkMode).toBe(firstRef);
    });

    it("setTheme maintains stable reference across renders", () => {
      const { result, rerender } = renderHook(() => useTheme(), { wrapper });
      const firstRef = result.current.setTheme;

      rerender();

      expect(result.current.setTheme).toBe(firstRef);
    });

    it("functions remain stable after state changes", () => {
      const { result, rerender } = renderHook(() => useTheme(), { wrapper });
      const toggleRef = result.current.toggleDarkMode;
      const setThemeRef = result.current.setTheme;

      act(() => {
        result.current.toggleDarkMode();
      });
      rerender();

      expect(result.current.toggleDarkMode).toBe(toggleRef);
      expect(result.current.setTheme).toBe(setThemeRef);
    });
  });

  // ============================================
  // Edge Cases Tests
  // ============================================
  describe("edge cases", () => {
    it("handles rapid toggles", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.toggleDarkMode();
        }
      });

      expect(result.current.darkMode).toBe(false);
    });

    it("handles setTheme called multiple times in sequence", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme(true);
        result.current.setTheme(false);
        result.current.setTheme(true);
        result.current.setTheme(false);
      });

      expect(result.current.darkMode).toBe(false);
    });

    it("handles invalid localStorage value gracefully", () => {
      window.localStorage.store.darkMode = "not a boolean";

      const { result } = renderHook(() => useTheme(), { wrapper });

      // Should fall back to false when value is not "true"
      expect(result.current.darkMode).toBe(false);
    });

    it("handles empty string in localStorage", () => {
      window.localStorage.store.darkMode = "";

      const { result } = renderHook(() => useTheme(), { wrapper });

      // Empty string is not "true", so should be false
      expect(result.current.darkMode).toBe(false);
    });
  });

  // ============================================
  // Real-World Usage Scenarios Tests
  // ============================================
  describe("real-world usage scenarios", () => {
    it("handles user toggling theme multiple times during session", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.darkMode).toBe(false);

      act(() => {
        result.current.toggleDarkMode();
      });
      expect(result.current.darkMode).toBe(true);
      expect(window.localStorage.store.darkMode).toBe("true");

      act(() => {
        result.current.toggleDarkMode();
      });
      expect(result.current.darkMode).toBe(false);
      expect(window.localStorage.store.darkMode).toBe("false");

      act(() => {
        result.current.toggleDarkMode();
      });
      expect(result.current.darkMode).toBe(true);
      expect(window.localStorage.store.darkMode).toBe("true");
    });

    it("handles programmatic theme setting (e.g., from settings modal)", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme(true);
      });
      expect(result.current.darkMode).toBe(true);
      expect(window.localStorage.store.darkMode).toBe("true");

      act(() => {
        result.current.setTheme(false);
      });
      expect(result.current.darkMode).toBe(false);
      expect(window.localStorage.store.darkMode).toBe("false");
    });

    it("persists theme preference across page reloads (simulated)", () => {
      const { result: session1, unmount: unmount1 } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        session1.current.setTheme(true);
      });
      expect(session1.current.darkMode).toBe(true);

      unmount1();

      // New hook instance should read from localStorage
      const { result: session2 } = renderHook(() => useTheme(), { wrapper });

      expect(session2.current.darkMode).toBe(true);
    });
  });

  // ============================================
  // System Preference Integration Tests
  // ============================================
  describe("system preference integration", () => {
    it("uses system preference when localStorage is empty", () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.darkMode).toBe(true);
    });

    it("user preference in localStorage overrides system preference", () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      window.localStorage.store.darkMode = "false";

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.darkMode).toBe(false);
    });

    it("handles system preference for light mode", () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.darkMode).toBe(false);
    });
  });

  // ============================================
  // Context Error Tests
  // ============================================
  describe("context requirement", () => {
    it("throws error when used outside of ThemeProvider", () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        renderHook(() => useTheme());
      }).toThrow("useThemeContext must be used within a ThemeProvider");

      consoleSpy.mockRestore();
    });
  });
});
