import { prettifyError } from "zod";
import { ValidationError } from "../errors/sweet.errors.js";
import { logger } from "../lib/logger.js";
import { positiveIntegerSchema } from "../schema/common.js";
import { sweetSchema } from "../schema/sweet.schema.js";

export class Sweet {
  constructor(
    public id: number,
    public name: string,
    public category: string,
    public price: number,
    public quantity: number,
  ) {
    const { success, error } = sweetSchema.safeParse({
      id,
      name,
      category,
      price,
      quantity,
    });
    if (!success) {
      const prettyError = prettifyError(error);
      logger.error(`Invalid sweet data: ${prettyError}`);
      throw new ValidationError("Invalid sweet data: " + prettyError);
    }
  }

  canPurchase(amount: number): boolean {
    const { success } = positiveIntegerSchema.safeParse(amount);
    return success && this.quantity >= amount;
  }

  purchase(amount: number): void {
    const { success } = positiveIntegerSchema.safeParse(amount);
    if (!success) {
      logger.error(`Invalid purchase amount: ${amount}`);
      throw new ValidationError("Purchase amount must be a positive integer.");
    }
    if (!this.canPurchase(amount)) {
      logger.error(`Insufficient quantity for purchase: ${amount}`);
      throw new ValidationError("Insufficient quantity");
    }
    this.quantity -= amount;
  }

  restock(amount: number): void {
    const { success } = positiveIntegerSchema.safeParse(amount);
    if (!success) {
      logger.error(`Invalid restock amount: ${amount}`);
      throw new ValidationError("Restock amount must be a positive integer.");
    }
    this.quantity += amount;
  }
}
