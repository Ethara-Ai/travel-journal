/**
 * Unit tests for colorUtils.js
 * Tests all color utility functions including edge cases and error handling
 */

import { describe, it, expect } from "vitest";
import {
  hexToRgba,
  hexToRgb,
  isLightColor,
  getContrastColor,
  lightenColor,
  darkenColor,
} from "./colorUtils";

describe("colorUtils", () => {
  // ============================================
  // hexToRgba Tests
  // ============================================
  describe("hexToRgba", () => {
    describe("with valid 6-character hex codes", () => {
      it("converts black hex to rgba with default alpha", () => {
        expect(hexToRgba("#000000")).toBe("rgba(0, 0, 0, 1)");
      });

      it("converts white hex to rgba with default alpha", () => {
        expect(hexToRgba("#ffffff")).toBe("rgba(255, 255, 255, 1)");
      });

      it("converts red hex to rgba", () => {
        expect(hexToRgba("#ff0000")).toBe("rgba(255, 0, 0, 1)");
      });

      it("converts green hex to rgba", () => {
        expect(hexToRgba("#00ff00")).toBe("rgba(0, 255, 0, 1)");
      });

      it("converts blue hex to rgba", () => {
        expect(hexToRgba("#0000ff")).toBe("rgba(0, 0, 255, 1)");
      });

      it("converts arbitrary hex color to rgba", () => {
        expect(hexToRgba("#ff5733")).toBe("rgba(255, 87, 51, 1)");
      });

      it("converts uppercase hex to rgba", () => {
        expect(hexToRgba("#FF5733")).toBe("rgba(255, 87, 51, 1)");
      });

      it("converts mixed case hex to rgba", () => {
        expect(hexToRgba("#Ff5733")).toBe("rgba(255, 87, 51, 1)");
      });
    });

    describe("with custom alpha values", () => {
      it("applies alpha of 0", () => {
        expect(hexToRgba("#000000", 0)).toBe("rgba(0, 0, 0, 0)");
      });

      it("applies alpha of 0.5", () => {
        expect(hexToRgba("#ffffff", 0.5)).toBe("rgba(255, 255, 255, 0.5)");
      });

      it("applies alpha of 0.25", () => {
        expect(hexToRgba("#ff5733", 0.25)).toBe("rgba(255, 87, 51, 0.25)");
      });

      it("applies alpha of 0.75", () => {
        expect(hexToRgba("#123456", 0.75)).toBe("rgba(18, 52, 86, 0.75)");
      });

      it("applies alpha of 1", () => {
        expect(hexToRgba("#abcdef", 1)).toBe("rgba(171, 205, 239, 1)");
      });
    });

    describe("with shorthand 3-character hex codes", () => {
      it("converts shorthand black to rgba", () => {
        expect(hexToRgba("#000")).toBe("rgba(0, 0, 0, 1)");
      });

      it("converts shorthand white to rgba", () => {
        expect(hexToRgba("#fff")).toBe("rgba(255, 255, 255, 1)");
      });

      it("converts shorthand red to rgba", () => {
        expect(hexToRgba("#f00")).toBe("rgba(255, 0, 0, 1)");
      });

      it("converts shorthand color to rgba", () => {
        expect(hexToRgba("#abc")).toBe("rgba(170, 187, 204, 1)");
      });

      it("converts shorthand uppercase to rgba", () => {
        expect(hexToRgba("#ABC")).toBe("rgba(170, 187, 204, 1)");
      });

      it("converts shorthand with custom alpha", () => {
        expect(hexToRgba("#fff", 0.3)).toBe("rgba(255, 255, 255, 0.3)");
      });
    });

    describe("without # prefix", () => {
      it("handles hex without # prefix", () => {
        expect(hexToRgba("ff5733")).toBe("rgba(255, 87, 51, 1)");
      });

      it("handles shorthand without # prefix", () => {
        expect(hexToRgba("fff")).toBe("rgba(255, 255, 255, 1)");
      });
    });

    describe("with invalid inputs", () => {
      it("returns fallback for null input", () => {
        expect(hexToRgba(null)).toBe("rgba(128, 128, 128, 1)");
      });

      it("returns fallback for undefined input", () => {
        expect(hexToRgba(undefined)).toBe("rgba(128, 128, 128, 1)");
      });

      it("returns fallback for empty string", () => {
        expect(hexToRgba("")).toBe("rgba(128, 128, 128, 1)");
      });

      it("returns fallback for number input", () => {
        expect(hexToRgba(123456)).toBe("rgba(128, 128, 128, 1)");
      });

      it("returns fallback for object input", () => {
        expect(hexToRgba({})).toBe("rgba(128, 128, 128, 1)");
      });

      it("returns fallback for array input", () => {
        expect(hexToRgba([])).toBe("rgba(128, 128, 128, 1)");
      });

      it("preserves custom alpha with invalid hex", () => {
        expect(hexToRgba(null, 0.5)).toBe("rgba(128, 128, 128, 0.5)");
      });
    });
  });

  // ============================================
  // hexToRgb Tests
  // ============================================
  describe("hexToRgb", () => {
    describe("with valid 6-character hex codes", () => {
      it("converts black to RGB object", () => {
        expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 });
      });

      it("converts white to RGB object", () => {
        expect(hexToRgb("#ffffff")).toEqual({ r: 255, g: 255, b: 255 });
      });

      it("converts red to RGB object", () => {
        expect(hexToRgb("#ff0000")).toEqual({ r: 255, g: 0, b: 0 });
      });

      it("converts green to RGB object", () => {
        expect(hexToRgb("#00ff00")).toEqual({ r: 0, g: 255, b: 0 });
      });

      it("converts blue to RGB object", () => {
        expect(hexToRgb("#0000ff")).toEqual({ r: 0, g: 0, b: 255 });
      });

      it("converts arbitrary color to RGB object", () => {
        expect(hexToRgb("#7c3aed")).toEqual({ r: 124, g: 58, b: 237 });
      });
    });

    describe("with shorthand 3-character hex codes", () => {
      it("converts shorthand black to RGB", () => {
        expect(hexToRgb("#000")).toEqual({ r: 0, g: 0, b: 0 });
      });

      it("converts shorthand white to RGB", () => {
        expect(hexToRgb("#fff")).toEqual({ r: 255, g: 255, b: 255 });
      });

      it("converts shorthand color to RGB", () => {
        expect(hexToRgb("#abc")).toEqual({ r: 170, g: 187, b: 204 });
      });
    });

    describe("without # prefix", () => {
      it("handles hex without # prefix", () => {
        expect(hexToRgb("ff5733")).toEqual({ r: 255, g: 87, b: 51 });
      });

      it("handles black without # prefix", () => {
        expect(hexToRgb("000000")).toEqual({ r: 0, g: 0, b: 0 });
      });
    });

    describe("with invalid inputs", () => {
      it("returns fallback gray for null", () => {
        expect(hexToRgb(null)).toEqual({ r: 128, g: 128, b: 128 });
      });

      it("returns fallback gray for undefined", () => {
        expect(hexToRgb(undefined)).toEqual({ r: 128, g: 128, b: 128 });
      });

      it("returns fallback gray for empty string", () => {
        expect(hexToRgb("")).toEqual({ r: 128, g: 128, b: 128 });
      });

      it("returns fallback gray for non-string input", () => {
        expect(hexToRgb(12345)).toEqual({ r: 128, g: 128, b: 128 });
      });
    });
  });

  // ============================================
  // isLightColor Tests
  // ============================================
  describe("isLightColor", () => {
    describe("identifies light colors", () => {
      it("returns true for white", () => {
        expect(isLightColor("#ffffff")).toBe(true);
      });

      it("returns true for light gray", () => {
        expect(isLightColor("#cccccc")).toBe(true);
      });

      it("returns true for yellow (high luminance)", () => {
        expect(isLightColor("#ffff00")).toBe(true);
      });

      it("returns true for light cyan", () => {
        expect(isLightColor("#00ffff")).toBe(true);
      });

      it("returns true for light pink", () => {
        expect(isLightColor("#ffb6c1")).toBe(true);
      });

      it("returns true for beige", () => {
        expect(isLightColor("#f5f5dc")).toBe(true);
      });

      it("returns true for light green", () => {
        expect(isLightColor("#90ee90")).toBe(true);
      });
    });

    describe("identifies dark colors", () => {
      it("returns false for black", () => {
        expect(isLightColor("#000000")).toBe(false);
      });

      it("returns false for dark gray", () => {
        expect(isLightColor("#333333")).toBe(false);
      });

      it("returns false for dark blue", () => {
        expect(isLightColor("#000080")).toBe(false);
      });

      it("returns false for dark red", () => {
        expect(isLightColor("#8b0000")).toBe(false);
      });

      it("returns false for dark purple", () => {
        expect(isLightColor("#301934")).toBe(false);
      });

      it("returns false for navy", () => {
        expect(isLightColor("#001f3f")).toBe(false);
      });

      it("returns false for dark green", () => {
        expect(isLightColor("#006400")).toBe(false);
      });
    });

    describe("handles edge cases", () => {
      it("handles medium gray (luminance around 0.5)", () => {
        // #808080 has luminance of exactly 0.5, should be false (not > 0.5)
        expect(isLightColor("#808080")).toBe(false);
      });

      it("handles pure red (medium luminance)", () => {
        expect(isLightColor("#ff0000")).toBe(false);
      });

      it("handles pure green (high luminance due to green weight)", () => {
        expect(isLightColor("#00ff00")).toBe(true);
      });

      it("handles pure blue (low luminance)", () => {
        expect(isLightColor("#0000ff")).toBe(false);
      });
    });
  });

  // ============================================
  // getContrastColor Tests
  // ============================================
  describe("getContrastColor", () => {
    describe("returns black for light backgrounds", () => {
      it("returns black for white background", () => {
        expect(getContrastColor("#ffffff")).toBe("#000000");
      });

      it("returns black for light gray background", () => {
        expect(getContrastColor("#e0e0e0")).toBe("#000000");
      });

      it("returns black for yellow background", () => {
        expect(getContrastColor("#ffff00")).toBe("#000000");
      });

      it("returns black for light blue background", () => {
        expect(getContrastColor("#add8e6")).toBe("#000000");
      });

      it("returns black for light green background", () => {
        expect(getContrastColor("#90ee90")).toBe("#000000");
      });
    });

    describe("returns white for dark backgrounds", () => {
      it("returns white for black background", () => {
        expect(getContrastColor("#000000")).toBe("#ffffff");
      });

      it("returns white for dark gray background", () => {
        expect(getContrastColor("#333333")).toBe("#ffffff");
      });

      it("returns white for dark blue background", () => {
        expect(getContrastColor("#0000aa")).toBe("#ffffff");
      });

      it("returns white for dark red background", () => {
        expect(getContrastColor("#8b0000")).toBe("#ffffff");
      });

      it("returns white for dark purple background", () => {
        expect(getContrastColor("#7c3aed")).toBe("#ffffff");
      });
    });

    describe("handles brand colors", () => {
      it("handles sky blue (continent color)", () => {
        expect(getContrastColor("#2563eb")).toBe("#ffffff");
      });

      it("handles orange (continent color)", () => {
        expect(getContrastColor("#ea580c")).toBe("#ffffff");
      });

      it("handles purple (continent color)", () => {
        expect(getContrastColor("#7c3aed")).toBe("#ffffff");
      });

      it("handles amber/gold (continent color)", () => {
        expect(getContrastColor("#bf9104")).toBe("#000000");
      });

      it("handles pink (continent color)", () => {
        expect(getContrastColor("#db2777")).toBe("#ffffff");
      });

      it("handles emerald (continent color)", () => {
        expect(getContrastColor("#10b981")).toBe("#000000");
      });
    });
  });

  // ============================================
  // lightenColor Tests
  // ============================================
  describe("lightenColor", () => {
    describe("lightens colors by percentage", () => {
      it("lightens black by 10%", () => {
        const result = lightenColor("#000000", 10);
        expect(result).toBe("#191919");
      });

      it("lightens black by 50%", () => {
        const result = lightenColor("#000000", 50);
        expect(result).toBe("#7f7f7f");
      });

      it("lightens black by 100%", () => {
        const result = lightenColor("#000000", 100);
        expect(result).toBe("#ffffff");
      });

      it("lightens dark gray by 25%", () => {
        const result = lightenColor("#333333", 25);
        // 51 + 64 = 115 = 0x73
        expect(result).toBe("#737373");
      });

      it("lightens a color by 0% (no change)", () => {
        const result = lightenColor("#ff5733", 0);
        expect(result).toBe("#ff5733");
      });
    });

    describe("clamps at white (255)", () => {
      it("does not exceed white when lightening white", () => {
        const result = lightenColor("#ffffff", 50);
        expect(result).toBe("#ffffff");
      });

      it("clamps individual channels at 255", () => {
        const result = lightenColor("#ff0000", 50);
        // Red is already 255, stays at 255
        // Green: 0 + 127 = 127 = 0x7f
        // Blue: 0 + 127 = 127 = 0x7f
        expect(result).toBe("#ff7f7f");
      });

      it("clamps all channels at 255 for large percentage", () => {
        const result = lightenColor("#aabbcc", 100);
        expect(result).toBe("#ffffff");
      });
    });

    describe("handles shorthand hex", () => {
      it("lightens shorthand black", () => {
        const result = lightenColor("#000", 20);
        expect(result).toBe("#333333");
      });

      it("lightens shorthand color", () => {
        const result = lightenColor("#abc", 10);
        // aa (170) + 25 = 195 = c3
        // bb (187) + 25 = 212 = d4
        // cc (204) + 25 = 229 = e5
        expect(result).toBe("#c3d4e5");
      });
    });
  });

  // ============================================
  // darkenColor Tests
  // ============================================
  describe("darkenColor", () => {
    describe("darkens colors by percentage", () => {
      it("darkens white by 10%", () => {
        const result = darkenColor("#ffffff", 10);
        // 255 - 25 = 230 = e6
        expect(result).toBe("#e6e6e6");
      });

      it("darkens white by 50%", () => {
        const result = darkenColor("#ffffff", 50);
        // 255 - 127 = 128 = 80
        expect(result).toBe("#808080");
      });

      it("darkens white by 100%", () => {
        const result = darkenColor("#ffffff", 100);
        expect(result).toBe("#000000");
      });

      it("darkens light gray by 25%", () => {
        const result = darkenColor("#cccccc", 25);
        // 204 - 64 = 140 = 8c
        expect(result).toBe("#8c8c8c");
      });

      it("darkens a color by 0% (no change)", () => {
        const result = darkenColor("#ff5733", 0);
        expect(result).toBe("#ff5733");
      });
    });

    describe("clamps at black (0)", () => {
      it("does not go below black when darkening black", () => {
        const result = darkenColor("#000000", 50);
        expect(result).toBe("#000000");
      });

      it("clamps individual channels at 0", () => {
        const result = darkenColor("#003366", 50);
        // Red: 0 - 127 = 0 (clamped)
        // Green: 51 - 127 = 0 (clamped)
        // Blue: 102 - 127 = 0 (clamped)
        expect(result).toBe("#000000");
      });

      it("clamps channels appropriately for partial darkening", () => {
        const result = darkenColor("#336699", 20);
        // Red: 51 - 51 = 0 = 00
        // Green: 102 - 51 = 51 = 33
        // Blue: 153 - 51 = 102 = 66
        expect(result).toBe("#003366");
      });
    });

    describe("handles shorthand hex", () => {
      it("darkens shorthand white", () => {
        const result = darkenColor("#fff", 20);
        // 255 - 51 = 204 = cc
        expect(result).toBe("#cccccc");
      });

      it("darkens shorthand color", () => {
        const result = darkenColor("#abc", 10);
        // aa (170) - 25 = 145 = 91
        // bb (187) - 25 = 162 = a2
        // cc (204) - 25 = 179 = b3
        expect(result).toBe("#91a2b3");
      });
    });
  });

  // ============================================
  // Integration Tests
  // ============================================
  describe("integration tests", () => {
    it("lighten then darken returns similar color", () => {
      const original = "#808080";
      const lightened = lightenColor(original, 20);
      const result = darkenColor(lightened, 20);
      // Should be close to original (may have rounding differences)
      expect(result).toBe(original);
    });

    it("getContrastColor works with lightened colors", () => {
      const dark = "#333333";
      const lightened = lightenColor(dark, 60);
      expect(getContrastColor(lightened)).toBe("#000000");
    });

    it("getContrastColor works with darkened colors", () => {
      const light = "#ffffff";
      const darkened = darkenColor(light, 60);
      expect(getContrastColor(darkened)).toBe("#ffffff");
    });

    it("hexToRgba works with lightened colors", () => {
      const color = lightenColor("#000000", 50);
      const rgba = hexToRgba(color, 0.5);
      expect(rgba).toBe("rgba(127, 127, 127, 0.5)");
    });

    it("hexToRgb result can be used to verify isLightColor", () => {
      const hex = "#cccccc";
      const rgb = hexToRgb(hex);
      const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
      expect(luminance > 0.5).toBe(isLightColor(hex));
    });
  });

  // ============================================
  // Real-world Color Tests
  // ============================================
  describe("real-world application colors", () => {
    const continentColors = {
      "North America": "#2563eb",
      "South America": "#ea580c",
      Europe: "#7c3aed",
      Africa: "#bf9104",
      Asia: "#db2777",
      Oceania: "#10b981",
      Antarctica: "#6b7280",
    };

    Object.entries(continentColors).forEach(([continent, color]) => {
      it(`handles ${continent} color (${color})`, () => {
        // Verify all functions work with this color
        expect(hexToRgb(color)).toHaveProperty("r");
        expect(hexToRgb(color)).toHaveProperty("g");
        expect(hexToRgb(color)).toHaveProperty("b");
        expect(hexToRgba(color)).toMatch(/^rgba\(\d+, \d+, \d+, 1\)$/);
        expect(typeof isLightColor(color)).toBe("boolean");
        expect(getContrastColor(color)).toMatch(/^#[0-9a-f]{6}$/);
        expect(lightenColor(color, 10)).toMatch(/^#[0-9a-f]{6}$/);
        expect(darkenColor(color, 10)).toMatch(/^#[0-9a-f]{6}$/);
      });
    });
  });
});
