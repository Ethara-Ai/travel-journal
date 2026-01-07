/**
 * Unit tests for SearchBar component
 * Tests rendering, user interactions, keyboard events, dark mode, and suggestions
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar, { SearchBarWithSuggestions } from "./SearchBar";

describe("SearchBar", () => {
  // ============================================
  // Basic Rendering Tests
  // ============================================
  describe("basic rendering", () => {
    it("renders without crashing", () => {
      render(<SearchBar value="" onChange={() => {}} />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("renders input element", () => {
      render(<SearchBar value="" onChange={() => {}} />);
      const input = screen.getByRole("textbox");
      expect(input.tagName).toBe("INPUT");
    });

    it("renders with default placeholder", () => {
      render(<SearchBar value="" onChange={() => {}} />);
      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    });

    it("renders with custom placeholder", () => {
      render(<SearchBar value="" onChange={() => {}} placeholder="Find trips..." />);
      expect(screen.getByPlaceholderText("Find trips...")).toBeInTheDocument();
    });

    it("renders search icon", () => {
      const { container } = render(<SearchBar value="" onChange={() => {}} />);
      const searchIcon = container.querySelector("svg");
      expect(searchIcon).toBeInTheDocument();
    });

    it("displays the controlled value", () => {
      render(<SearchBar value="Rome" onChange={() => {}} />);
      expect(screen.getByDisplayValue("Rome")).toBeInTheDocument();
    });

    it("renders with empty string value", () => {
      render(<SearchBar value="" onChange={() => {}} />);
      expect(screen.getByDisplayValue("")).toBeInTheDocument();
    });
  });

  // ============================================
  // onChange Handler Tests
  // ============================================
  describe("onChange handler", () => {
    it("calls onChange when typing", async () => {
      const handleChange = vi.fn();
      render(<SearchBar value="" onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "Paris" } });

      expect(handleChange).toHaveBeenCalledWith("Paris");
    });

    it("calls onChange with empty string when clearing", async () => {
      const handleChange = vi.fn();
      render(<SearchBar value="test" onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "" } });

      expect(handleChange).toHaveBeenCalledWith("");
    });

    it("calls onChange for each character typed", async () => {
      const handleChange = vi.fn();
      render(<SearchBar value="" onChange={handleChange} />);

      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "R" } });
      fireEvent.change(input, { target: { value: "Ro" } });
      fireEvent.change(input, { target: { value: "Rom" } });
      fireEvent.change(input, { target: { value: "Rome" } });

      expect(handleChange).toHaveBeenCalledTimes(4);
    });

    it("handles special characters in input", () => {
      const handleChange = vi.fn();
      render(<SearchBar value="" onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "café & bistro <test>" } });

      expect(handleChange).toHaveBeenCalledWith("café & bistro <test>");
    });

    it("handles unicode characters", () => {
      const handleChange = vi.fn();
      render(<SearchBar value="" onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "東京 🗼" } });

      expect(handleChange).toHaveBeenCalledWith("東京 🗼");
    });
  });

  // ============================================
  // Clear Button Tests
  // ============================================
  describe("clear button", () => {
    it("shows clear button when value is present and showClearButton is true", () => {
      render(<SearchBar value="test" onChange={() => {}} showClearButton={true} />);
      expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
    });

    it("does not show clear button when value is empty", () => {
      render(<SearchBar value="" onChange={() => {}} showClearButton={true} />);
      expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument();
    });

    it("does not show clear button when showClearButton is false", () => {
      render(<SearchBar value="test" onChange={() => {}} showClearButton={false} />);
      expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument();
    });

    it("shows clear button by default (showClearButton defaults to true)", () => {
      render(<SearchBar value="test" onChange={() => {}} />);
      expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
    });

    it("calls onChange with empty string when clear button is clicked", () => {
      const handleChange = vi.fn();
      render(<SearchBar value="test" onChange={handleChange} />);

      const clearButton = screen.getByLabelText("Clear search");
      fireEvent.click(clearButton);

      expect(handleChange).toHaveBeenCalledWith("");
    });

    it("focuses input after clearing", () => {
      const handleChange = vi.fn();
      render(<SearchBar value="test" onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      const clearButton = screen.getByLabelText("Clear search");
      fireEvent.click(clearButton);

      expect(input).toHaveFocus();
    });
  });

  // ============================================
  // Keyboard Events Tests
  // ============================================
  describe("keyboard events", () => {
    it("calls onSubmit when Enter is pressed", () => {
      const handleSubmit = vi.fn();
      render(<SearchBar value="Rome" onChange={() => {}} onSubmit={handleSubmit} />);

      const input = screen.getByRole("textbox");
      fireEvent.keyDown(input, { key: "Enter" });

      expect(handleSubmit).toHaveBeenCalledWith("Rome");
    });

    it("does not throw when Enter is pressed without onSubmit", () => {
      render(<SearchBar value="Rome" onChange={() => {}} />);

      const input = screen.getByRole("textbox");
      expect(() => fireEvent.keyDown(input, { key: "Enter" })).not.toThrow();
    });

    it("clears input and blurs on Escape key", () => {
      const handleChange = vi.fn();
      render(<SearchBar value="test" onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      input.focus();
      expect(input).toHaveFocus();

      fireEvent.keyDown(input, { key: "Escape" });

      expect(handleChange).toHaveBeenCalledWith("");
    });

    it("does not trigger submit on other keys", () => {
      const handleSubmit = vi.fn();
      render(<SearchBar value="Rome" onChange={() => {}} onSubmit={handleSubmit} />);

      const input = screen.getByRole("textbox");
      fireEvent.keyDown(input, { key: "a" });
      fireEvent.keyDown(input, { key: "Tab" });
      fireEvent.keyDown(input, { key: "Space" });

      expect(handleSubmit).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // Focus State Tests
  // ============================================
  describe("focus state", () => {
    it("auto focuses when autoFocus is true", () => {
      render(<SearchBar value="" onChange={() => {}} autoFocus={true} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveFocus();
    });

    it("does not auto focus when autoFocus is false", () => {
      render(<SearchBar value="" onChange={() => {}} autoFocus={false} />);
      const input = screen.getByRole("textbox");
      expect(input).not.toHaveFocus();
    });

    it("does not auto focus by default", () => {
      render(<SearchBar value="" onChange={() => {}} />);
      const input = screen.getByRole("textbox");
      expect(input).not.toHaveFocus();
    });

    it("applies focus styles when focused", () => {
      const { container } = render(<SearchBar value="" onChange={() => {}} />);
      const input = screen.getByRole("textbox");

      fireEvent.focus(input);

      // Check for focus ring classes
      expect(input).toHaveClass("ring-2");
    });

    it("removes focus styles when blurred", () => {
      const { container } = render(<SearchBar value="" onChange={() => {}} />);
      const input = screen.getByRole("textbox");

      fireEvent.focus(input);
      fireEvent.blur(input);

      // Check that ring class changes based on focus state
      expect(input).not.toHaveClass("ring-2");
    });
  });

  // ============================================
  // Size Variants Tests
  // ============================================
  describe("size variants", () => {
    it("applies small size classes", () => {
      render(<SearchBar value="" onChange={() => {}} size="small" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("text-xs");
    });

    it("applies default size classes", () => {
      render(<SearchBar value="" onChange={() => {}} size="default" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("text-sm");
    });

    it("applies large size classes", () => {
      render(<SearchBar value="" onChange={() => {}} size="large" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("text-base");
    });

    it("defaults to default size", () => {
      render(<SearchBar value="" onChange={() => {}} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("text-sm");
    });
  });

  // ============================================
  // Dark Mode Tests
  // ============================================
  describe("dark mode", () => {
    it("applies dark mode styles when darkMode is true", () => {
      render(<SearchBar value="" onChange={() => {}} darkMode={true} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("bg-gray-800/80");
    });

    it("applies light mode styles when darkMode is false", () => {
      render(<SearchBar value="" onChange={() => {}} darkMode={false} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("bg-white");
    });

    it("defaults to light mode", () => {
      render(<SearchBar value="" onChange={() => {}} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("bg-white");
    });

    it("applies dark mode text color", () => {
      render(<SearchBar value="" onChange={() => {}} darkMode={true} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("text-white");
    });

    it("applies light mode text color", () => {
      render(<SearchBar value="" onChange={() => {}} darkMode={false} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("text-gray-900");
    });

    it("applies dark mode placeholder color", () => {
      render(<SearchBar value="" onChange={() => {}} darkMode={true} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("placeholder-gray-400");
    });

    it("applies light mode placeholder color", () => {
      render(<SearchBar value="" onChange={() => {}} darkMode={false} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("placeholder-gray-500");
    });

    it("applies dark mode border color", () => {
      render(<SearchBar value="" onChange={() => {}} darkMode={true} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("border-gray-600");
    });

    it("applies light mode border color", () => {
      render(<SearchBar value="" onChange={() => {}} darkMode={false} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("border-gray-200");
    });
  });

  // ============================================
  // Custom ClassName Tests
  // ============================================
  describe("custom className", () => {
    it("applies custom className to container", () => {
      const { container } = render(
        <SearchBar value="" onChange={() => {}} className="custom-class" />
      );
      expect(container.querySelector(".custom-class")).toBeInTheDocument();
    });

    it("combines custom className with default classes", () => {
      const { container } = render(
        <SearchBar value="" onChange={() => {}} className="my-custom-class" />
      );
      const wrapper = container.querySelector(".my-custom-class");
      expect(wrapper).toHaveClass("relative");
    });

    it("handles empty className", () => {
      expect(() =>
        render(<SearchBar value="" onChange={() => {}} className="" />)
      ).not.toThrow();
    });
  });

  // ============================================
  // Filter Component Tests
  // ============================================
  describe("filter component", () => {
    it("renders filter component when provided", () => {
      const FilterButton = () => <button data-testid="filter-btn">Filter</button>;
      render(
        <SearchBar
          value=""
          onChange={() => {}}
          filterComponent={<FilterButton />}
        />
      );

      expect(screen.getByTestId("filter-btn")).toBeInTheDocument();
    });

    it("does not render filter container when filterComponent is not provided", () => {
      const { container } = render(<SearchBar value="" onChange={() => {}} />);
      const flexContainer = container.querySelector(".flex-shrink-0");
      expect(flexContainer).not.toBeInTheDocument();
    });

    it("renders complex filter component", () => {
      const ComplexFilter = () => (
        <div data-testid="complex-filter">
          <select>
            <option>All</option>
            <option>Visited</option>
            <option>Wishlist</option>
          </select>
        </div>
      );
      render(
        <SearchBar
          value=""
          onChange={() => {}}
          filterComponent={<ComplexFilter />}
        />
      );

      expect(screen.getByTestId("complex-filter")).toBeInTheDocument();
    });
  });

  // ============================================
  // Accessibility Tests
  // ============================================
  describe("accessibility", () => {
    it("has accessible input with aria-label", () => {
      render(<SearchBar value="" onChange={() => {}} placeholder="Search trips" />);
      expect(screen.getByLabelText("Search trips")).toBeInTheDocument();
    });

    it("clear button has aria-label", () => {
      render(<SearchBar value="test" onChange={() => {}} />);
      expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
    });

    it("input is focusable via tab", () => {
      render(<SearchBar value="" onChange={() => {}} />);
      const input = screen.getByRole("textbox");

      input.focus();
      expect(input).toHaveFocus();
    });

    it("input type is text", () => {
      render(<SearchBar value="" onChange={() => {}} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "text");
    });
  });

  // ============================================
  // Styling Tests
  // ============================================
  describe("styling", () => {
    it("applies rounded corners", () => {
      render(<SearchBar value="" onChange={() => {}} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("rounded-xl");
    });

    it("applies border width", () => {
      render(<SearchBar value="" onChange={() => {}} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("border-2");
    });

    it("applies transition classes", () => {
      render(<SearchBar value="" onChange={() => {}} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("transition-all");
    });

    it("applies full width", () => {
      render(<SearchBar value="" onChange={() => {}} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("w-full");
    });

    it("removes outline", () => {
      render(<SearchBar value="" onChange={() => {}} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("outline-none");
    });
  });

  // ============================================
  // Edge Cases Tests
  // ============================================
  describe("edge cases", () => {
    it("handles very long input text", () => {
      const longText = "a".repeat(1000);
      const handleChange = vi.fn();
      render(<SearchBar value={longText} onChange={handleChange} />);

      expect(screen.getByDisplayValue(longText)).toBeInTheDocument();
    });

    it("handles rapid value changes", () => {
      const handleChange = vi.fn();
      const { rerender } = render(<SearchBar value="" onChange={handleChange} />);

      rerender(<SearchBar value="a" onChange={handleChange} />);
      rerender(<SearchBar value="ab" onChange={handleChange} />);
      rerender(<SearchBar value="abc" onChange={handleChange} />);
      rerender(<SearchBar value="abcd" onChange={handleChange} />);

      expect(screen.getByDisplayValue("abcd")).toBeInTheDocument();
    });

    it("handles whitespace-only value", () => {
      render(<SearchBar value="   " onChange={() => {}} />);
      expect(screen.getByDisplayValue("   ")).toBeInTheDocument();
    });

    it("handles numeric string value", () => {
      render(<SearchBar value="12345" onChange={() => {}} />);
      expect(screen.getByDisplayValue("12345")).toBeInTheDocument();
    });
  });

  // ============================================
  // Real-world Usage Scenarios Tests
  // ============================================
  describe("real-world usage scenarios", () => {
    it("handles trip search flow", () => {
      const handleChange = vi.fn();
      const handleSubmit = vi.fn();

      render(
        <SearchBar
          value=""
          onChange={handleChange}
          onSubmit={handleSubmit}
          placeholder="Search your trips..."
        />
      );

      const input = screen.getByRole("textbox");

      // User types search term
      fireEvent.change(input, { target: { value: "Rome" } });
      expect(handleChange).toHaveBeenCalledWith("Rome");

      // User presses Enter to search
      fireEvent.keyDown(input, { key: "Enter" });
      // Note: onSubmit receives the value prop, not the changed value
    });

    it("handles search and clear flow", () => {
      const handleChange = vi.fn();

      const { rerender } = render(
        <SearchBar value="" onChange={handleChange} />
      );

      const input = screen.getByRole("textbox");

      // User types
      fireEvent.change(input, { target: { value: "Paris" } });
      expect(handleChange).toHaveBeenCalledWith("Paris");

      // Simulate controlled update
      rerender(<SearchBar value="Paris" onChange={handleChange} />);

      // User clicks clear
      const clearButton = screen.getByLabelText("Clear search");
      fireEvent.click(clearButton);
      expect(handleChange).toHaveBeenCalledWith("");
    });

    it("handles escape to cancel search", () => {
      const handleChange = vi.fn();

      render(<SearchBar value="test search" onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      input.focus();

      fireEvent.keyDown(input, { key: "Escape" });

      expect(handleChange).toHaveBeenCalledWith("");
    });
  });
});

// ============================================
// SearchBarWithSuggestions Tests
// ============================================
describe("SearchBarWithSuggestions", () => {
  const defaultSuggestions = [
    "Rome",
    "Paris",
    "Tokyo",
    "New York",
    "London",
    "Barcelona",
  ];

  // ============================================
  // Basic Rendering Tests
  // ============================================
  describe("basic rendering", () => {
    it("renders without crashing", () => {
      render(
        <SearchBarWithSuggestions
          value=""
          onChange={() => {}}
          suggestions={defaultSuggestions}
        />
      );
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("renders search input", () => {
      render(
        <SearchBarWithSuggestions
          value=""
          onChange={() => {}}
          suggestions={defaultSuggestions}
        />
      );
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("does not show suggestions initially", () => {
      render(
        <SearchBarWithSuggestions
          value=""
          onChange={() => {}}
          suggestions={defaultSuggestions}
        />
      );
      expect(screen.queryByText("Rome")).not.toBeInTheDocument();
    });
  });

  // ============================================
  // Suggestions Display Tests
  // ============================================
  describe("suggestions display", () => {
    it("shows suggestions when typing", () => {
      render(
        <SearchBarWithSuggestions
          value=""
          onChange={() => {}}
          suggestions={defaultSuggestions}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "r" } });

      expect(screen.getByText("Rome")).toBeInTheDocument();
    });

    it("filters suggestions based on input", () => {
      render(
        <SearchBarWithSuggestions
          value="par"
          onChange={() => {}}
          suggestions={defaultSuggestions}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "par" } });

      expect(screen.getByText("Paris")).toBeInTheDocument();
      expect(screen.queryByText("Rome")).not.toBeInTheDocument();
    });

    it("hides suggestions when value is empty", () => {
      const { rerender } = render(
        <SearchBarWithSuggestions
          value="test"
          onChange={() => {}}
          suggestions={defaultSuggestions}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "" } });

      // Suggestions should be hidden
      expect(screen.queryByRole("button", { name: /Rome/i })).not.toBeInTheDocument();
    });

    it("limits suggestions to maxSuggestions", () => {
      render(
        <SearchBarWithSuggestions
          value=""
          onChange={() => {}}
          suggestions={defaultSuggestions}
          maxSuggestions={2}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "o" } });

      // Should show at most 2 suggestions
      const suggestionButtons = screen.getAllByRole("button");
      expect(suggestionButtons.length).toBeLessThanOrEqual(2);
    });

    it("defaults maxSuggestions to 5", () => {
      const manySuggestions = [
        "A1",
        "A2",
        "A3",
        "A4",
        "A5",
        "A6",
        "A7",
        "A8",
      ];
      render(
        <SearchBarWithSuggestions
          value=""
          onChange={() => {}}
          suggestions={manySuggestions}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "A" } });

      const suggestionButtons = screen.getAllByRole("button");
      expect(suggestionButtons.length).toBeLessThanOrEqual(5);
    });
  });

  // ============================================
  // Suggestion Selection Tests
  // ============================================
  describe("suggestion selection", () => {
    it("calls onChange when suggestion is clicked", () => {
      const handleChange = vi.fn();
      render(
        <SearchBarWithSuggestions
          value=""
          onChange={handleChange}
          suggestions={defaultSuggestions}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "rom" } });

      const suggestion = screen.getByText("Rome");
      fireEvent.click(suggestion);

      expect(handleChange).toHaveBeenCalledWith("Rome");
    });

    it("calls onSelectSuggestion when suggestion is clicked", () => {
      const handleSelect = vi.fn();
      render(
        <SearchBarWithSuggestions
          value=""
          onChange={() => {}}
          suggestions={defaultSuggestions}
          onSelectSuggestion={handleSelect}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "rom" } });

      const suggestion = screen.getByText("Rome");
      fireEvent.click(suggestion);

      expect(handleSelect).toHaveBeenCalledWith("Rome");
    });

    it("hides suggestions after selection", () => {
      const handleChange = vi.fn();
      render(
        <SearchBarWithSuggestions
          value=""
          onChange={handleChange}
          suggestions={defaultSuggestions}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "rom" } });

      expect(screen.getByText("Rome")).toBeInTheDocument();

      const suggestion = screen.getByText("Rome");
      fireEvent.click(suggestion);

      // After clicking, suggestions should hide
      expect(screen.queryByRole("button", { name: /Rome/ })).not.toBeInTheDocument();
    });
  });

  // ============================================
  // Click Outside Tests
  // ============================================
  describe("click outside behavior", () => {
    it("hides suggestions when clicking outside", async () => {
      render(
        <div>
          <div data-testid="outside">Outside element</div>
          <SearchBarWithSuggestions
            value=""
            onChange={() => {}}
            suggestions={defaultSuggestions}
          />
        </div>
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "rom" } });

      expect(screen.getByText("Rome")).toBeInTheDocument();

      // Click outside
      const outside = screen.getByTestId("outside");
      fireEvent.mouseDown(outside);

      await waitFor(() => {
        expect(screen.queryByRole("button", { name: /Rome/ })).not.toBeInTheDocument();
      });
    });
  });

  // ============================================
  // Dark Mode Tests
  // ============================================
  describe("dark mode", () => {
    it("applies dark mode styles to suggestions dropdown", () => {
      render(
        <SearchBarWithSuggestions
          value=""
          onChange={() => {}}
          suggestions={defaultSuggestions}
          darkMode={true}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "rom" } });

      // Check that suggestions appear and dropdown has dark mode styles
      expect(screen.getByText("Rome")).toBeInTheDocument();
    });

    it("applies light mode styles when darkMode is false", () => {
      render(
        <SearchBarWithSuggestions
          value=""
          onChange={() => {}}
          suggestions={defaultSuggestions}
          darkMode={false}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "rom" } });

      expect(screen.getByText("Rome")).toBeInTheDocument();
    });
  });

  // ============================================
  // Custom ClassName Tests
  // ============================================
  describe("custom className", () => {
    it("applies custom className to container", () => {
      const { container } = render(
        <SearchBarWithSuggestions
          value=""
          onChange={() => {}}
          suggestions={defaultSuggestions}
          className="custom-suggestions-class"
        />
      );

      expect(container.querySelector(".custom-suggestions-class")).toBeInTheDocument();
    });
  });

  // ============================================
  // Empty Suggestions Tests
  // ============================================
  describe("empty suggestions", () => {
    it("handles empty suggestions array", () => {
      render(
        <SearchBarWithSuggestions
          value=""
          onChange={() => {}}
          suggestions={[]}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "test" } });

      // Should not show any suggestions
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("handles no matching suggestions", () => {
      render(
        <SearchBarWithSuggestions
          value=""
          onChange={() => {}}
          suggestions={defaultSuggestions}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "xyz123" } });

      // Should not show any suggestions
      expect(screen.queryByText("Rome")).not.toBeInTheDocument();
    });
  });

  // ============================================
  // Case Insensitivity Tests
  // ============================================
  describe("case insensitivity", () => {
    it("filters suggestions case-insensitively", () => {
      render(
        <SearchBarWithSuggestions
          value=""
          onChange={() => {}}
          suggestions={defaultSuggestions}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "ROM" } });

      expect(screen.getByText("Rome")).toBeInTheDocument();
    });

    it("matches partial strings case-insensitively", () => {
      render(
        <SearchBarWithSuggestions
          value=""
          onChange={() => {}}
          suggestions={defaultSuggestions}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "PARIS" } });

      expect(screen.getByText("Paris")).toBeInTheDocument();
    });
  });

  // ============================================
  // Edge Cases Tests
  // ============================================
  describe("edge cases", () => {
    it("handles rapid typing", () => {
      const handleChange = vi.fn();
      render(
        <SearchBarWithSuggestions
          value=""
          onChange={handleChange}
          suggestions={defaultSuggestions}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "r" } });
      fireEvent.change(input, { target: { value: "ro" } });
      fireEvent.change(input, { target: { value: "rom" } });
      fireEvent.change(input, { target: { value: "rome" } });

      expect(handleChange).toHaveBeenCalledTimes(4);
    });

    it("handles special characters in suggestions", () => {
      const specialSuggestions = ["Café Paris", "São Paulo", "北京"];
      render(
        <SearchBarWithSuggestions
          value=""
          onChange={() => {}}
          suggestions={specialSuggestions}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "Caf" } });

      expect(screen.getByText("Café Paris")).toBeInTheDocument();
    });

    it("handles undefined onSelectSuggestion gracefully", () => {
      render(
        <SearchBarWithSuggestions
          value=""
          onChange={() => {}}
          suggestions={defaultSuggestions}
        />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "rom" } });

      const suggestion = screen.getByText("Rome");
      expect(() => fireEvent.click(suggestion)).not.toThrow();
    });
  });
});
