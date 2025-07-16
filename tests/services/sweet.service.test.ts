import { beforeEach, describe, expect, it } from "vitest";
import { Sweet } from "../../src/models/sweet.model.js";
import { InMemorySweetRepository } from "../../src/repositories/sweet.repository.js";
import { SweetService } from "../../src/services/sweet.service.js";

describe("SweetService", () => {
  let service: SweetService;

  beforeEach(() => {
    const repository = new InMemorySweetRepository();
    service = new SweetService(repository);
  });

  describe("getAll", () => {
    it("should return empty array when no sweets exist", () => {
      const sweets = service.getAllSweets();
      expect(sweets).toEqual([]);
    });

    it("should return all sweets when sweets exist", () => {
      const sweet1 = new Sweet(1, "Chocolate Bar", "chocolate", 2.5, 10);
      const sweet2 = new Sweet(2, "Gummy Bears", "candy", 1.5, 20);

      service.createSweet(sweet1);
      service.createSweet(sweet2);

      const sweets = service.getAllSweets();
      expect(sweets).toHaveLength(2);
      expect(sweets).toContain(sweet1);
      expect(sweets).toContain(sweet2);
    });
  });

  describe("create", () => {
    it("should add multiple sweets to the repository", () => {
      const sweet1 = new Sweet(1, "Chocolate Bar", "chocolate", 2.5, 10);
      const sweet2 = new Sweet(2, "Gummy Bears", "candy", 1.5, 20);
      const sweet3 = new Sweet(3, "Croissant", "pastry", 3.0, 5);

      service.createSweet(sweet1);
      service.createSweet(sweet2);
      service.createSweet(sweet3);

      const sweets = service.getAllSweets();
      expect(sweets).toHaveLength(3);
      expect(sweets).toContain(sweet1);
      expect(sweets).toContain(sweet2);
      expect(sweets).toContain(sweet3);
    });

    it("should throw error when creating sweet with duplicate ID", () => {
      const sweet1 = new Sweet(1, "Chocolate Bar", "chocolate", 2.5, 10);
      const sweet2 = new Sweet(1, "Different Sweet", "candy", 1.0, 5);

      service.createSweet(sweet1);

      expect(() => service.createSweet(sweet2)).toThrow();
    });

    it("should throw error when creating sweet with null or undefined sweet", () => {
      expect(() => service.createSweet(null as unknown as Sweet)).toThrow();
      expect(() =>
        service.createSweet(undefined as unknown as Sweet),
      ).toThrow();
    });

    it("should return the created sweet", () => {
      const sweet = new Sweet(1, "Chocolate Bar", "chocolate", 2.5, 10);

      const result = service.createSweet(sweet);

      expect(result).toBe(sweet);
    });
  });

  describe("delete", () => {
    it("should return false when trying to delete non-existent sweet", () => {
      const result = service.deleteSweet(999);
      expect(result).toBe(false);
    });

    it("should delete existing sweet and return true", () => {
      const sweet = new Sweet(1, "Chocolate Bar", "chocolate", 2.5, 10);
      service.createSweet(sweet);

      const result = service.deleteSweet(1);
      expect(result).toBe(true);

      const allSweets = service.getAllSweets();
      expect(allSweets).not.toContain(sweet);
      expect(allSweets).toHaveLength(0);
    });

    it("should only delete the specified sweet", () => {
      const sweet1 = new Sweet(1, "Chocolate Bar", "chocolate", 2.5, 10);
      const sweet2 = new Sweet(2, "Gummy Bears", "candy", 1.5, 20);
      const sweet3 = new Sweet(3, "Croissant", "pastry", 3.0, 5);

      service.createSweet(sweet1);
      service.createSweet(sweet2);
      service.createSweet(sweet3);

      const result = service.deleteSweet(2);
      expect(result).toBe(true);

      const allSweets = service.getAllSweets();
      expect(allSweets).toHaveLength(2);
      expect(allSweets).toContain(sweet1);
      expect(allSweets).toContain(sweet3);
      expect(allSweets).not.toContain(sweet2);
    });

    it("should throw error when trying to delete with invalid ID", () => {
      expect(() => service.deleteSweet(null as unknown as number)).toThrow();
      expect(() =>
        service.deleteSweet(undefined as unknown as number),
      ).toThrow();
      expect(() => service.deleteSweet(-1)).toThrow();
    });
  });

  describe("search", () => {
    beforeEach(() => {
      const sweet1 = new Sweet(1, "Chocolate Bar", "chocolate", 2.5, 10);
      const sweet2 = new Sweet(2, "Milk Chocolate", "chocolate", 3.0, 15);
      const sweet3 = new Sweet(3, "Gummy Bears", "candy", 1.5, 20);
      const sweet4 = new Sweet(4, "Sour Gummies", "candy", 2.0, 12);
      const sweet5 = new Sweet(5, "Croissant", "pastry", 4.5, 5);

      service.createSweet(sweet1);
      service.createSweet(sweet2);
      service.createSweet(sweet3);
      service.createSweet(sweet4);
      service.createSweet(sweet5);
    });

    describe("search functionality", () => {
      it("should return sweets matching search criteria", () => {
        const results = service.searchSweets({ name: "chocolate" });
        expect(results).toHaveLength(2);
        expect(results.map((s) => s.id)).toContain(1);
        expect(results.map((s) => s.id)).toContain(2);
      });

      it("should return sweets matching category", () => {
        const results = service.searchSweets({ category: "candy" });
        expect(results).toHaveLength(2);
        expect(results.map((s) => s.id)).toContain(3);
        expect(results.map((s) => s.id)).toContain(4);
      });

      it("should return sweets within price range", () => {
        const results = service.searchSweets({ minPrice: 2.0, maxPrice: 3.0 });
        expect(results).toHaveLength(3);
        expect(results.map((s) => s.id)).toContain(1);
        expect(results.map((s) => s.id)).toContain(2);
        expect(results.map((s) => s.id)).toContain(4);
      });

      it("should return empty array when no matches found", () => {
        const results = service.searchSweets({ name: "Nonexistent" });
        expect(results).toEqual([]);
      });
    });

    describe("business logic validation", () => {
      it("should throw error when search criteria is empty", () => {
        expect(() => service.searchSweets({})).toThrow();
      });

      it("should throw error when search criteria is null or undefined", () => {
        expect(() => service.searchSweets(null as unknown as object)).toThrow();
        expect(() =>
          service.searchSweets(undefined as unknown as object),
        ).toThrow();
      });

      it("should throw error when price range is invalid", () => {
        expect(() =>
          service.searchSweets({ minPrice: 5.0, maxPrice: 2.0 }),
        ).toThrow();
      });

      it("should throw error when prices are negative", () => {
        expect(() => service.searchSweets({ minPrice: -1.0 })).toThrow();
        expect(() => service.searchSweets({ maxPrice: -1.0 })).toThrow();
      });

      it("should throw error when minPrice or maxPrice is not a number", () => {
        expect(() =>
          service.searchSweets({ minPrice: "invalid" as unknown as number }),
        ).toThrow();
        expect(() =>
          service.searchSweets({ maxPrice: "invalid" as unknown as number }),
        ).toThrow();
      });

      it("should handle search with multiple criteria", () => {
        const results = service.searchSweets({
          category: "candy",
          minPrice: 1.8,
        });
        expect(results).toHaveLength(1);
        expect(results.map((s) => s.id)).toContain(4);
      });

      it("should trim and normalize search inputs", () => {
        const results = service.searchSweets({ name: "  CHOCOLATE  " });
        expect(results).toHaveLength(2);
        expect(results.map((s) => s.id)).toContain(1);
        expect(results.map((s) => s.id)).toContain(2);
      });

      it("should have at least one valid search criteria", () => {
        expect(() => service.searchSweets({ name: "" })).toThrow();
        expect(() => service.searchSweets({ category: "" })).toThrow();
      });
    });

    describe("Inventory Management", () => {
      describe("Purchase Sweets", () => {
        beforeEach(() => {
          const sweet1 = new Sweet(1, "Chocolate Bar", "chocolate", 2.5, 10);
          const sweet2 = new Sweet(2, "Gummy Bears", "candy", 1.5, 20);
          const sweet3 = new Sweet(3, "Croissant", "pastry", 4.5, 0);

          service.createSweet(sweet1);
          service.createSweet(sweet2);
          service.createSweet(sweet3);
        });

        it("should successfully purchase sweet when sufficient stock is available", () => {
          const result = service.purchaseSweet(1, 3);

          expect(result).toBe(true);
          const sweet = service.getSweetById(1);
          expect(sweet?.quantity).toBe(7);
        });

        it("should purchase exact remaining stock", () => {
          const result = service.purchaseSweet(1, 10);

          expect(result).toBe(true);
          const sweet = service.getSweetById(1);
          expect(sweet?.quantity).toBe(0);
        });

        it("should throw error when purchasing more than available stock", () => {
          expect(() => service.purchaseSweet(1, 15)).toThrow();
        });

        it("should throw error when purchasing from out-of-stock sweet", () => {
          expect(() => service.purchaseSweet(3, 1)).toThrow();
        });

        it("should throw error when sweet does not exist", () => {
          expect(() => service.purchaseSweet(999, 1)).toThrow();
        });

        it("should throw error when purchase quantity is invalid", () => {
          expect(() => service.purchaseSweet(1, 0)).toThrow();
          expect(() => service.purchaseSweet(1, -1)).toThrow();
          expect(() => service.purchaseSweet(1, 1.5)).toThrow();
          expect(() =>
            service.purchaseSweet(1, null as unknown as number),
          ).toThrow();
          expect(() =>
            service.purchaseSweet(1, undefined as unknown as number),
          ).toThrow();
          expect(() =>
            service.purchaseSweet(1, "5" as unknown as number),
          ).toThrow();
        });

        it("should throw error when sweet ID is invalid", () => {
          expect(() => service.purchaseSweet(0, 1)).toThrow(
            "Sweet ID must be positive",
          );
          expect(() => service.purchaseSweet(-1, 1)).toThrow(
            "Sweet ID must be positive",
          );
          expect(() => service.purchaseSweet(1.5, 1)).toThrow(
            "Sweet ID must be a whole number",
          );
          expect(() =>
            service.purchaseSweet(null as unknown as number, 1),
          ).toThrow();
          expect(() =>
            service.purchaseSweet(undefined as unknown as number, 1),
          ).toThrow();
        });

        it("should maintain other sweet properties unchanged after purchase", () => {
          const originalSweet = service.getSweetById(1);
          const originalName = originalSweet?.name;
          const originalCategory = originalSweet?.category;
          const originalPrice = originalSweet?.price;

          service.purchaseSweet(1, 5);

          const sweet = service.getSweetById(1);
          expect(sweet?.name).toBe(originalName);
          expect(sweet?.category).toBe(originalCategory);
          expect(sweet?.price).toBe(originalPrice);
        });
      });

      describe("Restock Sweets", () => {
        beforeEach(() => {
          const sweet1 = new Sweet(1, "Chocolate Bar", "chocolate", 2.5, 10);
          const sweet2 = new Sweet(2, "Gummy Bears", "candy", 1.5, 0);
          const sweet3 = new Sweet(3, "Croissant", "pastry", 4.5, 5);

          service.createSweet(sweet1);
          service.createSweet(sweet2);
          service.createSweet(sweet3);
        });

        it("should successfully restock sweet with valid quantity", () => {
          const result = service.restockSweet(1, 15);

          expect(result).toBe(true);
          const sweet = service.getSweetById(1);
          expect(sweet?.quantity).toBe(25);
        });

        it("should restock out-of-stock sweet", () => {
          const result = service.restockSweet(2, 10);

          expect(result).toBe(true);
          const sweet = service.getSweetById(2);
          expect(sweet?.quantity).toBe(10);
        });

        it("should throw error when sweet does not exist", () => {
          expect(() => service.restockSweet(999, 10)).toThrow();
        });

        it("should throw error when restock quantity is invalid", () => {
          expect(() => service.restockSweet(1, 0)).toThrow();
          expect(() => service.restockSweet(1, -1)).toThrow();
          expect(() => service.restockSweet(1, 1.5)).toThrow();
          expect(() =>
            service.restockSweet(1, null as unknown as number),
          ).toThrow();
          expect(() =>
            service.restockSweet(1, undefined as unknown as number),
          ).toThrow();
          expect(() =>
            service.restockSweet(1, "5" as unknown as number),
          ).toThrow();
        });

        it("should throw error when sweet ID is invalid", () => {
          expect(() => service.restockSweet(0, 10)).toThrow();
          expect(() => service.restockSweet(-1, 10)).toThrow();
          expect(() => service.restockSweet(1.5, 10)).toThrow();
          expect(() =>
            service.restockSweet(null as unknown as number, 10),
          ).toThrow();
          expect(() =>
            service.restockSweet(undefined as unknown as number, 10),
          ).toThrow();
        });

        it("should maintain other sweet properties unchanged after restock", () => {
          const originalSweet = service.getSweetById(1);
          const originalName = originalSweet?.name;
          const originalCategory = originalSweet?.category;
          const originalPrice = originalSweet?.price;

          service.restockSweet(1, 20);

          const sweet = service.getSweetById(1);
          expect(sweet?.name).toBe(originalName);
          expect(sweet?.category).toBe(originalCategory);
          expect(sweet?.price).toBe(originalPrice);
        });
      });
    });
  });
});
