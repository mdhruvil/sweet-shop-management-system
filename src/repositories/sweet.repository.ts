import { NotFoundError } from "../errors/sweet.errors.js";
import type { Sweet } from "../models/sweet.model.js";
import type { SearchCriteria } from "../types/sweet.js";

// central interface for sweet repository
// this allows for different implementations (e.g., in-memory, database, etc.)
export interface ISweetRepository {
  create(sweet: Sweet): Sweet;
  getAll(): Sweet[];
  getById(id: number): Sweet | undefined;
  delete(id: number): boolean;
  search(criteria: SearchCriteria): Sweet[];

  update(sweet: Sweet): boolean;
  purchase(id: number, quantity: number): boolean;
  restock(id: number, quantity: number): boolean;
}

export class InMemorySweetRepository implements ISweetRepository {
  private sweets: Sweet[];

  constructor() {
    this.sweets = [];
  }

  create(sweet: Sweet): Sweet {
    if (!sweet) {
      throw new NotFoundError("Sweet cannot be null or undefined");
    }

    this.sweets.push(sweet);
    return sweet;
  }

  getAll(): Sweet[] {
    return this.sweets;
  }

  getById(id: number): Sweet | undefined {
    return this.sweets.find((sweet) => sweet.id === id);
  }

  delete(id: number): boolean {
    const index = this.sweets.findIndex((sweet) => sweet.id === id);
    if (index === -1) {
      return false; // Sweet not found
    }

    this.sweets.splice(index, 1);
    return true;
  }

  search(criteria: SearchCriteria): Sweet[] {
    const { name, category, minPrice, maxPrice } = criteria;
    const finalCriteria = {
      name: name?.trim().toLowerCase(),
      category: category?.trim().toLowerCase(),
      minPrice: minPrice ?? 0,
      maxPrice: maxPrice ?? Number.MAX_SAFE_INTEGER,
    };

    return this.sweets.filter((sweet) => {
      const matchesName = finalCriteria.name
        ? sweet.name.toLowerCase().includes(finalCriteria.name)
        : true;
      const matchesCategory = finalCriteria.category
        ? sweet.category.toLowerCase().includes(finalCriteria.category)
        : true;
      const matchesPrice =
        sweet.price >= finalCriteria.minPrice &&
        sweet.price <= finalCriteria.maxPrice;

      return matchesName && matchesCategory && matchesPrice;
    });
  }

  update(sweet: Sweet): boolean {
    const index = this.sweets.findIndex((s) => s.id === sweet.id);
    if (index === -1) {
      return false; // Sweet not found
    }

    this.sweets[index] = sweet;
    return true;
  }

  purchase(id: number, quantity: number): boolean {
    const sweet = this.getById(id);

    if (!sweet?.canPurchase(quantity)) {
      return false; // Not enough stock or sweet not found
    }

    sweet.purchase(quantity);
    return this.update(sweet);
  }

  restock(id: number, quantity: number): boolean {
    const sweet = this.getById(id);
    if (!sweet) {
      return false;
    }
    sweet.restock(quantity);
    return this.update(sweet);
  }
}
