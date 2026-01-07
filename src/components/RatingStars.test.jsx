/**
 * Unit tests for RatingStars component
 * Tests rendering, interactivity, accessibility, and styling
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RatingStars from "./RatingStars";

describe("RatingStars", () => {
  // ============================================
  // Basic Rendering Tests
  // ============================================
  describe("basic rendering", () => {
    it("renders 5 stars in non-interactive mode", () => {
      const { container } = render(<RatingStars rating={3} />);
      const stars = container.querySelectorAll("svg");
      expect(stars).toHaveLength(5);
    });

    it("renders 5 stars in interactive mode", () => {
      render(<RatingStars rating={3} interactive={true} onRate={vi.fn()} />);
      const buttons = screen.getAllByRole("radio");
      expect(buttons).toHaveLength(5);
    });

    it("renders container with flex layout", () => {
      const { container } = render(<RatingStars rating={3} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("flex", "items-center");
    });

    it("renders without crashing with minimal props", () => {
      const { container } = render(<RatingStars rating={0} />);
      const stars = container.querySelectorAll("svg");
      expect(stars).toHaveLength(5);
    });

    it("renders with all props provided", () => {
      const onRate = vi.fn();
      const { container } = render(
        <RatingStars rating={4} darkMode={true} onRate={onRate} interactive={true} size="h-6 w-6" />,
      );
      expect(container.querySelectorAll("svg")).toHaveLength(5);
    });
  });

  // ============================================
  // Rating Display Tests
  // ============================================
  describe("rating display", () => {
    it("displays 0 filled stars for rating 0", () => {
      const { container } = render(<RatingStars rating={0} />);
      const filledStars = container.querySelectorAll(".fill-yellow-500");
      expect(filledStars).toHaveLength(0);
    });

    it("displays 1 filled star for rating 1", () => {
      const { container } = render(<RatingStars rating={1} />);
      const filledStars = container.querySelectorAll(".fill-yellow-500");
      expect(filledStars).toHaveLength(1);
    });

    it("displays 2 filled stars for rating 2", () => {
      const { container } = render(<RatingStars rating={2} />);
      const filledStars = container.querySelectorAll(".fill-yellow-500");
      expect(filledStars).toHaveLength(2);
    });

    it("displays 3 filled stars for rating 3", () => {
      const { container } = render(<RatingStars rating={3} />);
      const filledStars = container.querySelectorAll(".fill-yellow-500");
      expect(filledStars).toHaveLength(3);
    });

    it("displays 4 filled stars for rating 4", () => {
      const { container } = render(<RatingStars rating={4} />);
      const filledStars = container.querySelectorAll(".fill-yellow-500");
      expect(filledStars).toHaveLength(4);
    });

    it("displays 5 filled stars for rating 5", () => {
      const { container } = render(<RatingStars rating={5} />);
      const filledStars = container.querySelectorAll(".fill-yellow-500");
      expect(filledStars).toHaveLength(5);
    });

    it("displays correct number of empty stars", () => {
      const { container } = render(<RatingStars rating={2} />);
      const emptyStars = container.querySelectorAll(".fill-gray-300");
      expect(emptyStars).toHaveLength(3);
    });

    it("handles rating greater than 5 by filling all stars", () => {
      const { container } = render(<RatingStars rating={10} />);
      const filledStars = container.querySelectorAll(".fill-yellow-500");
      expect(filledStars).toHaveLength(5);
    });

    it("handles negative rating by showing no filled stars", () => {
      const { container } = render(<RatingStars rating={-1} />);
      const filledStars = container.querySelectorAll(".fill-yellow-500");
      expect(filledStars).toHaveLength(0);
    });
  });

  // ============================================
  // Dark Mode Tests
  // ============================================
  describe("dark mode", () => {
    it("applies dark mode filled star colors", () => {
      const { container } = render(<RatingStars rating={3} darkMode={true} />);
      const filledStars = container.querySelectorAll(".fill-yellow-400");
      expect(filledStars).toHaveLength(3);
    });

    it("applies dark mode empty star colors", () => {
      const { container } = render(<RatingStars rating={2} darkMode={true} />);
      const emptyStars = container.querySelectorAll(".fill-gray-600");
      expect(emptyStars).toHaveLength(3);
    });

    it("applies light mode filled star colors when darkMode is false", () => {
      const { container } = render(<RatingStars rating={3} darkMode={false} />);
      const filledStars = container.querySelectorAll(".fill-yellow-500");
      expect(filledStars).toHaveLength(3);
    });

    it("applies light mode empty star colors when darkMode is false", () => {
      const { container } = render(<RatingStars rating={2} darkMode={false} />);
      const emptyStars = container.querySelectorAll(".fill-gray-300");
      expect(emptyStars).toHaveLength(3);
    });

    it("defaults to light mode when darkMode is undefined", () => {
      const { container } = render(<RatingStars rating={3} />);
      const filledStars = container.querySelectorAll(".fill-yellow-500");
      expect(filledStars).toHaveLength(3);
    });
  });

  // ============================================
  // Interactive Mode Tests
  // ============================================
  describe("interactive mode", () => {
    it("does not render buttons when interactive is false", () => {
      render(<RatingStars rating={3} interactive={false} />);
      const buttons = screen.queryAllByRole("radio");
      expect(buttons).toHaveLength(0);
    });

    it("renders buttons when interactive is true", () => {
      render(<RatingStars rating={3} interactive={true} onRate={vi.fn()} />);
      const buttons = screen.getAllByRole("radio");
      expect(buttons).toHaveLength(5);
    });

    it("applies cursor-pointer when interactive", () => {
      const { container } = render(<RatingStars rating={3} interactive={true} onRate={vi.fn()} />);
      const stars = container.querySelectorAll(".cursor-pointer");
      expect(stars).toHaveLength(5);
    });

    it("applies hover scale transform when interactive", () => {
      const { container } = render(<RatingStars rating={3} interactive={true} onRate={vi.fn()} />);
      const stars = container.querySelectorAll(".hover\\:scale-110");
      expect(stars).toHaveLength(5);
    });

    it("defaults to non-interactive mode", () => {
      render(<RatingStars rating={3} />);
      const buttons = screen.queryAllByRole("radio");
      expect(buttons).toHaveLength(0);
    });
  });

  // ============================================
  // onRate Callback Tests
  // ============================================
  describe("onRate callback", () => {
    it("calls onRate with 1 when first star is clicked in interactive mode", () => {
      const handleRate = vi.fn();
      render(<RatingStars rating={3} interactive={true} onRate={handleRate} />);

      const buttons = screen.getAllByRole("radio");
      fireEvent.click(buttons[0]);

      expect(handleRate).toHaveBeenCalledWith(1);
      expect(handleRate).toHaveBeenCalledTimes(1);
    });

    it("calls onRate with 2 when second star is clicked", () => {
      const handleRate = vi.fn();
      render(<RatingStars rating={3} interactive={true} onRate={handleRate} />);

      const buttons = screen.getAllByRole("radio");
      fireEvent.click(buttons[1]);

      expect(handleRate).toHaveBeenCalledWith(2);
    });

    it("calls onRate with 3 when third star is clicked", () => {
      const handleRate = vi.fn();
      render(<RatingStars rating={3} interactive={true} onRate={handleRate} />);

      const buttons = screen.getAllByRole("radio");
      fireEvent.click(buttons[2]);

      expect(handleRate).toHaveBeenCalledWith(3);
    });

    it("calls onRate with 4 when fourth star is clicked", () => {
      const handleRate = vi.fn();
      render(<RatingStars rating={3} interactive={true} onRate={handleRate} />);

      const buttons = screen.getAllByRole("radio");
      fireEvent.click(buttons[3]);

      expect(handleRate).toHaveBeenCalledWith(4);
    });

    it("calls onRate with 5 when fifth star is clicked", () => {
      const handleRate = vi.fn();
      render(<RatingStars rating={3} interactive={true} onRate={handleRate} />);

      const buttons = screen.getAllByRole("radio");
      fireEvent.click(buttons[4]);

      expect(handleRate).toHaveBeenCalledWith(5);
    });

    it("does not throw when clicked without onRate callback", () => {
      render(<RatingStars rating={3} interactive={true} />);

      const buttons = screen.getAllByRole("radio");
      expect(() => fireEvent.click(buttons[0])).not.toThrow();
    });

    it("handles multiple clicks on different stars", () => {
      const handleRate = vi.fn();
      render(<RatingStars rating={3} interactive={true} onRate={handleRate} />);

      const buttons = screen.getAllByRole("radio");
      fireEvent.click(buttons[0]);
      fireEvent.click(buttons[4]);
      fireEvent.click(buttons[2]);

      expect(handleRate).toHaveBeenCalledTimes(3);
      expect(handleRate).toHaveBeenNthCalledWith(1, 1);
      expect(handleRate).toHaveBeenNthCalledWith(2, 5);
      expect(handleRate).toHaveBeenNthCalledWith(3, 3);
    });

    it("handles rapid clicks on same star", () => {
      const handleRate = vi.fn();
      render(<RatingStars rating={3} interactive={true} onRate={handleRate} />);

      const buttons = screen.getAllByRole("radio");
      fireEvent.click(buttons[2]);
      fireEvent.click(buttons[2]);
      fireEvent.click(buttons[2]);

      expect(handleRate).toHaveBeenCalledTimes(3);
      expect(handleRate).toHaveBeenCalledWith(3);
    });
  });

  // ============================================
  // Size Prop Tests
  // ============================================
  describe("size prop", () => {
    it("applies default size h-4 w-4", () => {
      const { container } = render(<RatingStars rating={3} />);
      const starsWithDefaultSize = container.querySelectorAll(".h-4.w-4");
      expect(starsWithDefaultSize).toHaveLength(5);
    });

    it("applies custom size h-6 w-6", () => {
      const { container } = render(<RatingStars rating={3} size="h-6 w-6" />);
      const starsWithCustomSize = container.querySelectorAll(".h-6.w-6");
      expect(starsWithCustomSize).toHaveLength(5);
    });

    it("applies custom size h-8 w-8", () => {
      const { container } = render(<RatingStars rating={3} size="h-8 w-8" />);
      const starsWithCustomSize = container.querySelectorAll(".h-8.w-8");
      expect(starsWithCustomSize).toHaveLength(5);
    });

    it("applies small size h-3 w-3", () => {
      const { container } = render(<RatingStars rating={3} size="h-3 w-3" />);
      const starsWithSmallSize = container.querySelectorAll(".h-3.w-3");
      expect(starsWithSmallSize).toHaveLength(5);
    });

    it("applies large size h-10 w-10", () => {
      const { container } = render(<RatingStars rating={3} size="h-10 w-10" />);
      const starsWithLargeSize = container.querySelectorAll(".h-10.w-10");
      expect(starsWithLargeSize).toHaveLength(5);
    });
  });

  // ============================================
  // Accessibility Tests
  // ============================================
  describe("accessibility", () => {
    it("provides aria-label for interactive rating group", () => {
      render(<RatingStars rating={3} interactive={true} onRate={vi.fn()} />);
      const radiogroup = screen.getByRole("radiogroup");
      expect(radiogroup).toHaveAttribute("aria-label", "Rating");
    });

    it("provides aria-label for non-interactive container", () => {
      render(<RatingStars rating={3} interactive={false} />);
      const container = screen.getByRole("img");
      expect(container).toHaveAttribute("aria-label");
    });

    it("interactive stars have aria-label", () => {
      render(<RatingStars rating={3} interactive={true} onRate={vi.fn()} />);

      expect(screen.getByLabelText("1 star")).toBeInTheDocument();
      expect(screen.getByLabelText("2 stars")).toBeInTheDocument();
      expect(screen.getByLabelText("3 stars")).toBeInTheDocument();
      expect(screen.getByLabelText("4 stars")).toBeInTheDocument();
      expect(screen.getByLabelText("5 stars")).toBeInTheDocument();
    });

    it("interactive stars have aria-checked attribute", () => {
      render(<RatingStars rating={3} interactive={true} onRate={vi.fn()} />);

      const buttons = screen.getAllByRole("radio");
      expect(buttons[0]).toHaveAttribute("aria-checked", "false");
      expect(buttons[1]).toHaveAttribute("aria-checked", "false");
      expect(buttons[2]).toHaveAttribute("aria-checked", "true"); // 3 stars is selected
      expect(buttons[3]).toHaveAttribute("aria-checked", "false");
      expect(buttons[4]).toHaveAttribute("aria-checked", "false");
    });

    it("current rating star has tabindex 0", () => {
      render(<RatingStars rating={3} interactive={true} onRate={vi.fn()} />);

      const buttons = screen.getAllByRole("radio");
      expect(buttons[2]).toHaveAttribute("tabindex", "0"); // 3rd star
    });

    it("non-current rating stars have tabindex -1", () => {
      render(<RatingStars rating={3} interactive={true} onRate={vi.fn()} />);

      const buttons = screen.getAllByRole("radio");
      expect(buttons[0]).toHaveAttribute("tabindex", "-1");
      expect(buttons[1]).toHaveAttribute("tabindex", "-1");
      expect(buttons[3]).toHaveAttribute("tabindex", "-1");
      expect(buttons[4]).toHaveAttribute("tabindex", "-1");
    });

    it("supports custom label prop", () => {
      render(<RatingStars rating={3} interactive={true} onRate={vi.fn()} label="Trip Rating" />);
      const radiogroup = screen.getByRole("radiogroup");
      expect(radiogroup).toHaveAttribute("aria-label", "Trip Rating");
    });
  });

  // ============================================
  // Keyboard Navigation Tests
  // ============================================
  describe("keyboard navigation", () => {
    it("increases rating on ArrowRight key", () => {
      const handleRate = vi.fn();
      render(<RatingStars rating={3} interactive={true} onRate={handleRate} />);

      const buttons = screen.getAllByRole("radio");
      fireEvent.keyDown(buttons[2], { key: "ArrowRight" });

      expect(handleRate).toHaveBeenCalledWith(4);
    });

    it("increases rating on ArrowUp key", () => {
      const handleRate = vi.fn();
      render(<RatingStars rating={3} interactive={true} onRate={handleRate} />);

      const buttons = screen.getAllByRole("radio");
      fireEvent.keyDown(buttons[2], { key: "ArrowUp" });

      expect(handleRate).toHaveBeenCalledWith(4);
    });

    it("decreases rating on ArrowLeft key", () => {
      const handleRate = vi.fn();
      render(<RatingStars rating={3} interactive={true} onRate={handleRate} />);

      const buttons = screen.getAllByRole("radio");
      fireEvent.keyDown(buttons[2], { key: "ArrowLeft" });

      expect(handleRate).toHaveBeenCalledWith(2);
    });

    it("decreases rating on ArrowDown key", () => {
      const handleRate = vi.fn();
      render(<RatingStars rating={3} interactive={true} onRate={handleRate} />);

      const buttons = screen.getAllByRole("radio");
      fireEvent.keyDown(buttons[2], { key: "ArrowDown" });

      expect(handleRate).toHaveBeenCalledWith(2);
    });

    it("selects star on Enter key", () => {
      const handleRate = vi.fn();
      render(<RatingStars rating={3} interactive={true} onRate={handleRate} />);

      const buttons = screen.getAllByRole("radio");
      fireEvent.keyDown(buttons[4], { key: "Enter" });

      expect(handleRate).toHaveBeenCalledWith(5);
    });

    it("selects star on Space key", () => {
      const handleRate = vi.fn();
      render(<RatingStars rating={3} interactive={true} onRate={handleRate} />);

      const buttons = screen.getAllByRole("radio");
      fireEvent.keyDown(buttons[0], { key: " " });

      expect(handleRate).toHaveBeenCalledWith(1);
    });
  });

  // ============================================
  // Transition and Animation Tests
  // ============================================
  describe("transitions", () => {
    it("applies transition-colors to all stars", () => {
      const { container } = render(<RatingStars rating={3} />);
      const starsWithTransition = container.querySelectorAll(".transition-colors");
      expect(starsWithTransition).toHaveLength(5);
    });

    it("applies duration-200 to all stars", () => {
      const { container } = render(<RatingStars rating={3} />);
      const starsWithDuration = container.querySelectorAll(".duration-200");
      expect(starsWithDuration).toHaveLength(5);
    });
  });

  // ============================================
  // Edge Cases Tests
  // ============================================
  describe("edge cases", () => {
    it("handles undefined rating", () => {
      const { container } = render(<RatingStars rating={undefined} />);
      const filledStars = container.querySelectorAll(".fill-yellow-500");
      expect(filledStars).toHaveLength(0);
    });

    it("handles null rating", () => {
      const { container } = render(<RatingStars rating={null} />);
      const filledStars = container.querySelectorAll(".fill-yellow-500");
      expect(filledStars).toHaveLength(0);
    });

    it("handles decimal rating (rounds down implicitly)", () => {
      const { container } = render(<RatingStars rating={3.7} />);
      // 3.7 > 0, 1, 2, 3 so indices 0, 1, 2, 3 are filled (4 stars)
      const filledStars = container.querySelectorAll(".fill-yellow-500");
      expect(filledStars).toHaveLength(4);
    });

    it("handles NaN rating", () => {
      const { container } = render(<RatingStars rating={NaN} />);
      // NaN comparisons return false
      const filledStars = container.querySelectorAll(".fill-yellow-500");
      expect(filledStars).toHaveLength(0);
    });

    it("renders correctly with dark mode and interactive combined", () => {
      const handleRate = vi.fn();
      const { container } = render(<RatingStars rating={2} darkMode={true} interactive={true} onRate={handleRate} />);

      const filledStars = container.querySelectorAll(".fill-yellow-400");
      expect(filledStars).toHaveLength(2);

      const interactiveStars = container.querySelectorAll(".cursor-pointer");
      expect(interactiveStars).toHaveLength(5);
    });

    it("handles very large size strings", () => {
      const { container } = render(<RatingStars rating={3} size="h-20 w-20" />);
      const starsWithSize = container.querySelectorAll(".h-20.w-20");
      expect(starsWithSize).toHaveLength(5);
    });
  });

  // ============================================
  // Real-world Usage Scenarios
  // ============================================
  describe("real-world usage scenarios", () => {
    it("displays trip rating correctly", () => {
      const tripRating = 4;
      const { container } = render(<RatingStars rating={tripRating} />);

      const filledStars = container.querySelectorAll(".fill-yellow-500");
      const emptyStars = container.querySelectorAll(".fill-gray-300");

      expect(filledStars).toHaveLength(4);
      expect(emptyStars).toHaveLength(1);
    });

    it("allows user to rate a new trip", () => {
      const handleRate = vi.fn();
      render(<RatingStars rating={0} interactive={true} onRate={handleRate} />);

      const buttons = screen.getAllByRole("radio");
      fireEvent.click(buttons[3]);

      expect(handleRate).toHaveBeenCalledWith(4);
    });

    it("allows user to change existing rating", () => {
      const handleRate = vi.fn();
      render(<RatingStars rating={3} interactive={true} onRate={handleRate} />);

      const buttons = screen.getAllByRole("radio");
      fireEvent.click(buttons[4]);

      expect(handleRate).toHaveBeenCalledWith(5);
    });

    it("displays correctly in dark mode trip card", () => {
      const { container } = render(<RatingStars rating={5} darkMode={true} size="h-5 w-5" />);

      const filledStars = container.querySelectorAll(".fill-yellow-400");
      expect(filledStars).toHaveLength(5);
    });

    it("displays correctly in light mode trip card", () => {
      const { container } = render(<RatingStars rating={5} darkMode={false} size="h-5 w-5" />);

      const filledStars = container.querySelectorAll(".fill-yellow-500");
      expect(filledStars).toHaveLength(5);
    });

    it("works as read-only rating display", () => {
      const { container } = render(<RatingStars rating={4} interactive={false} />);

      // Should not have radio buttons when non-interactive
      const buttons = screen.queryAllByRole("radio");
      expect(buttons).toHaveLength(0);

      // Should still display the rating
      const filledStars = container.querySelectorAll(".fill-yellow-500");
      expect(filledStars).toHaveLength(4);
    });
  });

  // ============================================
  // Component Structure Tests
  // ============================================
  describe("component structure", () => {
    it("maintains consistent structure with rating 0", () => {
      const { container } = render(<RatingStars rating={0} />);
      const wrapper = container.firstChild;
      expect(wrapper.children).toHaveLength(5);
    });

    it("maintains consistent structure with rating 5", () => {
      const { container } = render(<RatingStars rating={5} />);
      const wrapper = container.firstChild;
      expect(wrapper.children).toHaveLength(5);
    });

    it("maintains consistent structure in interactive mode", () => {
      render(<RatingStars rating={3} interactive={true} onRate={vi.fn()} />);
      const buttons = screen.getAllByRole("radio");
      expect(buttons).toHaveLength(5);
    });

    it("non-interactive has role img", () => {
      render(<RatingStars rating={3} />);
      const container = screen.getByRole("img");
      expect(container).toBeInTheDocument();
    });

    it("interactive has role radiogroup", () => {
      render(<RatingStars rating={3} interactive={true} onRate={vi.fn()} />);
      const radiogroup = screen.getByRole("radiogroup");
      expect(radiogroup).toBeInTheDocument();
    });
  });
});
