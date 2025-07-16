import type { Sweet } from "../models/sweet.model.js";
import type { ISweetRepository } from "../repositories/sweet.repository.js";

export class SweetService {
  constructor(private repository: ISweetRepository) {}

  getAllSweets() {
    return this.repository.getAll();
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
}
