import { describe, expect, it } from "vitest";
import { Sweet } from "../../src/models/sweet.model.js";

describe("Sweet Model", () => {
  describe("Data Structure and Properties", () => {
    it("should create a sweet with all required properties", () => {
      const sweet = new Sweet(1, "Dark Chocolate Bar", "chocolate", 3.99, 25);

      expect(sweet.id).toBe(1);
      expect(sweet.name).toBe("Dark Chocolate Bar");
      expect(sweet.category).toBe("chocolate");
      expect(sweet.price).toBe(3.99);
      expect(sweet.quantity).toBe(25);
    });

    it("should handle edge case with minimum valid values", () => {
      const sweet = new Sweet(1, "Sample", "candy", 0.01, 1);

      expect(sweet.id).toBe(1);
      expect(sweet.name).toBe("Sample");
      expect(sweet.category).toBe("candy");
      expect(sweet.price).toBe(0.01);
      expect(sweet.quantity).toBe(1);
    });

    it("should handle out-of-stock items", () => {
      const sweet = new Sweet(5, "Sold Out Pastry", "pastry", 4.5, 0);
      expect(sweet.quantity).toBe(0);
    });
  });

  describe("Validation - Invalid Properties", () => {
    describe("Invalid ID", () => {
      it("should throw error for negative ID", () => {
        expect(
          () => new Sweet(-1, "Chocolate Bar", "chocolate", 2.99, 10),
        ).toThrow();
      });

      it("should throw error for zero ID", () => {
        expect(
          () => new Sweet(0, "Chocolate Bar", "chocolate", 2.99, 10),
        ).toThrow();
      });

      it("should throw error for non-integer ID", () => {
        expect(
          () => new Sweet(1.5, "Chocolate Bar", "chocolate", 2.99, 10),
        ).toThrow();
      });
    });

    describe("Invalid Name", () => {
      it("should throw error for empty name", () => {
        expect(() => new Sweet(1, "", "chocolate", 2.99, 10)).toThrow();
      });

      it("should throw error for whitespace-only name", () => {
        expect(() => new Sweet(1, "   ", "chocolate", 2.99, 10)).toThrow();
      });

      it("should throw error for null name", () => {
        expect(
          () => new Sweet(1, null as unknown as string, "chocolate", 2.99, 10),
        ).toThrow();
      });

      it("should throw error for undefined name", () => {
        expect(
          () =>
            new Sweet(1, undefined as unknown as string, "chocolate", 2.99, 10),
        ).toThrow();
      });
    });

    describe("Invalid Price", () => {
      it("should throw error for negative price", () => {
        expect(
          () => new Sweet(1, "Chocolate Bar", "chocolate", -1, 10),
        ).toThrow();
      });

      it("should throw error for null price", () => {
        expect(
          () =>
            new Sweet(
              1,
              "Chocolate Bar",
              "chocolate",
              null as unknown as number,
              10,
            ),
        ).toThrow();
      });

      it("should throw error for string price", () => {
        expect(
          () =>
            new Sweet(
              1,
              "Chocolate Bar",
              "chocolate",
              "2.99" as unknown as number,
              10,
            ),
        ).toThrow();
      });
    });

    describe("Invalid Quantity", () => {
      it("should throw error for negative quantity", () => {
        expect(
          () => new Sweet(1, "Chocolate Bar", "chocolate", 2.99, -1),
        ).toThrow();
      });

      it("should throw error for non-integer quantity", () => {
        expect(
          () => new Sweet(1, "Chocolate Bar", "chocolate", 2.99, 5.5),
        ).toThrow();
      });

      it("should throw error for null quantity", () => {
        expect(
          () =>
            new Sweet(
              1,
              "Chocolate Bar",
              "chocolate",
              2.99,
              null as unknown as number,
            ),
        ).toThrow();
      });

      it("should throw error for string quantity", () => {
        expect(
          () =>
            new Sweet(
              1,
              "Chocolate Bar",
              "chocolate",
              2.99,
              "10" as unknown as number,
            ),
        ).toThrow();
      });
    });
  });

  describe("Basic Entity Behavior - canPurchase", () => {
    it("should allow purchase when sufficient stock exists", () => {
      const sweet = new Sweet(1, "Chocolate Truffle", "chocolate", 1.5, 20);
      expect(sweet.canPurchase(5)).toBe(true);
    });

    it("should allow purchase of exact stock amount", () => {
      const sweet = new Sweet(2, "Lollipop", "candy", 0.75, 3);
      expect(sweet.canPurchase(3)).toBe(true);
    });

    it("should prevent purchase when insufficient stock", () => {
      const sweet = new Sweet(3, "Eclair", "pastry", 2.25, 2);
      expect(sweet.canPurchase(5)).toBe(false);
    });

    it("should prevent purchase from out-of-stock item", () => {
      const sweet = new Sweet(4, "Sold Out", "chocolate", 3.0, 0);
      expect(sweet.canPurchase(1)).toBe(false);
    });
  });

  describe("State Changes - Purchase", () => {
    it("should reduce quantity after successful purchase", () => {
      const sweet = new Sweet(1, "Chocolate Bar", "chocolate", 2.99, 10);
      const originalQuantity = sweet.quantity;

      sweet.purchase(3);

      expect(sweet.quantity).toBe(originalQuantity - 3);
      expect(sweet.quantity).toBe(7);
    });

    it("should throw error when purchasing more than available stock", () => {
      const sweet = new Sweet(1, "Chocolate Bar", "chocolate", 2.99, 10);
      expect(() => sweet.purchase(15)).toThrow();
    });

    it("should throw error when purchasing with invalid amount - zero", () => {
      const sweet = new Sweet(1, "Chocolate Bar", "chocolate", 2.99, 10);
      expect(() => sweet.purchase(0)).toThrow();
    });

    it("should throw error when purchasing with invalid amount - negative", () => {
      const sweet = new Sweet(1, "Chocolate Bar", "chocolate", 2.99, 10);
      expect(() => sweet.purchase(-1)).toThrow();
    });

    it("should throw error when purchasing with invalid amount - decimal", () => {
      const sweet = new Sweet(1, "Chocolate Bar", "chocolate", 2.99, 10);
      expect(() => sweet.purchase(2.5)).toThrow();
    });

    it("should handle purchasing all remaining stock", () => {
      const sweet = new Sweet(2, "Final Stock", "pastry", 4.0, 5);

      sweet.purchase(5);

      expect(sweet.quantity).toBe(0);
    });

    it("should maintain other properties unchanged after purchase", () => {
      const sweet = new Sweet(3, "Gummy Worms", "candy", 2.5, 15);
      const originalId = sweet.id;
      const originalName = sweet.name;
      const originalCategory = sweet.category;
      const originalPrice = sweet.price;

      sweet.purchase(8);

      expect(sweet.id).toBe(originalId);
      expect(sweet.name).toBe(originalName);
      expect(sweet.category).toBe(originalCategory);
      expect(sweet.price).toBe(originalPrice);
    });
  });

  describe("State Changes - Restock", () => {
    it("should increase quantity when restocking", () => {
      const sweet = new Sweet(1, "Restocked Item", "pastry", 3.5, 5);
      const originalQuantity = sweet.quantity;

      sweet.restock(10);

      expect(sweet.quantity).toBe(originalQuantity + 10);
      expect(sweet.quantity).toBe(15);
    });

    it("should throw error when restocking with non-positive amount", () => {
      const sweet = new Sweet(2, "Invalid Restock", "candy", 1.0, 10);
      expect(() => sweet.restock(-5)).toThrow();
      expect(() => sweet.restock(0)).toThrow();
    });

    it("should maintain other properties unchanged after restock", () => {
      const sweet = new Sweet(4, "Stable Props", "pastry", 2.75, 8);
      const originalId = sweet.id;
      const originalName = sweet.name;
      const originalCategory = sweet.category;
      const originalPrice = sweet.price;

      sweet.restock(12);

      expect(sweet.id).toBe(originalId);
      expect(sweet.name).toBe(originalName);
      expect(sweet.category).toBe(originalCategory);
      expect(sweet.price).toBe(originalPrice);
    });
  });

  describe("Combined State Changes", () => {
    it("should handle purchase followed by restock", () => {
      const sweet = new Sweet(1, "Dynamic Stock", "chocolate", 2.0, 15);

      sweet.purchase(8);
      expect(sweet.quantity).toBe(7);

      sweet.restock(20);
      expect(sweet.quantity).toBe(27);
    });

    it("should handle restock followed by purchase", () => {
      const sweet = new Sweet(2, "Stock Cycle", "candy", 1.5, 5);

      sweet.restock(15);
      expect(sweet.quantity).toBe(20);

      sweet.purchase(12);
      expect(sweet.quantity).toBe(8);
    });

    it("should handle complete stock depletion and restocking", () => {
      const sweet = new Sweet(3, "Full Cycle", "pastry", 4.25, 10);

      sweet.purchase(10);
      expect(sweet.quantity).toBe(0);
      expect(sweet.canPurchase(1)).toBe(false);

      sweet.restock(5);
      expect(sweet.quantity).toBe(5);
      expect(sweet.canPurchase(3)).toBe(true);
    });
  });
});
