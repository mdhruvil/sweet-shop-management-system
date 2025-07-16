import { describe, it, expect, beforeEach } from "vitest";
import { Sweet } from "../../src/models/sweet.model.js";
import { InMemorySweetRepository } from "../../src/repositories/sweet.repository.js";

describe("SweetRepository", () => {
  let repository: InMemorySweetRepository;

  beforeEach(() => {
    repository = new InMemorySweetRepository();
  });

  describe("getAll", () => {
    it("should return empty array when no sweets exist", () => {
      const sweets = repository.getAll();
      expect(sweets).toEqual([]);
    });

    it("should return all sweets when sweets exist", () => {
      const sweet1 = new Sweet(1, "Chocolate Bar", "chocolate", 2.5, 10);
      const sweet2 = new Sweet(2, "Gummy Bears", "candy", 1.5, 20);

      repository.create(sweet1);
      repository.create(sweet2);

      const sweets = repository.getAll();
      expect(sweets).toHaveLength(2);
      expect(sweets).toContain(sweet1);
      expect(sweets).toContain(sweet2);
    });
  });

  describe("getById", () => {
    it("should return undefined when sweet don't exist", () => {
      const sweet = repository.getById(1);
      expect(sweet).toBeUndefined();
    });

    it("should return the sweet when it exists", () => {
      const sweet = new Sweet(1, "Chocolate Bar", "chocolate", 2.5, 10);
      const sweet2 = new Sweet(2, "Gummy Bears", "candy", 1.5, 20);
      const sweet3 = new Sweet(3, "Croissant", "pastry", 3.0, 5);
      repository.create(sweet);
      repository.create(sweet2);
      repository.create(sweet3);

      const foundSweet1 = repository.getById(1);
      expect(foundSweet1).toEqual(sweet);

      const foundSweet2 = repository.getById(2);
      expect(foundSweet2).toEqual(sweet2);

      const foundSweet3 = repository.getById(3);
      expect(foundSweet3).toEqual(sweet3);
    });
  });

  describe("create", () => {
    it("should add multiple sweets to the repository", () => {
      const sweet1 = new Sweet(1, "Chocolate Bar", "chocolate", 2.5, 10);
      const sweet2 = new Sweet(2, "Gummy Bears", "candy", 1.5, 20);
      const sweet3 = new Sweet(3, "Croissant", "pastry", 3.0, 5);

      repository.create(sweet1);
      repository.create(sweet2);
      repository.create(sweet3);

      const sweets = repository.getAll();
      expect(sweets).toHaveLength(3);
      expect(sweets).toContain(sweet1);
      expect(sweets).toContain(sweet2);
      expect(sweets).toContain(sweet3);
    });

    it("should throw error when creating sweet with null or undefined sweet", () => {
      expect(() => repository.create(null as unknown as Sweet)).toThrow();
      expect(() => repository.create(undefined as unknown as Sweet)).toThrow();
    });

    it("should return the created sweet", () => {
      const sweet = new Sweet(1, "Chocolate Bar", "chocolate", 2.5, 10);

      const result = repository.create(sweet);

      expect(result).toBe(sweet);
    });
  });

  describe("delete", () => {
    it("should return false when trying to delete non-existent sweet", () => {
      const result = repository.delete(999);
      expect(result).toBe(false);
    });

    it("should delete existing sweet and return true", () => {
      const sweet = new Sweet(1, "Chocolate Bar", "chocolate", 2.5, 10);
      repository.create(sweet);

      const result = repository.delete(1);
      expect(result).toBe(true);

      const foundSweet = repository.getById(1);
      expect(foundSweet).toBeUndefined();
    });

    it("should only delete the specified sweet", () => {
      const sweet1 = new Sweet(1, "Chocolate Bar", "chocolate", 2.5, 10);
      const sweet2 = new Sweet(2, "Gummy Bears", "candy", 1.5, 20);
      const sweet3 = new Sweet(3, "Croissant", "pastry", 3.0, 5);

      repository.create(sweet1);
      repository.create(sweet2);
      repository.create(sweet3);

      const result = repository.delete(2);
      expect(result).toBe(true);

      const allSweets = repository.getAll();
      expect(allSweets).toHaveLength(2);
      expect(allSweets).toContain(sweet1);
      expect(allSweets).toContain(sweet3);
      expect(allSweets).not.toContain(sweet2);
    });
  });

  describe("search", () => {
    beforeEach(() => {
      const sweet1 = new Sweet(1, "Chocolate Bar", "chocolate", 2.5, 10);
      const sweet2 = new Sweet(2, "Milk Chocolate", "chocolate", 3.0, 15);
      const sweet3 = new Sweet(3, "Gummy Bears", "candy", 1.5, 20);
      const sweet4 = new Sweet(4, "Sour Gummies", "candy", 2.0, 12);
      const sweet5 = new Sweet(5, "Croissant", "pastry", 4.5, 5);
      const sweet6 = new Sweet(6, "Danish Pastry", "pastry", 3.5, 8);

      repository.create(sweet1);
      repository.create(sweet2);
      repository.create(sweet3);
      repository.create(sweet4);
      repository.create(sweet5);
      repository.create(sweet6);
    });

    describe("search by name", () => {
      it("should return sweets matching partial name - case insensitive", () => {
        const results = repository.search({ name: "chocolate" });
        expect(results).toHaveLength(2);
        expect(results.map((s) => s.id)).toContain(1);
        expect(results.map((s) => s.id)).toContain(2);
      });

      it("should return sweets matching exact name", () => {
        const results = repository.search({ name: "Gummy Bears" });
        expect(results).toHaveLength(1);
        expect(results.map((s) => s.id)).toContain(3);
      });

      it("should return empty array when no name matches", () => {
        const results = repository.search({ name: "Nonexistent" });
        expect(results).toEqual([]);
      });
    });

    describe("search by category", () => {
      it("should return all sweets in a category", () => {
        const results = repository.search({ category: "candy" });
        expect(results).toHaveLength(2);
        expect(results.map((s) => s.id)).toContain(3);
        expect(results.map((s) => s.id)).toContain(4);
      });

      it("should return empty array when category doesn't exist", () => {
        const results = repository.search({ category: "ice-cream" });
        expect(results).toEqual([]);
      });
    });

    describe("search by price range", () => {
      it("should return sweets within price range", () => {
        const results = repository.search({ minPrice: 2.0, maxPrice: 3.0 });
        expect(results).toHaveLength(3);
        expect(results.map((s) => s.id)).toContain(1);
        expect(results.map((s) => s.id)).toContain(2);
        expect(results.map((s) => s.id)).toContain(4);
      });

      it("should return sweets with minimum price only", () => {
        const results = repository.search({ minPrice: 3.0 });
        expect(results).toHaveLength(3);
        expect(results.map((s) => s.id)).toContain(5);
        expect(results.map((s) => s.id)).toContain(6);
        expect(results.map((s) => s.id)).toContain(2);
      });

      it("should return sweets with maximum price only", () => {
        const results = repository.search({ maxPrice: 2.0 });
        expect(results).toHaveLength(2);
        expect(results.map((s) => s.id)).toContain(3);
        expect(results.map((s) => s.id)).toContain(4);
      });

      it("should return empty array when no sweets match price range", () => {
        const results = repository.search({ minPrice: 10.0, maxPrice: 15.0 });
        expect(results).toEqual([]);
      });
    });

    describe("search with multiple criteria", () => {
      it("should return sweets matching both name and category", () => {
        const results = repository.search({
          name: "chocolate",
          category: "chocolate",
        });
        expect(results).toHaveLength(2);
        expect(results.map((s) => s.id)).toContain(1);
        expect(results.map((s) => s.id)).toContain(2);
      });

      it("should return sweets matching category and price range", () => {
        const results = repository.search({
          category: "candy",
          minPrice: 1.8,
          maxPrice: 2.5,
        });
        expect(results).toHaveLength(1);
        expect(results.map((s) => s.id)).toContain(4);
      });

      it("should return sweets matching name and price range", () => {
        const results = repository.search({ name: "chocolate", minPrice: 2.8 });
        expect(results).toHaveLength(1);
        expect(results.map((s) => s.id)).toContain(2);
      });

      it("should return empty array when no sweets match all criteria", () => {
        const results = repository.search({
          name: "chocolate",
          category: "candy",
        });
        expect(results).toEqual([]);
      });
    });
  });

  describe("Inventory Management", () => {
    describe("Purchase Operations", () => {
      beforeEach(() => {
        const sweet1 = new Sweet(1, "Chocolate Bar", "chocolate", 2.5, 10);
        const sweet2 = new Sweet(2, "Gummy Bears", "candy", 1.5, 20);
        const sweet3 = new Sweet(3, "Croissant", "pastry", 4.5, 0);

        repository.create(sweet1);
        repository.create(sweet2);
        repository.create(sweet3);
      });

      it("should successfully purchase when sweet exists and has sufficient stock", () => {
        const result = repository.purchase(1, 3);

        expect(result).toBe(true);
        const sweet = repository.getById(1);
        expect(sweet?.quantity).toBe(7);
      });

      it("should return false when sweet does not exist", () => {
        const result = repository.purchase(999, 1);
        expect(result).toBe(false);
      });

      it("should return false when insufficient stock available", () => {
        const result = repository.purchase(1, 15);
        expect(result).toBe(false);

        const sweet = repository.getById(1);
        expect(sweet?.quantity).toBe(10);
      });

      it("should maintain other sweet properties unchanged after purchase", () => {
        const originalSweet = repository.getById(1);
        const originalName = originalSweet?.name;
        const originalCategory = originalSweet?.category;
        const originalPrice = originalSweet?.price;

        repository.purchase(1, 5);

        const sweet = repository.getById(1);
        expect(sweet?.name).toBe(originalName);
        expect(sweet?.category).toBe(originalCategory);
        expect(sweet?.price).toBe(originalPrice);
      });
    });

    describe("Restock Operations", () => {
      beforeEach(() => {
        const sweet1 = new Sweet(1, "Chocolate Bar", "chocolate", 2.5, 10);
        const sweet2 = new Sweet(2, "Gummy Bears", "candy", 1.5, 0);
        const sweet3 = new Sweet(3, "Croissant", "pastry", 4.5, 5);

        repository.create(sweet1);
        repository.create(sweet2);
        repository.create(sweet3);
      });

      it("should successfully restock when sweet exists", () => {
        const result = repository.restock(1, 15);

        expect(result).toBe(true);
        const sweet = repository.getById(1);
        expect(sweet?.quantity).toBe(25);
      });

      it("should return false when sweet does not exist", () => {
        const result = repository.restock(999, 10);
        expect(result).toBe(false);
      });

      it("should maintain other sweet properties unchanged after restock", () => {
        const originalSweet = repository.getById(1);
        const originalName = originalSweet?.name;
        const originalCategory = originalSweet?.category;
        const originalPrice = originalSweet?.price;

        repository.restock(1, 20);

        const sweet = repository.getById(1);
        expect(sweet?.name).toBe(originalName);
        expect(sweet?.category).toBe(originalCategory);
        expect(sweet?.price).toBe(originalPrice);
      });
    });

    describe("Update Operations", () => {
      beforeEach(() => {
        const sweet1 = new Sweet(1, "Chocolate Bar", "chocolate", 2.5, 10);
        const sweet2 = new Sweet(2, "Gummy Bears", "candy", 1.5, 20);

        repository.create(sweet1);
        repository.create(sweet2);
      });

      it("should successfully update existing sweet", () => {
        const sweet1 = repository.getById(1)!;
        expect(sweet1).toBeDefined();

        sweet1.name = "Dark Chocolate Bar";
        sweet1.price = 3.0;
        sweet1.quantity = 15;

        const result = repository.update(sweet1);

        expect(result).toBe(true);
        const sweet = repository.getById(1);
        expect(sweet?.name).toBe("Dark Chocolate Bar");
        expect(sweet?.price).toBe(3.0);
        expect(sweet?.quantity).toBe(15);
      });
    });
  });
});
