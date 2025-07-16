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

    it("should throw error when creating sweet with duplicate ID", () => {
      const sweet1 = new Sweet(1, "Chocolate Bar", "chocolate", 2.5, 10);
      const sweet2 = new Sweet(1, "Different Sweet", "candy", 1.0, 5);

      repository.create(sweet1);

      expect(() => repository.create(sweet2)).toThrow();
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
});
