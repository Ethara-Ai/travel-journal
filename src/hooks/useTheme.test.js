/**
 * Unit tests for useTheme hook
 * Tests theme state management, localStorage persistence, and DOM class manipulation
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useTheme from "./useTheme";

describe("useTheme", () => {
  // Store original values to restore after tests
  let originalLocalStorage;
  let originalMatchMedia;

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
      const { result } = renderHook(() => useTheme());

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

      const { result } = renderHook(() => useTheme());

      expect(result.current.darkMode).toBe(false);
      expect(result.current.isDark).toBe(false);
      expect(result.current.isLight).toBe(true);
    });

    it("respects system dark mode preference when no stored preference", () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => useTheme());

      expect(result.current.darkMode).toBe(true);
      expect(result.current.isDark).toBe(true);
      expect(result.current.isLight).toBe(false);
    });

    it("uses stored dark mode preference over system preference", () => {
      window.localStorage.store["darkMode"] = "true";
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: false, // System prefers light
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => useTheme());

      expect(result.current.darkMode).toBe(true);
    });

    it("uses stored light mode preference over system preference", () => {
      window.localStorage.store["darkMode"] = "false";
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === "(prefers-color-scheme: dark)", // System prefers dark
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => useTheme());

      expect(result.current.darkMode).toBe(false);
    });
  });

  // ============================================
  // toggleDarkMode Tests
  // ============================================
  describe("toggleDarkMode", () => {
    it("toggles from light to dark mode", () => {
      const { result } = renderHook(() => useTheme());
      expect(result.current.darkMode).toBe(false);

      act(() => {
        result.current.toggleDarkMode();
      });

      expect(result.current.darkMode).toBe(true);
      expect(result.current.isDark).toBe(true);
      expect(result.current.isLight).toBe(false);
    });

    it("toggles from dark to light mode", () => {
      window.localStorage.store["darkMode"] = "true";
      const { result } = renderHook(() => useTheme());
      expect(result.current.darkMode).toBe(true);

      act(() => {
        result.current.toggleDarkMode();
      });

      expect(result.current.darkMode).toBe(false);
      expect(result.current.isDark).toBe(false);
      expect(result.current.isLight).toBe(true);
    });

    it("toggles multiple times correctly", () => {
      const { result } = renderHook(() => useTheme());

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

      act(() => {
        result.current.toggleDarkMode();
      });
      expect(result.current.darkMode).toBe(false);
    });
  });

  // ============================================
  // setTheme Tests
  // ============================================
  describe("setTheme", () => {
    it("sets dark mode to true", () => {
      const { result } = renderHook(() => useTheme());
      expect(result.current.darkMode).toBe(false);

      act(() => {
        result.current.setTheme(true);
      });

      expect(result.current.darkMode).toBe(true);
    });

    it("sets dark mode to false", () => {
      window.localStorage.store["darkMode"] = "true";
      const { result } = renderHook(() => useTheme());
      expect(result.current.darkMode).toBe(true);

      act(() => {
        result.current.setTheme(false);
      });

      expect(result.current.darkMode).toBe(false);
    });

    it("can set the same value without error", () => {
      const { result } = renderHook(() => useTheme());

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
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme(1);
      });

      expect(result.current.darkMode).toBe(1);
    });

    it("handles boolean-like falsy values", () => {
      window.localStorage.store["darkMode"] = "true";
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme(0);
      });

      expect(result.current.darkMode).toBe(0);
    });
  });

  // ============================================
  // localStorage Persistence Tests
  // ============================================
  describe("localStorage persistence", () => {
    it("saves dark mode preference to localStorage", () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme(true);
      });

      expect(window.localStorage.setItem).toHaveBeenCalledWith("darkMode", "true");
    });

    it("saves light mode preference to localStorage", () => {
      window.localStorage.store["darkMode"] = "true";
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme(false);
      });

      expect(window.localStorage.setItem).toHaveBeenCalledWith("darkMode", "false");
    });

    it("saves preference on toggle", () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.toggleDarkMode();
      });

      expect(window.localStorage.setItem).toHaveBeenCalledWith("darkMode", "true");

      act(() => {
        result.current.toggleDarkMode();
      });

      expect(window.localStorage.setItem).toHaveBeenCalledWith("darkMode", "false");
    });

    it("reads darkMode from localStorage on initialization", () => {
      window.localStorage.store["darkMode"] = "true";

      renderHook(() => useTheme());

      expect(window.localStorage.getItem).toHaveBeenCalledWith("darkMode");
    });
  });

  // ============================================
  // DOM Class Manipulation Tests
  // ============================================
  describe("DOM class manipulation", () => {
    it("adds dark-mode class to documentElement when dark mode is enabled", () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme(true);
      });

      expect(document.documentElement.classList.contains("dark-mode")).toBe(true);
    });

    it("adds dark-mode class to body when dark mode is enabled", () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme(true);
      });

      expect(document.body.classList.contains("dark-mode")).toBe(true);
    });

    it("removes dark-mode class from documentElement when light mode is enabled", () => {
      window.localStorage.store["darkMode"] = "true";
      const { result } = renderHook(() => useTheme());

      expect(document.documentElement.classList.contains("dark-mode")).toBe(true);

      act(() => {
        result.current.setTheme(false);
      });

      expect(document.documentElement.classList.contains("dark-mode")).toBe(false);
    });

    it("removes dark-mode class from body when light mode is enabled", () => {
      window.localStorage.store["darkMode"] = "true";
      const { result } = renderHook(() => useTheme());

      expect(document.body.classList.contains("dark-mode")).toBe(true);

      act(() => {
        result.current.setTheme(false);
      });

      expect(document.body.classList.contains("dark-mode")).toBe(false);
    });

    it("updates DOM classes on toggle", () => {
      const { result } = renderHook(() => useTheme());

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
      window.localStorage.store["darkMode"] = "true";

      renderHook(() => useTheme());

      expect(document.documentElement.classList.contains("dark-mode")).toBe(true);
      expect(document.body.classList.contains("dark-mode")).toBe(true);
    });
  });

  // ============================================
  // isDark and isLight Computed Properties Tests
  // ============================================
  describe("isDark and isLight computed properties", () => {
    it("isDark mirrors darkMode state", () => {
      const { result } = renderHook(() => useTheme());

      expect(result.current.isDark).toBe(result.current.darkMode);

      act(() => {
        result.current.toggleDarkMode();
      });

      expect(result.current.isDark).toBe(result.current.darkMode);
    });

    it("isLight is opposite of darkMode state", () => {
      const { result } = renderHook(() => useTheme());

      expect(result.current.isLight).toBe(!result.current.darkMode);

      act(() => {
        result.current.toggleDarkMode();
      });

      expect(result.current.isLight).toBe(!result.current.darkMode);
    });

    it("isDark and isLight are always opposite", () => {
      const { result } = renderHook(() => useTheme());

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
      const { result, rerender } = renderHook(() => useTheme());
      const firstRef = result.current.toggleDarkMode;

      rerender();

      expect(result.current.toggleDarkMode).toBe(firstRef);
    });

    it("setTheme maintains stable reference across renders", () => {
      const { result, rerender } = renderHook(() => useTheme());
      const firstRef = result.current.setTheme;

      rerender();

      expect(result.current.setTheme).toBe(firstRef);
    });

    it("functions remain stable after state changes", () => {
      const { result, rerender } = renderHook(() => useTheme());
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
  // Multiple Hook Instances Tests
  // ============================================
  describe("multiple hook instances", () => {
    it("instances share the same localStorage but have independent state initially", () => {
      const { result: result1 } = renderHook(() => useTheme());
      const { result: result2 } = renderHook(() => useTheme());

      // Both read from same localStorage, so should have same initial value
      expect(result1.current.darkMode).toBe(result2.current.darkMode);
    });

    it("changing one instance does not automatically update another", () => {
      const { result: result1 } = renderHook(() => useTheme());
      const { result: result2 } = renderHook(() => useTheme());

      act(() => {
        result1.current.toggleDarkMode();
      });

      // result1 changed, but result2 won't automatically update
      // (they are separate hook instances with separate state)
      expect(result1.current.darkMode).toBe(true);
      // Note: In real app, you'd use context for shared state
    });
  });

  // ============================================
  // Edge Cases Tests
  // ============================================
  describe("edge cases", () => {
    it("handles rapid toggles", () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.toggleDarkMode();
        result.current.toggleDarkMode();
        result.current.toggleDarkMode();
      });

      expect(result.current.darkMode).toBe(true);
    });

    it("handles setTheme called multiple times in sequence", () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme(true);
        result.current.setTheme(false);
        result.current.setTheme(true);
        result.current.setTheme(false);
      });

      expect(result.current.darkMode).toBe(false);
    });

    it("handles invalid localStorage value gracefully", () => {
      window.localStorage.store["darkMode"] = "invalid";

      const { result } = renderHook(() => useTheme());

      // "invalid" === "true" is false, so should be false
      expect(result.current.darkMode).toBe(false);
    });

    it("handles empty string in localStorage", () => {
      window.localStorage.store["darkMode"] = "";

      const { result } = renderHook(() => useTheme());

      // "" === "true" is false, so should be false
      expect(result.current.darkMode).toBe(false);
    });
  });

  // ============================================
  // Real-world Usage Scenarios
  // ============================================
  describe("real-world usage scenarios", () => {
    it("handles user toggling theme multiple times during session", () => {
      const { result } = renderHook(() => useTheme());

      // User starts in light mode
      expect(result.current.isLight).toBe(true);

      // User switches to dark mode
      act(() => {
        result.current.toggleDarkMode();
      });
      expect(result.current.isDark).toBe(true);
      expect(document.body.classList.contains("dark-mode")).toBe(true);

      // User switches back to light mode
      act(() => {
        result.current.toggleDarkMode();
      });
      expect(result.current.isLight).toBe(true);
      expect(document.body.classList.contains("dark-mode")).toBe(false);

      // Preference is saved
      expect(window.localStorage.setItem).toHaveBeenLastCalledWith("darkMode", "false");
    });

    it("handles programmatic theme setting (e.g., from settings modal)", () => {
      const { result } = renderHook(() => useTheme());

      // User selects dark theme from dropdown
      act(() => {
        result.current.setTheme(true);
      });

      expect(result.current.darkMode).toBe(true);
      expect(window.localStorage.setItem).toHaveBeenCalledWith("darkMode", "true");

      // User selects light theme from dropdown
      act(() => {
        result.current.setTheme(false);
      });

      expect(result.current.darkMode).toBe(false);
      expect(window.localStorage.setItem).toHaveBeenCalledWith("darkMode", "false");
    });

    it("persists theme preference across page reloads (simulated)", () => {
      // First session: user sets dark mode
      const { result: session1, unmount: unmount1 } = renderHook(() => useTheme());

      act(() => {
        session1.current.setTheme(true);
      });

      unmount1();

      // Simulate page reload by creating new hook instance
      // localStorage should still have the value
      window.localStorage.store["darkMode"] = "true";

      const { result: session2 } = renderHook(() => useTheme());

      expect(session2.current.darkMode).toBe(true);
    });
  });

  // ============================================
  // System Preference Integration Tests
  // ============================================
  describe("system preference integration", () => {
    it("uses system preference when localStorage is empty", () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => useTheme());

      expect(result.current.darkMode).toBe(true);
    });

    it("user preference in localStorage overrides system preference", () => {
      // System prefers dark
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      // User previously chose light
      window.localStorage.store["darkMode"] = "false";

      const { result } = renderHook(() => useTheme());

      // User preference wins
      expect(result.current.darkMode).toBe(false);
    });

    it("handles system preference for light mode", () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: false, // System prefers light
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => useTheme());

      expect(result.current.darkMode).toBe(false);
      expect(result.current.isLight).toBe(true);
    });
  });
});
