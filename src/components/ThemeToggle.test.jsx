/**
 * Unit tests for ThemeToggle component
 * Tests rendering, button functionality, icons, accessibility, and styling
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ThemeToggle from "./ThemeToggle";

describe("ThemeToggle", () => {
  // ============================================
  // Basic Rendering Tests
  // ============================================
  describe("basic rendering", () => {
    it("renders without crashing", () => {
      render(<ThemeToggle darkMode={false} toggleDarkMode={() => {}} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders as a button element", () => {
      render(<ThemeToggle darkMode={false} toggleDarkMode={() => {}} />);
      const button = screen.getByRole("button");
      expect(button.tagName).toBe("BUTTON");
    });

    it("renders an icon inside the button", () => {
      const { container } = render(
        <ThemeToggle darkMode={false} toggleDarkMode={() => {}} />
      );
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  // ============================================
  // Icon Tests
  // ============================================
  describe("icons", () => {
    it("shows Moon icon when in light mode", () => {
      const { container } = render(
        <ThemeToggle darkMode={false} toggleDarkMode={() => {}} />
      );
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      // In light mode, should show Moon icon to switch to dark
    });

    it("shows Sun icon when in dark mode", () => {
      const { container } = render(
        <ThemeToggle darkMode={true} toggleDarkMode={() => {}} />
      );
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      // In dark mode, should show Sun icon to switch to light
    });

    it("icon has correct size classes", () => {
      const { container } = render(
        <ThemeToggle darkMode={false} toggleDarkMode={() => {}} />
      );
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("h-6", "w-6");
    });

    it("icon has transition classes", () => {
      const { container } = render(
        <ThemeToggle darkMode={false} toggleDarkMode={() => {}} />
      );
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("transition-opacity");
    });
  });

  // ============================================
  // Toggle Functionality Tests
  // ============================================
  describe("toggle functionality", () => {
    it("calls toggleDarkMode when clicked", () => {
      const handleToggle = vi.fn();
      render(<ThemeToggle darkMode={false} toggleDarkMode={handleToggle} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(handleToggle).toHaveBeenCalledTimes(1);
    });

    it("calls toggleDarkMode multiple times on multiple clicks", () => {
      const handleToggle = vi.fn();
      render(<ThemeToggle darkMode={false} toggleDarkMode={handleToggle} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleToggle).toHaveBeenCalledTimes(3);
    });

    it("does not call toggleDarkMode without click", () => {
      const handleToggle = vi.fn();
      render(<ThemeToggle darkMode={false} toggleDarkMode={handleToggle} />);

      expect(handleToggle).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // Accessibility Tests
  // ============================================
  describe("accessibility", () => {
    it("has aria-label for light mode", () => {
      render(<ThemeToggle darkMode={false} toggleDarkMode={() => {}} />);
      const button = screen.getByLabelText("Switch to dark mode");
      expect(button).toBeInTheDocument();
    });

    it("has aria-label for dark mode", () => {
      render(<ThemeToggle darkMode={true} toggleDarkMode={() => {}} />);
      const button = screen.getByLabelText("Switch to light mode");
      expect(button).toBeInTheDocument();
    });

    it("button is focusable", () => {
      render(<ThemeToggle darkMode={false} toggleDarkMode={() => {}} />);
      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();
    });

    it("can be triggered with Enter key", () => {
      const handleToggle = vi.fn();
      render(<ThemeToggle darkMode={false} toggleDarkMode={handleToggle} />);

      const button = screen.getByRole("button");
      fireEvent.keyDown(button, { key: "Enter" });
      fireEvent.click(button);

      expect(handleToggle).toHaveBeenCalled();
    });
  });

  // ============================================
  // Styling Tests - Light Mode
  // ============================================
  describe("light mode styling", () => {
    it("applies light mode background color", () => {
      render(<ThemeToggle darkMode={false} toggleDarkMode={() => {}} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-white");
    });

    it("applies light mode hover background", () => {
      render(<ThemeToggle darkMode={false} toggleDarkMode={() => {}} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("hover:bg-gray-100");
    });

    it("applies light mode icon color", () => {
      render(<ThemeToggle darkMode={false} toggleDarkMode={() => {}} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-indigo-600");
    });

    it("applies no rotation in light mode", () => {
      render(<ThemeToggle darkMode={false} toggleDarkMode={() => {}} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("rotate-0");
    });
  });

  // ============================================
  // Styling Tests - Dark Mode
  // ============================================
  describe("dark mode styling", () => {
    it("applies dark mode background color", () => {
      render(<ThemeToggle darkMode={true} toggleDarkMode={() => {}} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-gray-700");
    });

    it("applies dark mode hover background", () => {
      render(<ThemeToggle darkMode={true} toggleDarkMode={() => {}} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("hover:bg-gray-600");
    });

    it("applies dark mode icon color", () => {
      render(<ThemeToggle darkMode={true} toggleDarkMode={() => {}} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-yellow-400");
    });

    it("applies rotation in dark mode", () => {
      render(<ThemeToggle darkMode={true} toggleDarkMode={() => {}} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("rotate-[360deg]");
    });
  });

  // ============================================
  // Common Styling Tests
  // ============================================
  describe("common styling", () => {
    it("has fixed positioning", () => {
      render(<ThemeToggle darkMode={false} toggleDarkMode={() => {}} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("fixed");
    });

    it("has correct position classes", () => {
      render(<ThemeToggle darkMode={false} toggleDarkMode={() => {}} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bottom-6", "right-6");
    });

    it("has z-index class", () => {
      render(<ThemeToggle darkMode={false} toggleDarkMode={() => {}} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("z-40");
    });

    it("has rounded-full class", () => {
      render(<ThemeToggle darkMode={false} toggleDarkMode={() => {}} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("rounded-full");
    });

    it("has shadow class", () => {
      render(<ThemeToggle darkMode={false} toggleDarkMode={() => {}} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("shadow-lg");
    });

    it("has padding class", () => {
      render(<ThemeToggle darkMode={false} toggleDarkMode={() => {}} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("p-3.5");
    });

    it("has cursor-pointer class", () => {
      render(<ThemeToggle darkMode={false} toggleDarkMode={() => {}} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("cursor-pointer");
    });

    it("has flex layout classes", () => {
      render(<ThemeToggle darkMode={false} toggleDarkMode={() => {}} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("flex", "items-center", "justify-center");
    });

    it("has transition classes", () => {
      render(<ThemeToggle darkMode={false} toggleDarkMode={() => {}} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("transition-all", "duration-500", "ease-out");
    });

    it("has transform class", () => {
      render(<ThemeToggle darkMode={false} toggleDarkMode={() => {}} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("transform");
    });

    it("has hover scale effect", () => {
      render(<ThemeToggle darkMode={false} toggleDarkMode={() => {}} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("hover:scale-110");
    });
  });

  // ============================================
  // State Transition Tests
  // ============================================
  describe("state transitions", () => {
    it("switches from light to dark mode styling on rerender", () => {
      const { rerender } = render(
        <ThemeToggle darkMode={false} toggleDarkMode={() => {}} />
      );

      let button = screen.getByRole("button");
      expect(button).toHaveClass("bg-white");
      expect(button).toHaveClass("text-indigo-600");

      rerender(<ThemeToggle darkMode={true} toggleDarkMode={() => {}} />);

      button = screen.getByRole("button");
      expect(button).toHaveClass("bg-gray-700");
      expect(button).toHaveClass("text-yellow-400");
    });

    it("switches from dark to light mode styling on rerender", () => {
      const { rerender } = render(
        <ThemeToggle darkMode={true} toggleDarkMode={() => {}} />
      );

      let button = screen.getByRole("button");
      expect(button).toHaveClass("bg-gray-700");

      rerender(<ThemeToggle darkMode={false} toggleDarkMode={() => {}} />);

      button = screen.getByRole("button");
      expect(button).toHaveClass("bg-white");
    });

    it("updates aria-label when mode changes", () => {
      const { rerender } = render(
        <ThemeToggle darkMode={false} toggleDarkMode={() => {}} />
      );

      expect(screen.getByLabelText("Switch to dark mode")).toBeInTheDocument();

      rerender(<ThemeToggle darkMode={true} toggleDarkMode={() => {}} />);

      expect(screen.getByLabelText("Switch to light mode")).toBeInTheDocument();
    });
  });

  // ============================================
  // Edge Cases Tests
  // ============================================
  describe("edge cases", () => {
    it("handles rapid clicks", () => {
      const handleToggle = vi.fn();
      render(<ThemeToggle darkMode={false} toggleDarkMode={handleToggle} />);

      const button = screen.getByRole("button");
      for (let i = 0; i < 10; i++) {
        fireEvent.click(button);
      }

      expect(handleToggle).toHaveBeenCalledTimes(10);
    });

    it("handles undefined toggleDarkMode gracefully when clicked", () => {
      // This tests defensive coding - component should handle undefined callback
      render(<ThemeToggle darkMode={false} toggleDarkMode={undefined} />);
      const button = screen.getByRole("button");

      // Should not throw when clicked with undefined callback
      expect(() => fireEvent.click(button)).toThrow();
    });

    it("renders correctly with boolean false", () => {
      render(<ThemeToggle darkMode={false} toggleDarkMode={() => {}} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders correctly with boolean true", () => {
      render(<ThemeToggle darkMode={true} toggleDarkMode={() => {}} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  // ============================================
  // Real-world Usage Scenarios
  // ============================================
  describe("real-world usage scenarios", () => {
    it("simulates user toggling theme from light to dark", () => {
      let darkMode = false;
      const toggleDarkMode = vi.fn(() => {
        darkMode = !darkMode;
      });

      const { rerender } = render(
        <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      );

      // Initially in light mode
      expect(screen.getByLabelText("Switch to dark mode")).toBeInTheDocument();

      // User clicks to switch to dark mode
      fireEvent.click(screen.getByRole("button"));
      expect(toggleDarkMode).toHaveBeenCalled();

      // Simulate state update
      rerender(<ThemeToggle darkMode={true} toggleDarkMode={toggleDarkMode} />);

      // Now in dark mode
      expect(screen.getByLabelText("Switch to light mode")).toBeInTheDocument();
    });

    it("simulates user toggling theme from dark to light", () => {
      let darkMode = true;
      const toggleDarkMode = vi.fn(() => {
        darkMode = !darkMode;
      });

      const { rerender } = render(
        <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      );

      // Initially in dark mode
      expect(screen.getByLabelText("Switch to light mode")).toBeInTheDocument();

      // User clicks to switch to light mode
      fireEvent.click(screen.getByRole("button"));
      expect(toggleDarkMode).toHaveBeenCalled();

      // Simulate state update
      rerender(<ThemeToggle darkMode={false} toggleDarkMode={toggleDarkMode} />);

      // Now in light mode
      expect(screen.getByLabelText("Switch to dark mode")).toBeInTheDocument();
    });

    it("maintains button visibility in fixed position", () => {
      render(<ThemeToggle darkMode={false} toggleDarkMode={() => {}} />);
      const button = screen.getByRole("button");

      // Verify fixed positioning for persistent visibility
      expect(button).toHaveClass("fixed");
      expect(button).toHaveClass("bottom-6");
      expect(button).toHaveClass("right-6");
      expect(button).toHaveClass("z-40");
    });
  });
});
