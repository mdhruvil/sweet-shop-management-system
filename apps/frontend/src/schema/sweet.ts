import { z } from "zod";

export const positiveIntegerSchema = z
  .number({ error: "Must be a positive integer" })
  .int({ error: "Must be an integer" })
  .positive({ error: "Must be positive" });

export const nonNegativeIntegerSchema = z
  .number({ error: "Must be a non-negative integer" })
  .int({ error: "Must be an integer" })
  .nonnegative({ error: "Must be non-negative" });

export const nonNegativeNumberSchema = z
  .number({ error: "Must be a non-negative number" })
  .nonnegative({ error: "Must be non-negative" });

export const nonEmptyStringSchema = z
  .string()
  .trim()
  .nonempty({ error: "Cannot be empty" })
  .min(1, { error: "Must be at least 1 character long" });

export const sweetSchema = z.object({
  id: positiveIntegerSchema,
  name: nonEmptyStringSchema,
  category: nonEmptyStringSchema,
  price: nonNegativeNumberSchema,
  quantity: nonNegativeIntegerSchema,
});

export type Sweet = z.infer<typeof sweetSchema>;

export const searchCriteriaSchema = z
  .object({
    name: z.string().optional(),
    category: z.string().optional(),
    minPrice: nonNegativeNumberSchema.optional(),
    maxPrice: nonNegativeNumberSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.minPrice !== undefined && data.maxPrice !== undefined) {
        return data.minPrice <= data.maxPrice;
      }
      return true;
    },
    {
      message: "minPrice cannot be greater than maxPrice",
      path: ["maxPrice"],
    },
  )
  .refine(
    (data) => {
      return (
        (data.name && data.name.trim().length > 0) ||
        (data.category && data.category.trim().length > 0) ||
        data.minPrice !== undefined ||
        data.maxPrice !== undefined
      );
    },
    {
      message: "At least one search criteria is required",
      path: ["name"],
    },
  );
export type SearchCriteria = z.infer<typeof searchCriteriaSchema>;

export const purchaseQuantitySchema = z.object({
  quantity: positiveIntegerSchema,
});

export type PurchaseQuantity = z.infer<typeof purchaseQuantitySchema>;

export const restockQuantitySchema = z.object({
  quantity: positiveIntegerSchema,
});

export type RestockQuantity = z.infer<typeof restockQuantitySchema>;

export const createSweetSchema = z.object({
  name: nonEmptyStringSchema,
  category: nonEmptyStringSchema,
  price: nonNegativeNumberSchema,
  quantity: nonNegativeIntegerSchema,
});

export type CreateSweet = z.infer<typeof createSweetSchema>;
