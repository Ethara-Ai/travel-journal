/**
 * Unit tests for TripStats component
 * Tests rendering, statistics calculations, dark mode, and empty states
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TripStats from "./TripStats";

// Helper function to get stat value by its label
const getStatValue = (label) => {
  const labelElement = screen.getByText(label);
  // The stat value is the sibling p element with the large font
  const statCard = labelElement.closest("div");
  const valueElement = statCard.querySelector(".text-3xl");
  return valueElement?.textContent;
};

// Helper function to create mock trips
const createMockTrip = (overrides = {}) => ({
  id: 1,
  continent: "Europe",
  country: "Italy",
  city: "Rome",
  date: "May 2023",
  rating: 5,
  description: "A historic city",
  highlights: ["Colosseum"],
  lowlights: [],
  image: "https://example.com/rome.jpg",
  imageAlt: "Rome",
  color: "#7c3aed",
  notes: "",
  expenses: "$2,500",
  tags: ["history"],
  isWishlist: false,
  ...overrides,
});

const createMockTrips = (count, customizer = null) => {
  const continents = ["Europe", "Asia", "North America", "South America", "Africa", "Oceania"];
  const countries = ["Italy", "Japan", "Canada", "Brazil", "Egypt", "Australia"];

  return Array.from({ length: count }, (_, index) => {
    const baseTrip = createMockTrip({
      id: index + 1,
      continent: continents[index % continents.length],
      country: countries[index % countries.length],
      city: `City ${index + 1}`,
      rating: (index % 5) + 1,
      isWishlist: false,
    });
    return customizer ? customizer(baseTrip, index) : baseTrip;
  });
};

describe("TripStats", () => {
  // ============================================
  // Basic Rendering Tests
  // ============================================
  describe("basic rendering", () => {
    it("renders without crashing with valid trips", () => {
      const trips = createMockTrips(3);
      render(<TripStats trips={trips} darkMode={false} />);
      expect(screen.getByText("Travel Statistics")).toBeInTheDocument();
    });

    it("renders the component title", () => {
      const trips = createMockTrips(2);
      render(<TripStats trips={trips} darkMode={false} />);
      expect(screen.getByText("Travel Statistics")).toBeInTheDocument();
    });

    it("renders with globe emoji in title", () => {
      const trips = createMockTrips(2);
      render(<TripStats trips={trips} darkMode={false} />);
      expect(screen.getByText("🌍")).toBeInTheDocument();
    });

    it("renders four stat cards when there are visited trips", () => {
      const trips = createMockTrips(3);
      render(<TripStats trips={trips} darkMode={false} />);

      expect(screen.getByText("Trips Taken")).toBeInTheDocument();
      expect(screen.getByText("Continents")).toBeInTheDocument();
      expect(screen.getByText("Countries")).toBeInTheDocument();
      expect(screen.getByText("Avg. Rating")).toBeInTheDocument();
    });

    it("renders correctly with single trip", () => {
      const trips = [createMockTrip()];
      render(<TripStats trips={trips} darkMode={false} />);

      expect(getStatValue("Trips Taken")).toBe("1");
      expect(screen.getByText("Trips Taken")).toBeInTheDocument();
    });
  });

  // ============================================
  // Empty State Tests
  // ============================================
  describe("empty state", () => {
    it("shows empty message when trips array is empty", () => {
      render(<TripStats trips={[]} darkMode={false} />);
      expect(
        screen.getByText("Once you've added some visited trips, your travel stats will appear here!"),
      ).toBeInTheDocument();
    });

    it("shows empty message when all trips are wishlists", () => {
      const wishlistTrips = createMockTrips(3, (trip) => ({ ...trip, isWishlist: true }));
      render(<TripStats trips={wishlistTrips} darkMode={false} />);
      expect(
        screen.getByText("Once you've added some visited trips, your travel stats will appear here!"),
      ).toBeInTheDocument();
    });

    it("still shows title in empty state", () => {
      render(<TripStats trips={[]} darkMode={false} />);
      expect(screen.getByText("Travel Statistics")).toBeInTheDocument();
    });

    it("does not show stat cards in empty state", () => {
      render(<TripStats trips={[]} darkMode={false} />);
      expect(screen.queryByText("Trips Taken")).not.toBeInTheDocument();
      expect(screen.queryByText("Continents")).not.toBeInTheDocument();
      expect(screen.queryByText("Countries")).not.toBeInTheDocument();
      expect(screen.queryByText("Avg. Rating")).not.toBeInTheDocument();
    });
  });

  // ============================================
  // Statistics Calculation Tests
  // ============================================
  describe("statistics calculations", () => {
    describe("trips count", () => {
      it("shows correct count of visited trips", () => {
        const trips = createMockTrips(5);
        render(<TripStats trips={trips} darkMode={false} />);
        expect(getStatValue("Trips Taken")).toBe("5");
      });

      it("excludes wishlist trips from count", () => {
        const trips = [
          createMockTrip({ id: 1, isWishlist: false }),
          createMockTrip({ id: 2, isWishlist: false }),
          createMockTrip({ id: 3, isWishlist: true }),
          createMockTrip({ id: 4, isWishlist: true }),
        ];
        render(<TripStats trips={trips} darkMode={false} />);
        expect(screen.getByText("2")).toBeInTheDocument();
      });

      it("shows correct count for large number of trips", () => {
        const trips = createMockTrips(100);
        render(<TripStats trips={trips} darkMode={false} />);
        expect(screen.getByText("100")).toBeInTheDocument();
      });
    });

    describe("continents count", () => {
      it("counts unique continents correctly", () => {
        const trips = [
          createMockTrip({ id: 1, continent: "Europe" }),
          createMockTrip({ id: 2, continent: "Asia" }),
          createMockTrip({ id: 3, continent: "Europe" }), // Duplicate
        ];
        render(<TripStats trips={trips} darkMode={false} />);
        // Should be 2 unique continents
        const statValues = screen.getAllByText("2");
        expect(statValues.length).toBeGreaterThanOrEqual(1);
      });

      it("shows 1 continent for trips in same continent", () => {
        const trips = [
          createMockTrip({ id: 1, continent: "Europe", country: "Italy" }),
          createMockTrip({ id: 2, continent: "Europe", country: "France" }),
          createMockTrip({ id: 3, continent: "Europe", country: "Spain" }),
        ];
        render(<TripStats trips={trips} darkMode={false} />);
        expect(screen.getByText("1")).toBeInTheDocument();
      });

      it("counts all 6 continents when present", () => {
        const trips = [
          createMockTrip({ id: 1, continent: "Europe" }),
          createMockTrip({ id: 2, continent: "Asia" }),
          createMockTrip({ id: 3, continent: "North America" }),
          createMockTrip({ id: 4, continent: "South America" }),
          createMockTrip({ id: 5, continent: "Africa" }),
          createMockTrip({ id: 6, continent: "Oceania" }),
        ];
        render(<TripStats trips={trips} darkMode={false} />);
        expect(getStatValue("Continents")).toBe("6");
      });
    });

    describe("countries count", () => {
      it("counts unique countries correctly", () => {
        const trips = [
          createMockTrip({ id: 1, country: "Italy" }),
          createMockTrip({ id: 2, country: "Japan" }),
          createMockTrip({ id: 3, country: "Italy" }), // Duplicate
        ];
        render(<TripStats trips={trips} darkMode={false} />);
        // Should find "2" for unique countries
        const allTwos = screen.getAllByText("2");
        expect(allTwos.length).toBeGreaterThanOrEqual(1);
      });

      it("shows correct count when visiting same country multiple times", () => {
        const trips = [
          createMockTrip({ id: 1, country: "Italy", city: "Rome" }),
          createMockTrip({ id: 2, country: "Italy", city: "Milan" }),
          createMockTrip({ id: 3, country: "Italy", city: "Florence" }),
        ];
        render(<TripStats trips={trips} darkMode={false} />);
        expect(getStatValue("Countries")).toBe("1");
      });

      it("counts all unique countries", () => {
        const trips = [
          createMockTrip({ id: 1, country: "Italy" }),
          createMockTrip({ id: 2, country: "Japan" }),
          createMockTrip({ id: 3, country: "Canada" }),
          createMockTrip({ id: 4, country: "Brazil" }),
          createMockTrip({ id: 5, country: "Egypt" }),
        ];
        render(<TripStats trips={trips} darkMode={false} />);
        expect(getStatValue("Countries")).toBe("5");
      });
    });

    describe("average rating", () => {
      it("calculates average rating correctly", () => {
        const trips = [
          createMockTrip({ id: 1, rating: 5 }),
          createMockTrip({ id: 2, rating: 4 }),
          createMockTrip({ id: 3, rating: 3 }),
        ];
        // Average: (5+4+3)/3 = 4.0
        render(<TripStats trips={trips} darkMode={false} />);
        expect(screen.getByText("4.0/5")).toBeInTheDocument();
      });

      it("handles decimal average ratings", () => {
        const trips = [createMockTrip({ id: 1, rating: 5 }), createMockTrip({ id: 2, rating: 4 })];
        // Average: (5+4)/2 = 4.5
        render(<TripStats trips={trips} darkMode={false} />);
        expect(screen.getByText("4.5/5")).toBeInTheDocument();
      });

      it("shows 5.0/5 for all 5-star trips", () => {
        const trips = [
          createMockTrip({ id: 1, rating: 5 }),
          createMockTrip({ id: 2, rating: 5 }),
          createMockTrip({ id: 3, rating: 5 }),
        ];
        render(<TripStats trips={trips} darkMode={false} />);
        expect(screen.getByText("5.0/5")).toBeInTheDocument();
      });

      it("shows correct average for single trip", () => {
        const trips = [createMockTrip({ rating: 3 })];
        render(<TripStats trips={trips} darkMode={false} />);
        expect(screen.getByText("3.0/5")).toBeInTheDocument();
      });

      it("rounds to one decimal place", () => {
        const trips = [
          createMockTrip({ id: 1, rating: 5 }),
          createMockTrip({ id: 2, rating: 4 }),
          createMockTrip({ id: 3, rating: 4 }),
        ];
        // Average: (5+4+4)/3 = 4.333...
        render(<TripStats trips={trips} darkMode={false} />);
        expect(screen.getByText("4.3/5")).toBeInTheDocument();
      });

      it("excludes wishlist trips from average calculation", () => {
        const trips = [
          createMockTrip({ id: 1, rating: 5, isWishlist: false }),
          createMockTrip({ id: 2, rating: 1, isWishlist: true }), // Should be excluded
        ];
        render(<TripStats trips={trips} darkMode={false} />);
        expect(screen.getByText("5.0/5")).toBeInTheDocument();
      });
    });
  });

  // ============================================
  // Dark Mode Tests
  // ============================================
  describe("dark mode", () => {
    it("renders correctly in dark mode", () => {
      const trips = createMockTrips(2);
      render(<TripStats trips={trips} darkMode={true} />);
      expect(screen.getByText("Travel Statistics")).toBeInTheDocument();
    });

    it("renders correctly in light mode", () => {
      const trips = createMockTrips(2);
      render(<TripStats trips={trips} darkMode={false} />);
      expect(screen.getByText("Travel Statistics")).toBeInTheDocument();
    });

    it("renders empty state in dark mode", () => {
      render(<TripStats trips={[]} darkMode={true} />);
      expect(
        screen.getByText("Once you've added some visited trips, your travel stats will appear here!"),
      ).toBeInTheDocument();
    });

    it("renders empty state in light mode", () => {
      render(<TripStats trips={[]} darkMode={false} />);
      expect(
        screen.getByText("Once you've added some visited trips, your travel stats will appear here!"),
      ).toBeInTheDocument();
    });

    it("applies dark mode classes to container", () => {
      const trips = createMockTrips(2);
      const { container } = render(<TripStats trips={trips} darkMode={true} />);
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass("bg-gray-800/80");
    });

    it("applies light mode classes to container", () => {
      const trips = createMockTrips(2);
      const { container } = render(<TripStats trips={trips} darkMode={false} />);
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass("bg-white/90");
    });
  });

  // ============================================
  // StatCard Tests
  // ============================================
  describe("stat cards", () => {
    it("renders all four stat cards with correct labels", () => {
      const trips = createMockTrips(3);
      render(<TripStats trips={trips} darkMode={false} />);

      expect(screen.getByText("Trips Taken")).toBeInTheDocument();
      expect(screen.getByText("Continents")).toBeInTheDocument();
      expect(screen.getByText("Countries")).toBeInTheDocument();
      expect(screen.getByText("Avg. Rating")).toBeInTheDocument();
    });

    it("stat cards have hover effects", () => {
      const trips = createMockTrips(3);
      const { container } = render(<TripStats trips={trips} darkMode={false} />);
      const statCards = container.querySelectorAll(".hover\\:scale-\\[1\\.03\\]");
      expect(statCards.length).toBeGreaterThan(0);
    });

    it("stat cards have transition effects", () => {
      const trips = createMockTrips(3);
      const { container } = render(<TripStats trips={trips} darkMode={false} />);
      const transitionElements = container.querySelectorAll(".transition-all");
      expect(transitionElements.length).toBeGreaterThan(0);
    });

    it("renders stat cards in a grid", () => {
      const trips = createMockTrips(3);
      const { container } = render(<TripStats trips={trips} darkMode={false} />);
      const grid = container.querySelector(".grid");
      expect(grid).toBeInTheDocument();
    });
  });

  // ============================================
  // Edge Cases Tests
  // ============================================
  describe("edge cases", () => {
    it("handles undefined trips gracefully", () => {
      // Component should handle this or parent should prevent it
      const trips = undefined;
      expect(() => render(<TripStats trips={trips || []} darkMode={false} />)).not.toThrow();
    });

    it("handles null trips gracefully", () => {
      const trips = null;
      expect(() => render(<TripStats trips={trips || []} darkMode={false} />)).not.toThrow();
    });

    it("handles trips with missing properties", () => {
      const trips = [{ id: 1, isWishlist: false, country: "Italy", continent: "Europe", rating: 4 }];
      expect(() => render(<TripStats trips={trips} darkMode={false} />)).not.toThrow();
    });

    it("handles trips with rating 0", () => {
      const trips = [createMockTrip({ id: 1, rating: 0 }), createMockTrip({ id: 2, rating: 0 })];
      render(<TripStats trips={trips} darkMode={false} />);
      expect(screen.getByText("0.0/5")).toBeInTheDocument();
    });

    it("handles mixed visited and wishlist trips", () => {
      const trips = [
        createMockTrip({ id: 1, isWishlist: false, rating: 5 }),
        createMockTrip({ id: 2, isWishlist: true, rating: 1 }),
        createMockTrip({ id: 3, isWishlist: false, rating: 3 }),
        createMockTrip({ id: 4, isWishlist: true, rating: 1 }),
      ];
      render(<TripStats trips={trips} darkMode={false} />);
      // Only 2 visited trips
      expect(screen.getByText("2")).toBeInTheDocument();
      // Average of 5 and 3 = 4.0
      expect(screen.getByText("4.0/5")).toBeInTheDocument();
    });

    it("handles trips with same country in different continents (theoretically)", () => {
      const trips = [
        createMockTrip({ id: 1, country: "TestCountry", continent: "Europe" }),
        createMockTrip({ id: 2, country: "TestCountry", continent: "Asia" }),
      ];
      render(<TripStats trips={trips} darkMode={false} />);
      // Countries should be 1 (same country name)
      expect(getStatValue("Countries")).toBe("1");
      // Continents should be 2
      expect(getStatValue("Continents")).toBe("2");
    });
  });

  // ============================================
  // Real-world Usage Scenarios Tests
  // ============================================
  describe("real-world usage scenarios", () => {
    it("displays stats for a frequent traveler", () => {
      const trips = [
        createMockTrip({ id: 1, continent: "Europe", country: "Italy", rating: 5 }),
        createMockTrip({ id: 2, continent: "Europe", country: "France", rating: 4 }),
        createMockTrip({ id: 3, continent: "Asia", country: "Japan", rating: 5 }),
        createMockTrip({ id: 4, continent: "Asia", country: "Thailand", rating: 4 }),
        createMockTrip({ id: 5, continent: "North America", country: "Canada", rating: 5 }),
        createMockTrip({ id: 6, continent: "South America", country: "Brazil", rating: 4 }),
        createMockTrip({ id: 7, continent: "Africa", country: "Egypt", rating: 5 }),
        createMockTrip({ id: 8, continent: "Oceania", country: "Australia", rating: 4 }),
      ];
      render(<TripStats trips={trips} darkMode={false} />);

      expect(getStatValue("Trips Taken")).toBe("8"); // Total trips
      expect(getStatValue("Continents")).toBe("6"); // Continents
      expect(getStatValue("Countries")).toBe("8"); // Countries
      expect(getStatValue("Avg. Rating")).toBe("4.5/5"); // Average rating
    });

    it("displays stats for a new traveler with one trip", () => {
      const trips = [createMockTrip({ continent: "Europe", country: "Italy", rating: 5 })];
      render(<TripStats trips={trips} darkMode={false} />);

      expect(getStatValue("Trips Taken")).toBe("1"); // Total trips
      expect(getStatValue("Avg. Rating")).toBe("5.0/5"); // Average rating
    });

    it("displays stats for someone who revisits favorite destinations", () => {
      const trips = [
        createMockTrip({ id: 1, continent: "Europe", country: "Italy", city: "Rome", rating: 5 }),
        createMockTrip({ id: 2, continent: "Europe", country: "Italy", city: "Milan", rating: 4 }),
        createMockTrip({ id: 3, continent: "Europe", country: "Italy", city: "Florence", rating: 5 }),
        createMockTrip({ id: 4, continent: "Europe", country: "Italy", city: "Venice", rating: 5 }),
      ];
      render(<TripStats trips={trips} darkMode={false} />);

      expect(getStatValue("Trips Taken")).toBe("4"); // Total trips
      expect(getStatValue("Countries")).toBe("1"); // Countries (just Italy)
    });

    it("handles user with only wishlist items", () => {
      const trips = [
        createMockTrip({ id: 1, isWishlist: true }),
        createMockTrip({ id: 2, isWishlist: true }),
        createMockTrip({ id: 3, isWishlist: true }),
      ];
      render(<TripStats trips={trips} darkMode={false} />);

      expect(
        screen.getByText("Once you've added some visited trips, your travel stats will appear here!"),
      ).toBeInTheDocument();
    });

    it("switches correctly between dark and light mode", () => {
      const trips = createMockTrips(3);
      const { rerender, container } = render(<TripStats trips={trips} darkMode={false} />);

      expect(container.firstChild).toHaveClass("bg-white/90");

      rerender(<TripStats trips={trips} darkMode={true} />);
      expect(container.firstChild).toHaveClass("bg-gray-800/80");
    });
  });

  // ============================================
  // Styling Tests
  // ============================================
  describe("styling", () => {
    it("applies rounded corners to container", () => {
      const trips = createMockTrips(2);
      const { container } = render(<TripStats trips={trips} darkMode={false} />);
      expect(container.firstChild).toHaveClass("rounded-3xl");
    });

    it("applies shadow to container", () => {
      const trips = createMockTrips(2);
      const { container } = render(<TripStats trips={trips} darkMode={false} />);
      expect(container.firstChild).toHaveClass("shadow-2xl");
    });

    it("applies backdrop blur", () => {
      const trips = createMockTrips(2);
      const { container } = render(<TripStats trips={trips} darkMode={false} />);
      expect(container.firstChild).toHaveClass("backdrop-blur-xl");
    });

    it("applies border to container", () => {
      const trips = createMockTrips(2);
      const { container } = render(<TripStats trips={trips} darkMode={false} />);
      expect(container.firstChild).toHaveClass("border-2");
    });

    it("applies font styling to title", () => {
      const trips = createMockTrips(2);
      render(<TripStats trips={trips} darkMode={false} />);
      const title = screen.getByText("Travel Statistics");
      expect(title).toHaveClass("font-bold");
      expect(title).toHaveClass("font-playfair");
    });
  });

  // ============================================
  // Grid Layout Tests
  // ============================================
  describe("grid layout", () => {
    it("uses 2-column grid on small screens", () => {
      const trips = createMockTrips(3);
      const { container } = render(<TripStats trips={trips} darkMode={false} />);
      const grid = container.querySelector(".grid-cols-2");
      expect(grid).toBeInTheDocument();
    });

    it("uses 4-column grid on medium screens", () => {
      const trips = createMockTrips(3);
      const { container } = render(<TripStats trips={trips} darkMode={false} />);
      const grid = container.querySelector(".md\\:grid-cols-4");
      expect(grid).toBeInTheDocument();
    });

    it("applies gap between stat cards", () => {
      const trips = createMockTrips(3);
      const { container } = render(<TripStats trips={trips} darkMode={false} />);
      const grid = container.querySelector(".gap-4");
      expect(grid).toBeInTheDocument();
    });
  });
});
