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
    name: nonEmptyStringSchema.optional(),
    category: nonEmptyStringSchema.optional(),
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
        data.name ||
        data.category ||
        (data.minPrice !== undefined && data.minPrice >= 0) ||
        (data.maxPrice !== undefined && data.maxPrice >= 0)
      );
    },
    {
      message: "At least one valid search criteria is required",
      path: ["name", "category", "minPrice", "maxPrice"],
    },
  );

export type SearchCriteria = z.infer<typeof searchCriteriaSchema>;
