import { prettifyError } from "zod";
import { ValidationError } from "../errors/sweet.errors.js";
import { logger } from "../lib/logger.js";
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
      logger.error(`Invalid sweet ID: ${prettyError}`);
      throw new ValidationError(`Invalid sweet ID: ${prettyError}`);
    }
    return this.repository.getById(id);
  }

  createSweet(sweet: Sweet): Sweet {
    if (!sweet) {
      logger.error(`Sweet cannot be null or undefined`);
      throw new ValidationError(`Sweet cannot be null or undefined`);
    }
    const existingSweet = this.repository.exists(sweet.id);

    if (existingSweet) {
      logger.error(`Sweet with ID ${sweet.id} already exists`);
      throw new ValidationError(`Sweet with ID ${sweet.id} already exists`);
    }

    return this.repository.create(sweet);
  }

  deleteSweet(id: number): boolean {
    const { success, error } = positiveIntegerSchema.safeParse(id);
    if (!success) {
      const prettyError = prettifyError(error);
      logger.error(`Invalid sweet ID: ${prettyError}`);
      throw new ValidationError(`Invalid sweet ID: ${prettyError}`);
    }
    return this.repository.delete(id);
  }

  searchSweets(criteria: SearchCriteria): Sweet[] {
    const { success, error } = searchCriteriaSchema.safeParse(criteria);
    if (!success) {
      const prettyError = prettifyError(error);
      logger.error(`Invalid search criteria: ${prettyError}`);
      throw new ValidationError(`Invalid search criteria: ${prettyError}`);
    }

    return this.repository.search(criteria);
  }

  purchaseSweet(id: number, quantity: number): Sweet | undefined {
    const idValidation = positiveIntegerSchema.safeParse(id);
    if (!idValidation.success) {
      const prettyError = prettifyError(idValidation.error);
      logger.error(`Invalid sweet ID: ${prettyError}`);
      throw new ValidationError(`Invalid sweet ID: ${prettyError}`);
    }

    const quantityValidation = positiveIntegerSchema.safeParse(quantity);
    if (!quantityValidation.success) {
      const prettyError = prettifyError(quantityValidation.error);
      logger.error(`Invalid quantity: ${prettyError}`);
      throw new ValidationError(`Invalid quantity: ${prettyError}`);
    }

    const result = this.repository.purchase(id, quantity);
    if (!result) {
      throw new ValidationError(
        "Purchase failed: Not enough stock or sweet not found",
      );
    }
    const sweet = this.getSweetById(id);
    return sweet;
  }

  restockSweet(id: number, quantity: number): Sweet | undefined {
    const idValidation = positiveIntegerSchema.safeParse(id);
    if (!idValidation.success) {
      const prettyError = prettifyError(idValidation.error);
      logger.error(`Invalid sweet ID: ${prettyError}`);
      throw new ValidationError(`Invalid sweet ID: ${prettyError}`);
    }

    const quantityValidation = positiveIntegerSchema.safeParse(quantity);
    if (!quantityValidation.success) {
      const prettyError = prettifyError(quantityValidation.error);
      logger.error(`Invalid quantity: ${prettyError}`);
      throw new ValidationError(`Invalid quantity: ${prettyError}`);
    }

    const result = this.repository.restock(id, quantity);
    if (!result) {
      throw new ValidationError(
        "Restock failed: Sweet not found or invalid quantity",
      );
    }
    const sweet = this.getSweetById(id);
    return sweet;
  }
}
