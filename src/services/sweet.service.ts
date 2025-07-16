import type { Sweet } from "../models/sweet.model.js";
import type { ISweetRepository } from "../repositories/sweet.repository.js";
import type { SearchCriteria } from "../types/sweet.js";

export class SweetService {
  constructor(private repository: ISweetRepository) {}

  getAllSweets() {
    return this.repository.getAll();
  }

  getSweetById(id: number): Sweet | undefined {
    if (typeof id !== "number" || !Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid ID: ID must be a positive integer");
    }
    return this.repository.getById(id);
  }

  createSweet(sweet: Sweet): Sweet {
    if (!sweet) {
      throw new Error("Sweet cannot be null or undefined");
    }
    const existingSweet = this.repository.getById(sweet.id);

    if (existingSweet) {
      throw new Error(`Sweet with ID ${sweet.id} already exists`);
    }

    return this.repository.create(sweet);
  }

  deleteSweet(id: number): boolean {
    if (typeof id !== "number" || !Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid ID: ID must be a positive integer");
    }
    return this.repository.delete(id);
  }

  searchSweets(criteria: SearchCriteria): Sweet[] {
    if (!criteria || typeof criteria !== "object") {
      throw new Error("Search criteria must be a valid object");
    }

    const { name, category, minPrice, maxPrice } = criteria;

    if (
      (minPrice !== undefined && typeof minPrice !== "number") ||
      (maxPrice !== undefined && typeof maxPrice !== "number")
    ) {
      throw new Error("Price range must be valid numbers");
    }

    const validCriteriaKeys = [];

    if (name && typeof name === "string" && name.trim() !== "") {
      validCriteriaKeys.push("name");
    }

    if (category && typeof category === "string" && category.trim() !== "") {
      validCriteriaKeys.push("category");
    }

    if (
      minPrice !== undefined &&
      typeof minPrice === "number" &&
      minPrice >= 0
    ) {
      validCriteriaKeys.push("minPrice");
    }

    if (
      maxPrice !== undefined &&
      typeof maxPrice === "number" &&
      maxPrice >= 0
    ) {
      validCriteriaKeys.push("maxPrice");
    }

    if (validCriteriaKeys.length === 0) {
      throw new Error("At least one valid search criteria is required");
    }

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      throw new Error(
        "Invalid price range: minPrice cannot be greater than maxPrice",
      );
    }
    const normalizedCriteria: SearchCriteria = {
      name: name?.trim().toLowerCase(),
      category: category?.trim().toLowerCase(),
      minPrice: minPrice ?? 0,
      maxPrice: maxPrice ?? Number.MAX_SAFE_INTEGER,
    };

    return this.repository.search(normalizedCriteria);
  }

  purchaseSweet(id: number, quantity: number): boolean {
    if (typeof id !== "number" || !Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid ID: ID must be a positive integer");
    }
    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      throw new Error("Invalid quantity: Quantity must be a positive integer");
    }
    const result = this.repository.purchase(id, quantity);
    if (!result) {
      throw new Error("Purchase failed: Not enough stock or sweet not found");
    }
    return result;
  }

  restockSweet(id: number, quantity: number): boolean {
    if (typeof id !== "number" || !Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid ID: ID must be a positive integer");
    }
    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      throw new Error("Invalid quantity: Quantity must be a positive integer");
    }

    const result = this.repository.restock(id, quantity);
    if (!result) {
      throw new Error("Restock failed: Sweet not found or invalid quantity");
    }
    return result;
  }
}
