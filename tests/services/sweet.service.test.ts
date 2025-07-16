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
});
