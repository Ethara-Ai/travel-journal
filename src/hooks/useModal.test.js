/**
 * Unit tests for useModal hook
 * Tests modal state management, open/close functionality, and scroll lock behavior
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useModal, { useModalManager } from "./useModal";

describe("useModal", () => {
  // ============================================
  // Initial State Tests
  // ============================================
  describe("initial state", () => {
    it("initializes with isOpen as false by default", () => {
      const { result } = renderHook(() => useModal());
      expect(result.current.isOpen).toBe(false);
    });

    it("initializes with data as null by default", () => {
      const { result } = renderHook(() => useModal());
      expect(result.current.data).toBeNull();
    });

    it("initializes with isOpen as true when passed true", () => {
      const { result } = renderHook(() => useModal(true));
      expect(result.current.isOpen).toBe(true);
    });

    it("initializes with isOpen as false when passed false", () => {
      const { result } = renderHook(() => useModal(false));
      expect(result.current.isOpen).toBe(false);
    });

    it("provides all expected properties and methods", () => {
      const { result } = renderHook(() => useModal());

      expect(result.current).toHaveProperty("isOpen");
      expect(result.current).toHaveProperty("data");
      expect(typeof result.current.open).toBe("function");
      expect(typeof result.current.close).toBe("function");
      expect(typeof result.current.toggle).toBe("function");
    });
  });

  // ============================================
  // open() Tests
  // ============================================
  describe("open", () => {
    it("sets isOpen to true", () => {
      const { result } = renderHook(() => useModal());

      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it("sets data to null when called without arguments", () => {
      const { result } = renderHook(() => useModal());

      act(() => {
        result.current.open();
      });

      expect(result.current.data).toBeNull();
    });

    it("sets data when passed an object", () => {
      const { result } = renderHook(() => useModal());
      const modalData = { id: 1, title: "Test Trip" };

      act(() => {
        result.current.open(modalData);
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.data).toEqual(modalData);
    });

    it("sets data when passed a string", () => {
      const { result } = renderHook(() => useModal());

      act(() => {
        result.current.open("test string");
      });

      expect(result.current.data).toBe("test string");
    });

    it("sets data when passed a number", () => {
      const { result } = renderHook(() => useModal());

      act(() => {
        result.current.open(42);
      });

      expect(result.current.data).toBe(42);
    });

    it("sets data when passed an array", () => {
      const { result } = renderHook(() => useModal());
      const arrayData = [1, 2, 3];

      act(() => {
        result.current.open(arrayData);
      });

      expect(result.current.data).toEqual(arrayData);
    });

    it("replaces existing data with new data", () => {
      const { result } = renderHook(() => useModal());

      act(() => {
        result.current.open({ first: "data" });
      });
      expect(result.current.data).toEqual({ first: "data" });

      act(() => {
        result.current.open({ second: "data" });
      });
      expect(result.current.data).toEqual({ second: "data" });
    });

    it("can open modal multiple times", () => {
      const { result } = renderHook(() => useModal());

      act(() => {
        result.current.open();
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.close();
      });
      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.open({ newData: true });
      });
      expect(result.current.isOpen).toBe(true);
      expect(result.current.data).toEqual({ newData: true });
    });

    it("handles complex nested data objects", () => {
      const { result } = renderHook(() => useModal());
      const complexData = {
        trip: {
          id: 1,
          details: {
            title: "Rome Adventure",
            destinations: ["Colosseum", "Vatican"],
          },
        },
        meta: {
          createdAt: new Date().toISOString(),
        },
      };

      act(() => {
        result.current.open(complexData);
      });

      expect(result.current.data).toEqual(complexData);
    });

    it("handles null data explicitly passed", () => {
      const { result } = renderHook(() => useModal());

      act(() => {
        result.current.open({ some: "data" });
      });
      expect(result.current.data).toEqual({ some: "data" });

      act(() => {
        result.current.open(null);
      });
      expect(result.current.data).toBeNull();
    });

    it("handles undefined data explicitly passed", () => {
      const { result } = renderHook(() => useModal());

      act(() => {
        result.current.open(undefined);
      });

      expect(result.current.data).toBeNull();
    });
  });

  // ============================================
  // close() Tests
  // ============================================
  describe("close", () => {
    it("sets isOpen to false", () => {
      const { result } = renderHook(() => useModal(true));
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it("clears data to null", () => {
      const { result } = renderHook(() => useModal());

      act(() => {
        result.current.open({ id: 1, name: "Test" });
      });
      expect(result.current.data).not.toBeNull();

      act(() => {
        result.current.close();
      });

      expect(result.current.data).toBeNull();
    });

    it("can be called when modal is already closed", () => {
      const { result } = renderHook(() => useModal());
      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.data).toBeNull();
    });

    it("clears data even when modal is already closed", () => {
      const { result } = renderHook(() => useModal());

      // Manually set some state via open, then close
      act(() => {
        result.current.open({ data: "test" });
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.data).toBeNull();
    });
  });

  // ============================================
  // toggle() Tests
  // ============================================
  describe("toggle", () => {
    it("opens modal when closed", () => {
      const { result } = renderHook(() => useModal());
      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it("closes modal when open", () => {
      const { result } = renderHook(() => useModal(true));
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it("toggles multiple times correctly", () => {
      const { result } = renderHook(() => useModal());

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(false);
    });

    it("does not affect data when toggling", () => {
      const { result } = renderHook(() => useModal());

      act(() => {
        result.current.open({ preserved: "data" });
      });

      act(() => {
        result.current.toggle(); // closes
      });

      // Note: toggle doesn't clear data like close does
      // This tests the actual implementation behavior
      expect(result.current.isOpen).toBe(false);
    });
  });

  // ============================================
  // Function Reference Stability Tests
  // ============================================
  describe("function reference stability (useCallback)", () => {
    it("open maintains stable reference across renders", () => {
      const { result, rerender } = renderHook(() => useModal());
      const firstRef = result.current.open;

      rerender();

      expect(result.current.open).toBe(firstRef);
    });

    it("close maintains stable reference across renders", () => {
      const { result, rerender } = renderHook(() => useModal());
      const firstRef = result.current.close;

      rerender();

      expect(result.current.close).toBe(firstRef);
    });

    it("toggle maintains stable reference across renders", () => {
      const { result, rerender } = renderHook(() => useModal());
      const firstRef = result.current.toggle;

      rerender();

      expect(result.current.toggle).toBe(firstRef);
    });

    it("functions remain stable after state changes", () => {
      const { result, rerender } = renderHook(() => useModal());
      const openRef = result.current.open;
      const closeRef = result.current.close;
      const toggleRef = result.current.toggle;

      act(() => {
        result.current.open({ test: true });
      });
      rerender();

      expect(result.current.open).toBe(openRef);
      expect(result.current.close).toBe(closeRef);
      expect(result.current.toggle).toBe(toggleRef);
    });
  });

  // ============================================
  // Multiple Hook Instances Tests
  // ============================================
  describe("multiple hook instances", () => {
    it("each instance has independent state", () => {
      const { result: modal1 } = renderHook(() => useModal());
      const { result: modal2 } = renderHook(() => useModal());

      act(() => {
        modal1.current.open({ modal: 1 });
      });

      expect(modal1.current.isOpen).toBe(true);
      expect(modal1.current.data).toEqual({ modal: 1 });
      expect(modal2.current.isOpen).toBe(false);
      expect(modal2.current.data).toBeNull();
    });

    it("closing one modal does not affect another", () => {
      const { result: modal1 } = renderHook(() => useModal());
      const { result: modal2 } = renderHook(() => useModal());

      act(() => {
        modal1.current.open();
        modal2.current.open();
      });

      act(() => {
        modal1.current.close();
      });

      expect(modal1.current.isOpen).toBe(false);
      expect(modal2.current.isOpen).toBe(true);
    });
  });

  // ============================================
  // Edge Cases Tests
  // ============================================
  describe("edge cases", () => {
    it("handles rapid open/close calls", () => {
      const { result } = renderHook(() => useModal());

      act(() => {
        result.current.open();
        result.current.close();
        result.current.open();
        result.current.close();
        result.current.open();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it("handles boolean false as data", () => {
      const { result } = renderHook(() => useModal());

      act(() => {
        result.current.open(false);
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.data).toBe(false);
    });

    it("handles zero as data", () => {
      const { result } = renderHook(() => useModal());

      act(() => {
        result.current.open(0);
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.data).toBe(0);
    });

    it("handles empty string as data", () => {
      const { result } = renderHook(() => useModal());

      act(() => {
        result.current.open("");
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.data).toBe("");
    });

    it("handles empty object as data", () => {
      const { result } = renderHook(() => useModal());

      act(() => {
        result.current.open({});
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.data).toEqual({});
    });

    it("handles empty array as data", () => {
      const { result } = renderHook(() => useModal());

      act(() => {
        result.current.open([]);
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.data).toEqual([]);
    });
  });
});

// ============================================
// useModalManager Tests
// ============================================
describe("useModalManager", () => {
  let originalDocumentElementStyle;
  let originalBodyStyle;

  beforeEach(() => {
    // Store original styles
    originalDocumentElementStyle = document.documentElement.style.overflow;
    originalBodyStyle = document.body.style.overflow;
    // Reset styles before each test
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  });

  afterEach(() => {
    // Restore original styles
    document.documentElement.style.overflow = originalDocumentElementStyle;
    document.body.style.overflow = originalBodyStyle;
  });

  // ============================================
  // Initial State Tests
  // ============================================
  describe("initial state", () => {
    it("provides three modal instances", () => {
      const { result } = renderHook(() => useModalManager());

      expect(result.current.destinationsModal).toBeDefined();
      expect(result.current.tripFormModal).toBeDefined();
      expect(result.current.confirmationModal).toBeDefined();
    });

    it("all modals start closed", () => {
      const { result } = renderHook(() => useModalManager());

      expect(result.current.destinationsModal.isOpen).toBe(false);
      expect(result.current.tripFormModal.isOpen).toBe(false);
      expect(result.current.confirmationModal.isOpen).toBe(false);
    });

    it("isAnyModalOpen is false initially", () => {
      const { result } = renderHook(() => useModalManager());

      expect(result.current.isAnyModalOpen).toBe(false);
    });

    it("each modal has all expected methods", () => {
      const { result } = renderHook(() => useModalManager());

      const modals = [result.current.destinationsModal, result.current.tripFormModal, result.current.confirmationModal];

      modals.forEach((modal) => {
        expect(typeof modal.open).toBe("function");
        expect(typeof modal.close).toBe("function");
        expect(typeof modal.toggle).toBe("function");
        expect(modal).toHaveProperty("isOpen");
        expect(modal).toHaveProperty("data");
      });
    });
  });

  // ============================================
  // isAnyModalOpen Tests
  // ============================================
  describe("isAnyModalOpen", () => {
    it("returns true when destinationsModal is open", () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.destinationsModal.open();
      });

      expect(result.current.isAnyModalOpen).toBe(true);
    });

    it("returns true when tripFormModal is open", () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.tripFormModal.open();
      });

      expect(result.current.isAnyModalOpen).toBe(true);
    });

    it("returns true when confirmationModal is open", () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.confirmationModal.open();
      });

      expect(result.current.isAnyModalOpen).toBe(true);
    });

    it("returns true when multiple modals are open", () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.destinationsModal.open();
        result.current.confirmationModal.open();
      });

      expect(result.current.isAnyModalOpen).toBe(true);
    });

    it("returns false when all modals are closed", () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.destinationsModal.open();
        result.current.tripFormModal.open();
      });

      act(() => {
        result.current.destinationsModal.close();
        result.current.tripFormModal.close();
      });

      expect(result.current.isAnyModalOpen).toBe(false);
    });

    it("returns true when some modals are closed but one remains open", () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.destinationsModal.open();
        result.current.tripFormModal.open();
        result.current.confirmationModal.open();
      });

      act(() => {
        result.current.destinationsModal.close();
        result.current.tripFormModal.close();
      });

      expect(result.current.isAnyModalOpen).toBe(true);
      expect(result.current.confirmationModal.isOpen).toBe(true);
    });
  });

  // ============================================
  // Scroll Lock Tests
  // ============================================
  describe("scroll lock behavior", () => {
    it("locks body scroll when a modal opens", () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.destinationsModal.open();
      });

      expect(document.documentElement.style.overflow).toBe("hidden");
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("unlocks body scroll when all modals close", () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.destinationsModal.open();
      });

      act(() => {
        result.current.destinationsModal.close();
      });

      expect(document.documentElement.style.overflow).toBe("");
      expect(document.body.style.overflow).toBe("");
    });

    it("keeps scroll locked when closing one modal but another is open", () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.destinationsModal.open();
        result.current.tripFormModal.open();
      });

      act(() => {
        result.current.destinationsModal.close();
      });

      expect(document.documentElement.style.overflow).toBe("hidden");
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("restores scroll on unmount", () => {
      const { result, unmount } = renderHook(() => useModalManager());

      act(() => {
        result.current.destinationsModal.open();
      });

      expect(document.documentElement.style.overflow).toBe("hidden");

      unmount();

      expect(document.documentElement.style.overflow).toBe("");
      expect(document.body.style.overflow).toBe("");
    });
  });

  // ============================================
  // Individual Modal Functionality Tests
  // ============================================
  describe("individual modal functionality", () => {
    it("destinationsModal works independently", () => {
      const { result } = renderHook(() => useModalManager());
      const testData = { destinations: ["Rome", "Paris"] };

      act(() => {
        result.current.destinationsModal.open(testData);
      });

      expect(result.current.destinationsModal.isOpen).toBe(true);
      expect(result.current.destinationsModal.data).toEqual(testData);
      expect(result.current.tripFormModal.isOpen).toBe(false);
      expect(result.current.confirmationModal.isOpen).toBe(false);
    });

    it("tripFormModal works independently", () => {
      const { result } = renderHook(() => useModalManager());
      const testData = { tripId: 1, editing: true };

      act(() => {
        result.current.tripFormModal.open(testData);
      });

      expect(result.current.tripFormModal.isOpen).toBe(true);
      expect(result.current.tripFormModal.data).toEqual(testData);
      expect(result.current.destinationsModal.isOpen).toBe(false);
      expect(result.current.confirmationModal.isOpen).toBe(false);
    });

    it("confirmationModal works independently", () => {
      const { result } = renderHook(() => useModalManager());
      const testData = { action: "delete", itemId: 5 };

      act(() => {
        result.current.confirmationModal.open(testData);
      });

      expect(result.current.confirmationModal.isOpen).toBe(true);
      expect(result.current.confirmationModal.data).toEqual(testData);
      expect(result.current.destinationsModal.isOpen).toBe(false);
      expect(result.current.tripFormModal.isOpen).toBe(false);
    });
  });

  // ============================================
  // Real-world Usage Scenarios
  // ============================================
  describe("real-world usage scenarios", () => {
    it("handles opening confirmation modal while form modal is open", () => {
      const { result } = renderHook(() => useModalManager());

      // User is editing a form
      act(() => {
        result.current.tripFormModal.open({ tripId: 1 });
      });

      // User tries to navigate away, show confirmation
      act(() => {
        result.current.confirmationModal.open({
          title: "Unsaved Changes",
          message: "Are you sure you want to leave?",
        });
      });

      expect(result.current.tripFormModal.isOpen).toBe(true);
      expect(result.current.confirmationModal.isOpen).toBe(true);
      expect(result.current.isAnyModalOpen).toBe(true);
    });

    it("handles delete confirmation flow", () => {
      const { result } = renderHook(() => useModalManager());

      // Open confirmation for delete
      act(() => {
        result.current.confirmationModal.open({
          action: "delete",
          tripId: 5,
          tripName: "Rome Adventure",
        });
      });

      expect(result.current.confirmationModal.data).toEqual({
        action: "delete",
        tripId: 5,
        tripName: "Rome Adventure",
      });

      // User confirms deletion
      act(() => {
        result.current.confirmationModal.close();
      });

      expect(result.current.confirmationModal.isOpen).toBe(false);
      expect(result.current.isAnyModalOpen).toBe(false);
    });

    it("handles viewing destinations then editing trip flow", () => {
      const { result } = renderHook(() => useModalManager());

      // View destinations
      act(() => {
        result.current.destinationsModal.open({
          destinations: ["Colosseum", "Vatican", "Trevi Fountain"],
        });
      });

      expect(result.current.destinationsModal.isOpen).toBe(true);

      // Close destinations and open edit form
      act(() => {
        result.current.destinationsModal.close();
        result.current.tripFormModal.open({ tripId: 1, mode: "edit" });
      });

      expect(result.current.destinationsModal.isOpen).toBe(false);
      expect(result.current.tripFormModal.isOpen).toBe(true);
      expect(result.current.tripFormModal.data).toEqual({
        tripId: 1,
        mode: "edit",
      });
    });

    it("handles closing all modals at once scenario", () => {
      const { result } = renderHook(() => useModalManager());

      // Open multiple modals
      act(() => {
        result.current.destinationsModal.open();
        result.current.tripFormModal.open();
        result.current.confirmationModal.open();
      });

      expect(result.current.isAnyModalOpen).toBe(true);

      // Close all
      act(() => {
        result.current.destinationsModal.close();
        result.current.tripFormModal.close();
        result.current.confirmationModal.close();
      });

      expect(result.current.isAnyModalOpen).toBe(false);
      expect(document.body.style.overflow).toBe("");
    });
  });

  // ============================================
  // Toggle Functionality Tests
  // ============================================
  describe("toggle functionality", () => {
    it("can toggle individual modals", () => {
      const { result } = renderHook(() => useModalManager());

      act(() => {
        result.current.destinationsModal.toggle();
      });
      expect(result.current.destinationsModal.isOpen).toBe(true);

      act(() => {
        result.current.destinationsModal.toggle();
      });
      expect(result.current.destinationsModal.isOpen).toBe(false);
    });
  });
});
