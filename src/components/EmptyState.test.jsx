/**
 * Unit tests for EmptyState component
 * Tests rendering, variants, icons, actions, dark mode, and pre-styled variants
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import EmptyState, { NoResultsState, NoTripsState } from "./EmptyState";

describe("EmptyState", () => {
  // ============================================
  // Basic Rendering Tests
  // ============================================
  describe("basic rendering", () => {
    it("renders without crashing", () => {
      render(<EmptyState />);
      expect(screen.getByText("No items found")).toBeInTheDocument();
    });

    it("renders default title", () => {
      render(<EmptyState />);
      expect(screen.getByText("No items found")).toBeInTheDocument();
    });

    it("renders default description", () => {
      render(<EmptyState />);
      expect(screen.getByText("Get started by adding your first item.")).toBeInTheDocument();
    });

    it("renders custom title", () => {
      render(<EmptyState title="No trips yet!" />);
      expect(screen.getByText("No trips yet!")).toBeInTheDocument();
    });

    it("renders custom description", () => {
      render(<EmptyState description="Start your travel journey today." />);
      expect(screen.getByText("Start your travel journey today.")).toBeInTheDocument();
    });

    it("renders with both custom title and description", () => {
      render(
        <EmptyState
          title="Empty Wishlist"
          description="Add destinations you'd like to visit."
        />
      );
      expect(screen.getByText("Empty Wishlist")).toBeInTheDocument();
      expect(screen.getByText("Add destinations you'd like to visit.")).toBeInTheDocument();
    });
  });

  // ============================================
  // Icon Tests
  // ============================================
  describe("icons", () => {
    it("renders compass icon by default", () => {
      const { container } = render(<EmptyState />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("renders plane icon", () => {
      const { container } = render(<EmptyState icon="plane" />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("renders map icon", () => {
      const { container } = render(<EmptyState icon="map" />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("renders globe icon", () => {
      const { container } = render(<EmptyState icon="globe" />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("renders search icon", () => {
      const { container } = render(<EmptyState icon="search" />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("renders custom icon when provided", () => {
      const CustomIcon = () => <span data-testid="custom-icon">★</span>;
      render(<EmptyState customIcon={<CustomIcon />} />);
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });

    it("prefers custom icon over icon prop", () => {
      const CustomIcon = () => <span data-testid="custom-icon">★</span>;
      render(<EmptyState icon="plane" customIcon={<CustomIcon />} />);
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });

    it("falls back to compass for unknown icon", () => {
      const { container } = render(<EmptyState icon="unknown" />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  // ============================================
  // Variant Tests
  // ============================================
  describe("variants", () => {
    it("renders default variant", () => {
      const { container } = render(<EmptyState variant="default" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("py-16");
    });

    it("renders compact variant", () => {
      const { container } = render(<EmptyState variant="compact" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("py-8");
    });

    it("renders card variant", () => {
      const { container } = render(<EmptyState variant="card" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("rounded-2xl");
      expect(wrapper).toHaveClass("border-2");
      expect(wrapper).toHaveClass("border-dashed");
    });

    it("defaults to default variant", () => {
      const { container } = render(<EmptyState />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("py-16");
    });

    it("applies correct text sizes for default variant", () => {
      render(<EmptyState variant="default" title="Test Title" />);
      const title = screen.getByText("Test Title");
      expect(title).toHaveClass("text-xl");
    });

    it("applies correct text sizes for compact variant", () => {
      render(<EmptyState variant="compact" title="Test Title" />);
      const title = screen.getByText("Test Title");
      expect(title).toHaveClass("text-lg");
    });

    it("applies correct text sizes for card variant", () => {
      render(<EmptyState variant="card" title="Test Title" />);
      const title = screen.getByText("Test Title");
      expect(title).toHaveClass("text-lg");
    });
  });

  // ============================================
  // Dark Mode Tests
  // ============================================
  describe("dark mode", () => {
    it("applies dark mode styles when darkMode is true", () => {
      render(<EmptyState darkMode={true} title="Dark Title" />);
      const title = screen.getByText("Dark Title");
      expect(title).toHaveClass("text-gray-100");
    });

    it("applies light mode styles when darkMode is false", () => {
      render(<EmptyState darkMode={false} title="Light Title" />);
      const title = screen.getByText("Light Title");
      expect(title).toHaveClass("text-gray-800");
    });

    it("applies dark mode description color", () => {
      render(<EmptyState darkMode={true} description="Dark description" />);
      const description = screen.getByText("Dark description");
      expect(description).toHaveClass("text-gray-400");
    });

    it("applies light mode description color", () => {
      render(<EmptyState darkMode={false} description="Light description" />);
      const description = screen.getByText("Light description");
      expect(description).toHaveClass("text-gray-500");
    });

    it("applies dark mode card variant styles", () => {
      const { container } = render(<EmptyState darkMode={true} variant="card" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("bg-gray-800/30");
      expect(wrapper).toHaveClass("border-gray-700");
    });

    it("applies light mode card variant styles", () => {
      const { container } = render(<EmptyState darkMode={false} variant="card" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("bg-gray-50");
      expect(wrapper).toHaveClass("border-gray-300");
    });

    it("applies dark mode icon container styles", () => {
      const { container } = render(<EmptyState darkMode={true} />);
      const iconContainer = container.querySelector(".rounded-2xl");
      expect(iconContainer).toHaveClass("from-sky-900/50");
    });

    it("applies light mode icon container styles", () => {
      const { container } = render(<EmptyState darkMode={false} />);
      const iconContainer = container.querySelector(".rounded-2xl");
      expect(iconContainer).toHaveClass("from-sky-100");
    });
  });

  // ============================================
  // Action Button Tests
  // ============================================
  describe("action button", () => {
    it("does not render action button when actionLabel is not provided", () => {
      render(<EmptyState onAction={() => {}} />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("does not render action button when onAction is not provided", () => {
      render(<EmptyState actionLabel="Add Trip" />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("renders action button when both actionLabel and onAction are provided", () => {
      render(<EmptyState actionLabel="Add Trip" onAction={() => {}} />);
      expect(screen.getByRole("button", { name: /add trip/i })).toBeInTheDocument();
    });

    it("displays correct action label", () => {
      render(<EmptyState actionLabel="Create New Trip" onAction={() => {}} />);
      expect(screen.getByText("Create New Trip")).toBeInTheDocument();
    });

    it("calls onAction when button is clicked", () => {
      const handleAction = vi.fn();
      render(<EmptyState actionLabel="Add Trip" onAction={handleAction} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(handleAction).toHaveBeenCalledTimes(1);
    });

    it("renders Plus icon in action button", () => {
      const { container } = render(<EmptyState actionLabel="Add" onAction={() => {}} />);
      const button = screen.getByRole("button");
      const svg = button.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("applies dark mode button styles", () => {
      render(<EmptyState actionLabel="Add" onAction={() => {}} darkMode={true} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("shadow-sky-900/30");
    });

    it("applies light mode button styles", () => {
      render(<EmptyState actionLabel="Add" onAction={() => {}} darkMode={false} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("shadow-sky-500/30");
    });

    it("button has gradient background", () => {
      render(<EmptyState actionLabel="Add" onAction={() => {}} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-gradient-to-r");
    });

    it("button has cursor-pointer class", () => {
      render(<EmptyState actionLabel="Add" onAction={() => {}} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("cursor-pointer");
    });
  });

  // ============================================
  // Custom ClassName Tests
  // ============================================
  describe("custom className", () => {
    it("applies custom className", () => {
      const { container } = render(<EmptyState className="custom-class" />);
      expect(container.querySelector(".custom-class")).toBeInTheDocument();
    });

    it("combines custom className with default classes", () => {
      const { container } = render(<EmptyState className="my-custom-class" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("my-custom-class");
      expect(wrapper).toHaveClass("flex");
      expect(wrapper).toHaveClass("flex-col");
    });

    it("handles empty className", () => {
      const { container } = render(<EmptyState className="" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("handles multiple custom classes", () => {
      const { container } = render(<EmptyState className="class-one class-two" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("class-one");
      expect(wrapper).toHaveClass("class-two");
    });
  });

  // ============================================
  // Layout and Styling Tests
  // ============================================
  describe("layout and styling", () => {
    it("centers content", () => {
      const { container } = render(<EmptyState />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("items-center");
      expect(wrapper).toHaveClass("justify-center");
      expect(wrapper).toHaveClass("text-center");
    });

    it("uses flex column layout", () => {
      const { container } = render(<EmptyState />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("flex");
      expect(wrapper).toHaveClass("flex-col");
    });

    it("title has correct font weight", () => {
      render(<EmptyState title="Test" />);
      const title = screen.getByText("Test");
      expect(title).toHaveClass("font-semibold");
    });

    it("description has max-width", () => {
      render(<EmptyState description="Test description" />);
      const description = screen.getByText("Test description");
      expect(description).toHaveClass("max-w-sm");
    });

    it("description has margin bottom", () => {
      render(<EmptyState description="Test" />);
      const description = screen.getByText("Test");
      expect(description).toHaveClass("mb-6");
    });

    it("title has margin bottom", () => {
      render(<EmptyState title="Test" />);
      const title = screen.getByText("Test");
      expect(title).toHaveClass("mb-2");
    });
  });

  // ============================================
  // Combined Props Tests
  // ============================================
  describe("combined props", () => {
    it("renders with all props combined", () => {
      const handleAction = vi.fn();
      const CustomIcon = () => <span data-testid="custom">★</span>;

      render(
        <EmptyState
          title="Custom Title"
          description="Custom description text"
          customIcon={<CustomIcon />}
          darkMode={true}
          actionLabel="Take Action"
          onAction={handleAction}
          variant="card"
          className="extra-class"
        />
      );

      expect(screen.getByText("Custom Title")).toBeInTheDocument();
      expect(screen.getByText("Custom description text")).toBeInTheDocument();
      expect(screen.getByTestId("custom")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /take action/i })).toBeInTheDocument();
    });
  });
});

// ============================================
// NoResultsState Tests
// ============================================
describe("NoResultsState", () => {
  describe("basic rendering", () => {
    it("renders without crashing", () => {
      render(<NoResultsState />);
      expect(screen.getByText("No results found")).toBeInTheDocument();
    });

    it("displays default title", () => {
      render(<NoResultsState />);
      expect(screen.getByText("No results found")).toBeInTheDocument();
    });

    it("displays default description without query", () => {
      render(<NoResultsState />);
      expect(screen.getByText("Try adjusting your search or filters.")).toBeInTheDocument();
    });

    it("uses search icon", () => {
      const { container } = render(<NoResultsState />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("uses compact variant", () => {
      const { container } = render(<NoResultsState />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("py-8");
    });
  });

  describe("with query prop", () => {
    it("displays query in description", () => {
      render(<NoResultsState query="Rome" />);
      expect(
        screen.getByText(/We couldn't find anything matching "Rome"/)
      ).toBeInTheDocument();
    });

    it("shows clear search button when query is provided", () => {
      render(<NoResultsState query="Paris" onClear={() => {}} />);
      expect(screen.getByRole("button", { name: /clear search/i })).toBeInTheDocument();
    });

    it("does not show clear button without query", () => {
      render(<NoResultsState onClear={() => {}} />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("calls onClear when clear button is clicked", () => {
      const handleClear = vi.fn();
      render(<NoResultsState query="test" onClear={handleClear} />);

      fireEvent.click(screen.getByRole("button"));
      expect(handleClear).toHaveBeenCalledTimes(1);
    });
  });

  describe("dark mode", () => {
    it("applies dark mode styles", () => {
      render(<NoResultsState darkMode={true} />);
      const title = screen.getByText("No results found");
      expect(title).toHaveClass("text-gray-100");
    });

    it("applies light mode styles", () => {
      render(<NoResultsState darkMode={false} />);
      const title = screen.getByText("No results found");
      expect(title).toHaveClass("text-gray-800");
    });
  });

  describe("custom className", () => {
    it("applies custom className", () => {
      const { container } = render(<NoResultsState className="custom-results" />);
      expect(container.querySelector(".custom-results")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("handles empty string query", () => {
      render(<NoResultsState query="" />);
      expect(screen.getByText("Try adjusting your search or filters.")).toBeInTheDocument();
    });

    it("handles special characters in query", () => {
      render(<NoResultsState query="<script>alert('xss')</script>" />);
      expect(
        screen.getByText(/We couldn't find anything matching "<script>alert\('xss'\)<\/script>"/)
      ).toBeInTheDocument();
    });

    it("handles long query strings", () => {
      const longQuery = "a".repeat(100);
      render(<NoResultsState query={longQuery} />);
      expect(screen.getByText(new RegExp(longQuery))).toBeInTheDocument();
    });
  });
});

// ============================================
// NoTripsState Tests
// ============================================
describe("NoTripsState", () => {
  describe("basic rendering", () => {
    it("renders without crashing", () => {
      render(<NoTripsState />);
      expect(screen.getByText("No adventures yet!")).toBeInTheDocument();
    });

    it("displays correct title", () => {
      render(<NoTripsState />);
      expect(screen.getByText("No adventures yet!")).toBeInTheDocument();
    });

    it("displays correct description", () => {
      render(<NoTripsState />);
      expect(
        screen.getByText("Start documenting your travel memories by adding your first trip.")
      ).toBeInTheDocument();
    });

    it("uses plane icon", () => {
      const { container } = render(<NoTripsState />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("uses default variant", () => {
      const { container } = render(<NoTripsState />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("py-16");
    });
  });

  describe("action button", () => {
    it("shows add trip button when onAddTrip is provided", () => {
      render(<NoTripsState onAddTrip={() => {}} />);
      expect(screen.getByRole("button", { name: /add your first trip/i })).toBeInTheDocument();
    });

    it("does not show button without onAddTrip", () => {
      render(<NoTripsState />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("calls onAddTrip when button is clicked", () => {
      const handleAddTrip = vi.fn();
      render(<NoTripsState onAddTrip={handleAddTrip} />);

      fireEvent.click(screen.getByRole("button"));
      expect(handleAddTrip).toHaveBeenCalledTimes(1);
    });

    it("displays correct button label", () => {
      render(<NoTripsState onAddTrip={() => {}} />);
      expect(screen.getByText("Add Your First Trip")).toBeInTheDocument();
    });
  });

  describe("dark mode", () => {
    it("applies dark mode styles", () => {
      render(<NoTripsState darkMode={true} />);
      const title = screen.getByText("No adventures yet!");
      expect(title).toHaveClass("text-gray-100");
    });

    it("applies light mode styles", () => {
      render(<NoTripsState darkMode={false} />);
      const title = screen.getByText("No adventures yet!");
      expect(title).toHaveClass("text-gray-800");
    });
  });

  describe("custom className", () => {
    it("applies custom className", () => {
      const { container } = render(<NoTripsState className="custom-trips" />);
      expect(container.querySelector(".custom-trips")).toBeInTheDocument();
    });
  });

  describe("combined props", () => {
    it("renders with all props", () => {
      const handleAddTrip = vi.fn();
      const { container } = render(
        <NoTripsState
          darkMode={true}
          onAddTrip={handleAddTrip}
          className="combined-class"
        />
      );

      expect(screen.getByText("No adventures yet!")).toBeInTheDocument();
      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(container.querySelector(".combined-class")).toBeInTheDocument();
    });
  });
});

// ============================================
// Real-world Usage Scenarios
// ============================================
describe("real-world usage scenarios", () => {
  it("displays empty state for new user", () => {
    const handleAddTrip = vi.fn();
    render(<NoTripsState onAddTrip={handleAddTrip} />);

    expect(screen.getByText("No adventures yet!")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button"));
    expect(handleAddTrip).toHaveBeenCalled();
  });

  it("displays no results after search", () => {
    const handleClear = vi.fn();
    render(<NoResultsState query="NonexistentPlace" onClear={handleClear} darkMode={true} />);

    expect(screen.getByText(/We couldn't find anything matching "NonexistentPlace"/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button"));
    expect(handleClear).toHaveBeenCalled();
  });

  it("displays custom empty state in modal", () => {
    render(
      <EmptyState
        title="No destinations added"
        description="Add some destinations to your trip."
        icon="map"
        variant="card"
        darkMode={true}
        actionLabel="Add Destination"
        onAction={() => {}}
      />
    );

    expect(screen.getByText("No destinations added")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("displays wishlist empty state", () => {
    render(
      <EmptyState
        title="Your wishlist is empty"
        description="Save places you'd like to visit someday."
        icon="globe"
        actionLabel="Explore Destinations"
        onAction={() => {}}
      />
    );

    expect(screen.getByText("Your wishlist is empty")).toBeInTheDocument();
    expect(screen.getByText("Explore Destinations")).toBeInTheDocument();
  });
});
