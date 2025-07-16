import { divide } from "../src/index.js";

describe("Math Utilities", () => {
  describe("divide", () => {
    it("should divide two positive numbers", () => {
      expect(divide(10, 2)).toBe(5);
    });

    it("should handle decimal results", () => {
      expect(divide(7, 2)).toBe(3.5);
    });

    it("should throw error when dividing by zero", () => {
      expect(() => divide(5, 0)).toThrow("Division by zero is not allowed");
    });

    it("should handle negative numbers", () => {
      expect(divide(-10, 2)).toBe(-5);
      expect(divide(10, -2)).toBe(-5);
      expect(divide(-10, -2)).toBe(5);
    });
  });
});
