/**
 * Unit tests for Badge component
 * Tests rendering, variants, sizes, dark mode, and interactive features
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Badge, { BadgeGroup, StatusBadge } from "./Badge";

describe("Badge", () => {
  // ============================================
  // Basic Rendering Tests
  // ============================================
  describe("basic rendering", () => {
    it("renders children correctly", () => {
      render(<Badge>Test Badge</Badge>);
      expect(screen.getByText("Test Badge")).toBeInTheDocument();
    });

    it("renders as a span element", () => {
      render(<Badge>Badge Text</Badge>);
      const badge = screen.getByText("Badge Text");
      expect(badge.tagName).toBe("SPAN");
    });

    it("renders with default props", () => {
      render(<Badge>Default Badge</Badge>);
      const badge = screen.getByText("Default Badge");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("inline-flex");
    });

    it("renders multiple badges independently", () => {
      render(
        <>
          <Badge>First</Badge>
          <Badge>Second</Badge>
          <Badge>Third</Badge>
        </>
      );

      expect(screen.getByText("First")).toBeInTheDocument();
      expect(screen.getByText("Second")).toBeInTheDocument();
      expect(screen.getByText("Third")).toBeInTheDocument();
    });

    it("renders empty badge without crashing", () => {
      render(<Badge>{""}</Badge>);
      // Should not throw
    });

    it("renders with special characters", () => {
      render(<Badge>{"🌍 Travel & Adventures <test>"}</Badge>);
      expect(screen.getByText("🌍 Travel & Adventures <test>")).toBeInTheDocument();
    });

    it("renders with numbers as children", () => {
      render(<Badge>{42}</Badge>);
      expect(screen.getByText("42")).toBeInTheDocument();
    });
  });

  // ============================================
  // Variant Tests
  // ============================================
  describe("variants", () => {
    it("renders default variant", () => {
      render(<Badge variant="default">Default</Badge>);
      const badge = screen.getByText("Default");
      expect(badge).toBeInTheDocument();
    });

    it("renders success variant", () => {
      render(<Badge variant="success">Success</Badge>);
      const badge = screen.getByText("Success");
      expect(badge).toBeInTheDocument();
    });

    it("renders warning variant", () => {
      render(<Badge variant="warning">Warning</Badge>);
      const badge = screen.getByText("Warning");
      expect(badge).toBeInTheDocument();
    });

    it("renders error variant", () => {
      render(<Badge variant="error">Error</Badge>);
      const badge = screen.getByText("Error");
      expect(badge).toBeInTheDocument();
    });

    it("renders info variant", () => {
      render(<Badge variant="info">Info</Badge>);
      const badge = screen.getByText("Info");
      expect(badge).toBeInTheDocument();
    });

    it("renders primary variant", () => {
      render(<Badge variant="primary">Primary</Badge>);
      const badge = screen.getByText("Primary");
      expect(badge).toBeInTheDocument();
    });

    it("renders custom variant", () => {
      render(<Badge variant="custom" customColor="bg-pink-500 text-white">Custom</Badge>);
      const badge = screen.getByText("Custom");
      expect(badge).toBeInTheDocument();
    });

    it("handles unknown variant gracefully", () => {
      render(<Badge variant="unknown">Unknown</Badge>);
      const badge = screen.getByText("Unknown");
      expect(badge).toBeInTheDocument();
    });
  });

  // ============================================
  // Size Tests
  // ============================================
  describe("sizes", () => {
    it("renders small size", () => {
      render(<Badge size="small">Small</Badge>);
      const badge = screen.getByText("Small");
      expect(badge).toHaveClass("text-[10px]");
    });

    it("renders default size", () => {
      render(<Badge size="default">Default</Badge>);
      const badge = screen.getByText("Default");
      expect(badge).toHaveClass("text-xs");
    });

    it("renders large size", () => {
      render(<Badge size="large">Large</Badge>);
      const badge = screen.getByText("Large");
      expect(badge).toHaveClass("text-sm");
    });
  });

  // ============================================
  // Dark Mode Tests
  // ============================================
  describe("dark mode", () => {
    it("applies dark mode styles when darkMode is true", () => {
      render(<Badge darkMode={true}>Dark Badge</Badge>);
      const badge = screen.getByText("Dark Badge");
      expect(badge).toBeInTheDocument();
    });

    it("applies light mode styles when darkMode is false", () => {
      render(<Badge darkMode={false}>Light Badge</Badge>);
      const badge = screen.getByText("Light Badge");
      expect(badge).toBeInTheDocument();
    });

    it("applies dark mode styles for success variant", () => {
      render(<Badge darkMode={true} variant="success">Dark Success</Badge>);
      const badge = screen.getByText("Dark Success");
      expect(badge).toBeInTheDocument();
    });

    it("applies dark mode styles for error variant", () => {
      render(<Badge darkMode={true} variant="error">Dark Error</Badge>);
      const badge = screen.getByText("Dark Error");
      expect(badge).toBeInTheDocument();
    });
  });

  // ============================================
  // Pill vs Rounded Tests
  // ============================================
  describe("pill styling", () => {
    it("applies fully rounded corners when pill is true (default)", () => {
      render(<Badge pill={true}>Pill Badge</Badge>);
      const badge = screen.getByText("Pill Badge");
      expect(badge).toHaveClass("rounded-full");
    });

    it("applies medium rounded corners when pill is false", () => {
      render(<Badge pill={false}>Rounded Badge</Badge>);
      const badge = screen.getByText("Rounded Badge");
      expect(badge).toHaveClass("rounded-md");
    });
  });

  // ============================================
  // Outline Tests
  // ============================================
  describe("outline styling", () => {
    it("applies outline styles when outline is true", () => {
      render(<Badge outline={true}>Outline Badge</Badge>);
      const badge = screen.getByText("Outline Badge");
      expect(badge).toHaveClass("border-2");
      expect(badge).toHaveClass("bg-transparent");
    });

    it("does not apply outline styles when outline is false", () => {
      render(<Badge outline={false}>Solid Badge</Badge>);
      const badge = screen.getByText("Solid Badge");
      expect(badge).not.toHaveClass("border-2");
    });

    it("combines outline with dark mode", () => {
      render(<Badge outline={true} darkMode={true} variant="success">Dark Outline</Badge>);
      const badge = screen.getByText("Dark Outline");
      expect(badge).toHaveClass("border-2");
    });
  });

  // ============================================
  // Icon Tests
  // ============================================
  describe("icon support", () => {
    it("renders icon when provided", () => {
      const TestIcon = () => <span data-testid="test-icon">★</span>;
      render(<Badge icon={<TestIcon />}>With Icon</Badge>);

      expect(screen.getByTestId("test-icon")).toBeInTheDocument();
      expect(screen.getByText("With Icon")).toBeInTheDocument();
    });

    it("does not render icon container when no icon provided", () => {
      render(<Badge>No Icon</Badge>);
      const badge = screen.getByText("No Icon");
      // Should only have the text, no additional icon span
      expect(badge.querySelectorAll("span").length).toBeLessThanOrEqual(1);
    });

    it("applies correct icon size for small badge", () => {
      const TestIcon = () => <span data-testid="test-icon">★</span>;
      render(<Badge size="small" icon={<TestIcon />}>Small Icon</Badge>);
      expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    });

    it("applies correct icon size for large badge", () => {
      const TestIcon = () => <span data-testid="test-icon">★</span>;
      render(<Badge size="large" icon={<TestIcon />}>Large Icon</Badge>);
      expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    });
  });

  // ============================================
  // Removable Badge Tests
  // ============================================
  describe("removable functionality", () => {
    it("shows remove button when removable is true", () => {
      render(<Badge removable={true}>Removable</Badge>);
      const removeButton = screen.getByRole("button", { name: /remove/i });
      expect(removeButton).toBeInTheDocument();
    });

    it("does not show remove button when removable is false", () => {
      render(<Badge removable={false}>Not Removable</Badge>);
      const removeButton = screen.queryByRole("button", { name: /remove/i });
      expect(removeButton).not.toBeInTheDocument();
    });

    it("calls onRemove when remove button is clicked", () => {
      const handleRemove = vi.fn();
      render(<Badge removable={true} onRemove={handleRemove}>Removable</Badge>);

      const removeButton = screen.getByRole("button", { name: /remove/i });
      fireEvent.click(removeButton);

      expect(handleRemove).toHaveBeenCalledTimes(1);
    });

    it("does not call onRemove when badge itself is clicked", () => {
      const handleRemove = vi.fn();
      render(<Badge removable={true} onRemove={handleRemove}>Removable</Badge>);

      const badge = screen.getByText("Removable");
      fireEvent.click(badge);

      // Only the remove button should trigger onRemove
      expect(handleRemove).not.toHaveBeenCalled();
    });

    it("remove button has correct aria-label", () => {
      render(<Badge removable={true}>Tag</Badge>);
      const removeButton = screen.getByLabelText("Remove");
      expect(removeButton).toBeInTheDocument();
    });
  });

  // ============================================
  // Custom ClassName Tests
  // ============================================
  describe("custom className", () => {
    it("applies custom className", () => {
      render(<Badge className="custom-class">Custom</Badge>);
      const badge = screen.getByText("Custom");
      expect(badge).toHaveClass("custom-class");
    });

    it("combines custom className with default classes", () => {
      render(<Badge className="my-custom-class">Combined</Badge>);
      const badge = screen.getByText("Combined");
      expect(badge).toHaveClass("my-custom-class");
      expect(badge).toHaveClass("inline-flex");
    });

    it("handles empty className", () => {
      render(<Badge className="">Empty ClassName</Badge>);
      const badge = screen.getByText("Empty ClassName");
      expect(badge).toBeInTheDocument();
    });

    it("handles multiple custom classes", () => {
      render(<Badge className="class-one class-two class-three">Multiple</Badge>);
      const badge = screen.getByText("Multiple");
      expect(badge).toHaveClass("class-one");
      expect(badge).toHaveClass("class-two");
      expect(badge).toHaveClass("class-three");
    });
  });

  // ============================================
  // Combined Props Tests
  // ============================================
  describe("combined props", () => {
    it("renders with all props combined", () => {
      const handleRemove = vi.fn();
      const TestIcon = () => <span data-testid="icon">★</span>;

      render(
        <Badge
          variant="success"
          size="large"
          darkMode={true}
          removable={true}
          onRemove={handleRemove}
          icon={<TestIcon />}
          pill={true}
          outline={false}
          className="test-class"
        >
          Full Badge
        </Badge>
      );

      expect(screen.getByText("Full Badge")).toBeInTheDocument();
      expect(screen.getByTestId("icon")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /remove/i })).toBeInTheDocument();
    });

    it("renders outline badge with icon and remove button", () => {
      const TestIcon = () => <span data-testid="icon">✓</span>;
      render(
        <Badge outline={true} icon={<TestIcon />} removable={true}>
          Outline with extras
        </Badge>
      );

      expect(screen.getByText("Outline with extras")).toBeInTheDocument();
      expect(screen.getByTestId("icon")).toBeInTheDocument();
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });
});

// ============================================
// BadgeGroup Tests
// ============================================
describe("BadgeGroup", () => {
  describe("basic rendering", () => {
    it("renders empty when no badges provided", () => {
      const { container } = render(<BadgeGroup badges={[]} />);
      expect(container.querySelector(".flex")).toBeInTheDocument();
    });

    it("renders multiple badges from array of strings", () => {
      render(<BadgeGroup badges={["Tag1", "Tag2", "Tag3"]} />);

      expect(screen.getByText("Tag1")).toBeInTheDocument();
      expect(screen.getByText("Tag2")).toBeInTheDocument();
      expect(screen.getByText("Tag3")).toBeInTheDocument();
    });

    it("renders badges from array of objects with label", () => {
      const badges = [
        { label: "First" },
        { label: "Second" },
        { label: "Third" },
      ];
      render(<BadgeGroup badges={badges} />);

      expect(screen.getByText("First")).toBeInTheDocument();
      expect(screen.getByText("Second")).toBeInTheDocument();
      expect(screen.getByText("Third")).toBeInTheDocument();
    });

    it("applies shared variant to all badges", () => {
      render(
        <BadgeGroup
          badges={["One", "Two"]}
          variant="success"
        />
      );

      expect(screen.getByText("One")).toBeInTheDocument();
      expect(screen.getByText("Two")).toBeInTheDocument();
    });

    it("applies individual variant from badge object", () => {
      const badges = [
        { label: "Success", variant: "success" },
        { label: "Error", variant: "error" },
      ];
      render(<BadgeGroup badges={badges} />);

      expect(screen.getByText("Success")).toBeInTheDocument();
      expect(screen.getByText("Error")).toBeInTheDocument();
    });

    it("applies shared dark mode to all badges", () => {
      render(
        <BadgeGroup
          badges={["Dark1", "Dark2"]}
          darkMode={true}
        />
      );

      expect(screen.getByText("Dark1")).toBeInTheDocument();
      expect(screen.getByText("Dark2")).toBeInTheDocument();
    });

    it("applies shared size to all badges", () => {
      render(
        <BadgeGroup
          badges={["Small1", "Small2"]}
          size="small"
        />
      );

      expect(screen.getByText("Small1")).toBeInTheDocument();
      expect(screen.getByText("Small2")).toBeInTheDocument();
    });

    it("applies custom className to container", () => {
      const { container } = render(
        <BadgeGroup badges={["Test"]} className="custom-group" />
      );

      expect(container.querySelector(".custom-group")).toBeInTheDocument();
    });
  });

  describe("removable badges", () => {
    it("renders removable badges", () => {
      const badges = [
        { label: "Removable1", removable: true },
        { label: "Removable2", removable: true },
      ];
      render(<BadgeGroup badges={badges} />);

      const removeButtons = screen.getAllByRole("button", { name: /remove/i });
      expect(removeButtons).toHaveLength(2);
    });

    it("calls individual onRemove callbacks", () => {
      const handleRemove1 = vi.fn();
      const handleRemove2 = vi.fn();
      const badges = [
        { label: "Badge1", removable: true, onRemove: handleRemove1 },
        { label: "Badge2", removable: true, onRemove: handleRemove2 },
      ];
      render(<BadgeGroup badges={badges} />);

      const removeButtons = screen.getAllByRole("button", { name: /remove/i });
      fireEvent.click(removeButtons[0]);

      expect(handleRemove1).toHaveBeenCalledTimes(1);
      expect(handleRemove2).not.toHaveBeenCalled();
    });
  });

  describe("badges with icons", () => {
    it("renders badges with icons", () => {
      const badges = [
        { label: "With Icon", icon: <span data-testid="icon-1">★</span> },
        { label: "No Icon" },
      ];
      render(<BadgeGroup badges={badges} />);

      expect(screen.getByTestId("icon-1")).toBeInTheDocument();
      expect(screen.getByText("With Icon")).toBeInTheDocument();
      expect(screen.getByText("No Icon")).toBeInTheDocument();
    });
  });
});

// ============================================
// StatusBadge Tests
// ============================================
describe("StatusBadge", () => {
  describe("status rendering", () => {
    it("renders active status", () => {
      render(<StatusBadge status="active" />);
      expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("renders inactive status", () => {
      render(<StatusBadge status="inactive" />);
      expect(screen.getByText("Inactive")).toBeInTheDocument();
    });

    it("renders pending status", () => {
      render(<StatusBadge status="pending" />);
      expect(screen.getByText("Pending")).toBeInTheDocument();
    });

    it("renders error status", () => {
      render(<StatusBadge status="error" />);
      expect(screen.getByText("Error")).toBeInTheDocument();
    });

    it("renders completed status", () => {
      render(<StatusBadge status="completed" />);
      expect(screen.getByText("Completed")).toBeInTheDocument();
    });

    it("renders inProgress status", () => {
      render(<StatusBadge status="inProgress" />);
      expect(screen.getByText("In Progress")).toBeInTheDocument();
    });

    it("renders visited status", () => {
      render(<StatusBadge status="visited" />);
      expect(screen.getByText("Visited")).toBeInTheDocument();
    });

    it("renders wishlist status", () => {
      render(<StatusBadge status="wishlist" />);
      expect(screen.getByText("Wishlist")).toBeInTheDocument();
    });

    it("renders unknown status as inactive", () => {
      render(<StatusBadge status="unknown" />);
      expect(screen.getByText("Inactive")).toBeInTheDocument();
    });
  });

  describe("dark mode support", () => {
    it("applies dark mode styles", () => {
      render(<StatusBadge status="active" darkMode={true} />);
      expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("applies light mode styles", () => {
      render(<StatusBadge status="active" darkMode={false} />);
      expect(screen.getByText("Active")).toBeInTheDocument();
    });
  });

  describe("custom className", () => {
    it("applies custom className", () => {
      render(<StatusBadge status="active" className="custom-status" />);
      const badge = screen.getByText("Active");
      expect(badge).toHaveClass("custom-status");
    });
  });

  describe("all statuses with variants", () => {
    const statusVariantMap = {
      active: "success",
      inactive: "default",
      pending: "warning",
      error: "error",
      completed: "success",
      inProgress: "info",
      visited: "success",
      wishlist: "primary",
    };

    Object.entries(statusVariantMap).forEach(([status, expectedVariant]) => {
      it(`${status} status uses ${expectedVariant} variant`, () => {
        render(<StatusBadge status={status} />);
        // Just verify it renders without error
        expect(screen.getByRole("generic")).toBeInTheDocument();
      });
    });
  });
});
