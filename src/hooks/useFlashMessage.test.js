/**
 * Unit tests for useFlashMessage hook
 * Tests flash message state management and all message type helpers
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useFlashMessage from "./useFlashMessage";

describe("useFlashMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================
  // Initial State Tests
  // ============================================
  describe("initial state", () => {
    it("initializes with null flashMessage", () => {
      const { result } = renderHook(() => useFlashMessage());
      expect(result.current.flashMessage).toBeNull();
    });

    it("provides all expected functions", () => {
      const { result } = renderHook(() => useFlashMessage());

      expect(typeof result.current.showFlashMessage).toBe("function");
      expect(typeof result.current.showSuccess).toBe("function");
      expect(typeof result.current.showError).toBe("function");
      expect(typeof result.current.showInfo).toBe("function");
      expect(typeof result.current.clearFlashMessage).toBe("function");
    });
  });

  // ============================================
  // showFlashMessage Tests
  // ============================================
  describe("showFlashMessage", () => {
    it("sets flash message with default type 'info'", () => {
      const { result } = renderHook(() => useFlashMessage());

      act(() => {
        result.current.showFlashMessage("Test message");
      });

      expect(result.current.flashMessage).not.toBeNull();
      expect(result.current.flashMessage.message).toBe("Test message");
      expect(result.current.flashMessage.type).toBe("info");
    });

    it("sets flash message with custom type", () => {
      const { result } = renderHook(() => useFlashMessage());

      act(() => {
        result.current.showFlashMessage("Error occurred", "error");
      });

      expect(result.current.flashMessage.message).toBe("Error occurred");
      expect(result.current.flashMessage.type).toBe("error");
    });

    it("sets flash message with success type", () => {
      const { result } = renderHook(() => useFlashMessage());

      act(() => {
        result.current.showFlashMessage("Operation successful", "success");
      });

      expect(result.current.flashMessage.message).toBe("Operation successful");
      expect(result.current.flashMessage.type).toBe("success");
    });

    it("includes unique id based on timestamp", () => {
      const { result } = renderHook(() => useFlashMessage());
      const beforeTime = Date.now();

      act(() => {
        result.current.showFlashMessage("Test message");
      });

      const afterTime = Date.now();
      expect(result.current.flashMessage.id).toBeGreaterThanOrEqual(beforeTime);
      expect(result.current.flashMessage.id).toBeLessThanOrEqual(afterTime);
    });

    it("generates new id for each message", () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useFlashMessage());

      act(() => {
        result.current.showFlashMessage("First message");
      });
      const firstId = result.current.flashMessage.id;

      // Advance time to ensure different timestamp
      vi.advanceTimersByTime(10);

      act(() => {
        result.current.showFlashMessage("Second message");
      });
      const secondId = result.current.flashMessage.id;

      expect(firstId).not.toBe(secondId);
      vi.useRealTimers();
    });

    it("replaces existing message with new one", () => {
      const { result } = renderHook(() => useFlashMessage());

      act(() => {
        result.current.showFlashMessage("First message", "info");
      });
      expect(result.current.flashMessage.message).toBe("First message");

      act(() => {
        result.current.showFlashMessage("Second message", "error");
      });
      expect(result.current.flashMessage.message).toBe("Second message");
      expect(result.current.flashMessage.type).toBe("error");
    });

    it("handles empty string message", () => {
      const { result } = renderHook(() => useFlashMessage());

      act(() => {
        result.current.showFlashMessage("");
      });

      expect(result.current.flashMessage.message).toBe("");
      expect(result.current.flashMessage.type).toBe("info");
    });

    it("handles long messages", () => {
      const { result } = renderHook(() => useFlashMessage());
      const longMessage = "A".repeat(1000);

      act(() => {
        result.current.showFlashMessage(longMessage);
      });

      expect(result.current.flashMessage.message).toBe(longMessage);
      expect(result.current.flashMessage.message.length).toBe(1000);
    });

    it("handles special characters in message", () => {
      const { result } = renderHook(() => useFlashMessage());
      const specialMessage = "Test <script>alert('xss')</script> & \"quotes\" 'apostrophe'";

      act(() => {
        result.current.showFlashMessage(specialMessage);
      });

      expect(result.current.flashMessage.message).toBe(specialMessage);
    });

    it("handles unicode characters in message", () => {
      const { result } = renderHook(() => useFlashMessage());
      const unicodeMessage = "Trip saved! 🎉✈️🌍";

      act(() => {
        result.current.showFlashMessage(unicodeMessage);
      });

      expect(result.current.flashMessage.message).toBe(unicodeMessage);
    });
  });

  // ============================================
  // showSuccess Tests
  // ============================================
  describe("showSuccess", () => {
    it("sets flash message with success type", () => {
      const { result } = renderHook(() => useFlashMessage());

      act(() => {
        result.current.showSuccess("Trip saved successfully!");
      });

      expect(result.current.flashMessage.message).toBe("Trip saved successfully!");
      expect(result.current.flashMessage.type).toBe("success");
    });

    it("includes id in message object", () => {
      const { result } = renderHook(() => useFlashMessage());

      act(() => {
        result.current.showSuccess("Success!");
      });

      expect(result.current.flashMessage.id).toBeDefined();
      expect(typeof result.current.flashMessage.id).toBe("number");
    });

    it("handles typical success messages", () => {
      const { result } = renderHook(() => useFlashMessage());
      const successMessages = [
        "Trip added successfully!",
        "Trip updated successfully!",
        "Trip deleted successfully!",
        "Settings saved!",
        "Changes saved!",
      ];

      successMessages.forEach((message) => {
        act(() => {
          result.current.showSuccess(message);
        });
        expect(result.current.flashMessage.message).toBe(message);
        expect(result.current.flashMessage.type).toBe("success");
      });
    });
  });

  // ============================================
  // showError Tests
  // ============================================
  describe("showError", () => {
    it("sets flash message with error type", () => {
      const { result } = renderHook(() => useFlashMessage());

      act(() => {
        result.current.showError("Failed to save trip");
      });

      expect(result.current.flashMessage.message).toBe("Failed to save trip");
      expect(result.current.flashMessage.type).toBe("error");
    });

    it("includes id in message object", () => {
      const { result } = renderHook(() => useFlashMessage());

      act(() => {
        result.current.showError("Error!");
      });

      expect(result.current.flashMessage.id).toBeDefined();
      expect(typeof result.current.flashMessage.id).toBe("number");
    });

    it("handles typical error messages", () => {
      const { result } = renderHook(() => useFlashMessage());
      const errorMessages = [
        "Failed to save trip",
        "Network error occurred",
        "Invalid form data",
        "Something went wrong",
        "Unable to delete trip",
      ];

      errorMessages.forEach((message) => {
        act(() => {
          result.current.showError(message);
        });
        expect(result.current.flashMessage.message).toBe(message);
        expect(result.current.flashMessage.type).toBe("error");
      });
    });
  });

  // ============================================
  // showInfo Tests
  // ============================================
  describe("showInfo", () => {
    it("sets flash message with info type", () => {
      const { result } = renderHook(() => useFlashMessage());

      act(() => {
        result.current.showInfo("Click here for more details");
      });

      expect(result.current.flashMessage.message).toBe("Click here for more details");
      expect(result.current.flashMessage.type).toBe("info");
    });

    it("includes id in message object", () => {
      const { result } = renderHook(() => useFlashMessage());

      act(() => {
        result.current.showInfo("Info!");
      });

      expect(result.current.flashMessage.id).toBeDefined();
      expect(typeof result.current.flashMessage.id).toBe("number");
    });

    it("handles typical info messages", () => {
      const { result } = renderHook(() => useFlashMessage());
      const infoMessages = [
        "Welcome to Travel Journal!",
        "Tip: You can drag to reorder trips",
        "Loading your adventures...",
        "Processing your request",
        "Please wait...",
      ];

      infoMessages.forEach((message) => {
        act(() => {
          result.current.showInfo(message);
        });
        expect(result.current.flashMessage.message).toBe(message);
        expect(result.current.flashMessage.type).toBe("info");
      });
    });
  });

  // ============================================
  // clearFlashMessage Tests
  // ============================================
  describe("clearFlashMessage", () => {
    it("clears flash message to null", () => {
      const { result } = renderHook(() => useFlashMessage());

      act(() => {
        result.current.showSuccess("Test message");
      });
      expect(result.current.flashMessage).not.toBeNull();

      act(() => {
        result.current.clearFlashMessage();
      });
      expect(result.current.flashMessage).toBeNull();
    });

    it("can be called when flashMessage is already null", () => {
      const { result } = renderHook(() => useFlashMessage());

      expect(result.current.flashMessage).toBeNull();

      act(() => {
        result.current.clearFlashMessage();
      });
      expect(result.current.flashMessage).toBeNull();
    });

    it("allows showing new message after clearing", () => {
      const { result } = renderHook(() => useFlashMessage());

      act(() => {
        result.current.showError("Error occurred");
      });

      act(() => {
        result.current.clearFlashMessage();
      });

      act(() => {
        result.current.showSuccess("Issue resolved");
      });

      expect(result.current.flashMessage.message).toBe("Issue resolved");
      expect(result.current.flashMessage.type).toBe("success");
    });

    it("clears all message properties", () => {
      const { result } = renderHook(() => useFlashMessage());

      act(() => {
        result.current.showFlashMessage("Test", "error");
      });
      expect(result.current.flashMessage.message).toBeDefined();
      expect(result.current.flashMessage.type).toBeDefined();
      expect(result.current.flashMessage.id).toBeDefined();

      act(() => {
        result.current.clearFlashMessage();
      });
      expect(result.current.flashMessage).toBeNull();
    });
  });

  // ============================================
  // Function Reference Stability Tests
  // ============================================
  describe("function reference stability (useCallback)", () => {
    it("showFlashMessage maintains stable reference", () => {
      const { result, rerender } = renderHook(() => useFlashMessage());
      const firstRef = result.current.showFlashMessage;

      rerender();

      expect(result.current.showFlashMessage).toBe(firstRef);
    });

    it("showSuccess maintains stable reference after state change", () => {
      const { result, rerender } = renderHook(() => useFlashMessage());
      const firstRef = result.current.showSuccess;

      act(() => {
        result.current.showError("test");
      });
      rerender();

      // showSuccess depends on showFlashMessage which is stable
      expect(result.current.showSuccess).toBe(firstRef);
    });

    it("showError maintains stable reference", () => {
      const { result, rerender } = renderHook(() => useFlashMessage());
      const firstRef = result.current.showError;

      rerender();

      expect(result.current.showError).toBe(firstRef);
    });

    it("showInfo maintains stable reference", () => {
      const { result, rerender } = renderHook(() => useFlashMessage());
      const firstRef = result.current.showInfo;

      rerender();

      expect(result.current.showInfo).toBe(firstRef);
    });

    it("clearFlashMessage maintains stable reference", () => {
      const { result, rerender } = renderHook(() => useFlashMessage());
      const firstRef = result.current.clearFlashMessage;

      rerender();

      expect(result.current.clearFlashMessage).toBe(firstRef);
    });
  });

  // ============================================
  // Multiple Hook Instances Tests
  // ============================================
  describe("multiple hook instances", () => {
    it("each instance has independent state", () => {
      const { result: result1 } = renderHook(() => useFlashMessage());
      const { result: result2 } = renderHook(() => useFlashMessage());

      act(() => {
        result1.current.showSuccess("Message 1");
      });

      act(() => {
        result2.current.showError("Message 2");
      });

      expect(result1.current.flashMessage.message).toBe("Message 1");
      expect(result1.current.flashMessage.type).toBe("success");
      expect(result2.current.flashMessage.message).toBe("Message 2");
      expect(result2.current.flashMessage.type).toBe("error");
    });

    it("clearing one instance does not affect another", () => {
      const { result: result1 } = renderHook(() => useFlashMessage());
      const { result: result2 } = renderHook(() => useFlashMessage());

      act(() => {
        result1.current.showSuccess("Message 1");
        result2.current.showSuccess("Message 2");
      });

      act(() => {
        result1.current.clearFlashMessage();
      });

      expect(result1.current.flashMessage).toBeNull();
      expect(result2.current.flashMessage.message).toBe("Message 2");
    });
  });

  // ============================================
  // Edge Cases Tests
  // ============================================
  describe("edge cases", () => {
    it("handles rapid successive calls", () => {
      const { result } = renderHook(() => useFlashMessage());

      act(() => {
        result.current.showInfo("First");
        result.current.showSuccess("Second");
        result.current.showError("Third");
      });

      // Last call should win
      expect(result.current.flashMessage.message).toBe("Third");
      expect(result.current.flashMessage.type).toBe("error");
    });

    it("handles show and clear in same act block", () => {
      const { result } = renderHook(() => useFlashMessage());

      act(() => {
        result.current.showSuccess("Test");
        result.current.clearFlashMessage();
      });

      expect(result.current.flashMessage).toBeNull();
    });

    it("handles numeric-like string message", () => {
      const { result } = renderHook(() => useFlashMessage());

      act(() => {
        result.current.showInfo("12345");
      });

      expect(result.current.flashMessage.message).toBe("12345");
      expect(typeof result.current.flashMessage.message).toBe("string");
    });

    it("handles whitespace-only message", () => {
      const { result } = renderHook(() => useFlashMessage());

      act(() => {
        result.current.showInfo("   ");
      });

      expect(result.current.flashMessage.message).toBe("   ");
    });

    it("handles multiline message", () => {
      const { result } = renderHook(() => useFlashMessage());
      const multilineMessage = "Line 1\nLine 2\nLine 3";

      act(() => {
        result.current.showInfo(multilineMessage);
      });

      expect(result.current.flashMessage.message).toBe(multilineMessage);
    });
  });

  // ============================================
  // Real-world Usage Scenarios
  // ============================================
  describe("real-world usage scenarios", () => {
    it("handles trip creation flow", () => {
      const { result } = renderHook(() => useFlashMessage());

      // Simulate showing info during save
      act(() => {
        result.current.showInfo("Saving your trip...");
      });
      expect(result.current.flashMessage.type).toBe("info");

      // Simulate success after save
      act(() => {
        result.current.showSuccess("Trip created successfully!");
      });
      expect(result.current.flashMessage.type).toBe("success");
      expect(result.current.flashMessage.message).toBe("Trip created successfully!");
    });

    it("handles trip deletion flow", () => {
      const { result } = renderHook(() => useFlashMessage());

      act(() => {
        result.current.showSuccess("Trip 'Rome Adventure' was deleted");
      });

      expect(result.current.flashMessage.message).toBe("Trip 'Rome Adventure' was deleted");
      expect(result.current.flashMessage.type).toBe("success");
    });

    it("handles error recovery flow", () => {
      const { result } = renderHook(() => useFlashMessage());

      // Show error
      act(() => {
        result.current.showError("Failed to save trip. Please try again.");
      });
      expect(result.current.flashMessage.type).toBe("error");

      // Clear after user acknowledges
      act(() => {
        result.current.clearFlashMessage();
      });
      expect(result.current.flashMessage).toBeNull();

      // Retry succeeds
      act(() => {
        result.current.showSuccess("Trip saved successfully!");
      });
      expect(result.current.flashMessage.type).toBe("success");
    });

    it("handles form validation feedback", () => {
      const { result } = renderHook(() => useFlashMessage());

      act(() => {
        result.current.showError("Please fill in all required fields");
      });

      expect(result.current.flashMessage.message).toBe("Please fill in all required fields");
      expect(result.current.flashMessage.type).toBe("error");
    });
  });
});
