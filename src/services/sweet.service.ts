import { prettifyError } from "zod";
import type { Sweet } from "../models/sweet.model.js";
import type { ISweetRepository } from "../repositories/sweet.repository.js";
import { positiveIntegerSchema } from "../schema/common.js";
import { searchCriteriaSchema } from "../schema/sweet.schema.js";
import type { SearchCriteria } from "../types/sweet.js";

export class SweetService {
  constructor(private repository: ISweetRepository) {}

  getAllSweets() {
    return this.repository.getAll();
  }

  getSweetById(id: number): Sweet | undefined {
    const { success, error } = positiveIntegerSchema.safeParse(id);
    if (!success) {
      const prettyError = prettifyError(error);

      throw new Error(prettyError);
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
    const { success, error } = positiveIntegerSchema.safeParse(id);
    if (!success) {
      const prettyError = prettifyError(error);

      throw new Error(prettyError);
    }
    return this.repository.delete(id);
  }
  searchSweets(criteria: SearchCriteria): Sweet[] {
    const { success, error } = searchCriteriaSchema.safeParse(criteria);
    if (!success) {
      const prettyError = prettifyError(error);

      throw new Error(prettyError);
    }

    return this.repository.search(criteria);
  }
  purchaseSweet(id: number, quantity: number): boolean {
    const idValidation = positiveIntegerSchema.safeParse(id);
    if (!idValidation.success) {
      const prettyError = prettifyError(idValidation.error);

      throw new Error(prettyError);
    }

    const quantityValidation = positiveIntegerSchema.safeParse(quantity);
    if (!quantityValidation.success) {
      const prettyError = prettifyError(quantityValidation.error);

      throw new Error(prettyError);
    }

    const result = this.repository.purchase(id, quantity);
    if (!result) {
      throw new Error("Purchase failed: Not enough stock or sweet not found");
    }
    return result;
  }
  restockSweet(id: number, quantity: number): boolean {
    const idValidation = positiveIntegerSchema.safeParse(id);
    if (!idValidation.success) {
      const prettyError = prettifyError(idValidation.error);

      throw new Error(prettyError);
    }

    const quantityValidation = positiveIntegerSchema.safeParse(quantity);
    if (!quantityValidation.success) {
      const prettyError = prettifyError(quantityValidation.error);

      throw new Error(prettyError);
    }

    const result = this.repository.restock(id, quantity);
    if (!result) {
      throw new Error("Restock failed: Sweet not found or invalid quantity");
    }
    return result;
  }
}
