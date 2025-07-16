import type { Sweet } from "../models/sweet.model.js";

// central interface for sweet repository
// this allows for different implementations (e.g., in-memory, database, etc.)
export interface ISweetRepository {
  create(sweet: Sweet): Sweet;
  getAll(): Sweet[];
  getById(id: number): Sweet | undefined;
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

    if (this.sweets.some((s) => s.id === sweet.id)) {
      throw new Error(`Sweet with ID ${sweet.id} already exists`);
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
}
