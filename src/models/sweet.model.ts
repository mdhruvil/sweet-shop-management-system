export class Sweet {
  constructor(
    public id: number,
    public name: string,
    public category: string,
    public price: number,
    public quantity: number,
  ) {
    if (id <= 0 || !Number.isInteger(id)) {
      throw new Error("ID must be a positive number");
    }

    if (typeof name !== "string" || name.trim() === "") {
      throw new Error("Name cannot be empty");
    }

    if (typeof price !== "number" || price < 0) {
      throw new Error("Price must be a non-negative number");
    }

    if (
      typeof quantity !== "number" ||
      quantity < 0 ||
      !Number.isInteger(quantity)
    ) {
      throw new Error("Quantity must be a non-negative integer");
    }
  }

  canPurchase(amount: number): boolean {
    return this.quantity >= amount && amount > 0;
  }

  purchase(amount: number): void {
    if (!this.canPurchase(amount)) {
      throw new Error("Insufficient quantity or invalid amount");
    }
    this.quantity -= amount;
  }

  restock(amount: number): void {
    if (amount <= 0) {
      throw new Error("Restock amount must be positive");
    }
    this.quantity += amount;
  }
}
