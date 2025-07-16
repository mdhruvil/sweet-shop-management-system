import { prettifyError } from "zod";
import { sweetSchema } from "../schema/sweet.schema.js";
import { positiveIntegerSchema } from "../schema/common.js";

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

      throw new Error(prettyError);
    }
  }

  canPurchase(amount: number): boolean {
    const { success } = positiveIntegerSchema.safeParse(amount);
    return success && this.quantity >= amount;
  }

  purchase(amount: number): void {
    const { success, error } = positiveIntegerSchema.safeParse(amount);
    if (!success) {
      const prettyError = prettifyError(error);

      throw new Error(prettyError);
    }
    if (!this.canPurchase(amount)) {
      throw new Error("Insufficient quantity");
    }
    this.quantity -= amount;
  }

  restock(amount: number): void {
    const { success, error } = positiveIntegerSchema.safeParse(amount);
    if (!success) {
      const prettyError = prettifyError(error);

      throw new Error(prettyError);
    }
    this.quantity += amount;
  }
}
