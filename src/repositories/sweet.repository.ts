import type { Sweet } from "../models/sweet.model.js";

// central interface for sweet repository
// this allows for different implementations (e.g., in-memory, database, etc.)
export interface ISweetRepository {
  create(sweet: Sweet): Sweet;
  getAll(): Sweet[];
  getById(id: number): Sweet | undefined;
  delete(id: number): boolean;
}

export class InMemorySweetRepository implements ISweetRepository {
  private sweets: Sweet[];

  constructor() {
    this.sweets = [];
  }

  create(sweet: Sweet): Sweet {
    if (!sweet) {
      throw new Error("Sweet cannot be null or undefined");
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
}
