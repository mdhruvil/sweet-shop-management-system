import z from "zod";
import {
  nonEmptyStringSchema,
  nonNegativeIntegerSchema,
  nonNegativeNumberSchema,
  positiveIntegerSchema,
} from "./common.js";

export const sweetSchema = z.object({
  id: positiveIntegerSchema,
  name: nonEmptyStringSchema,
  category: nonEmptyStringSchema,
  price: nonNegativeNumberSchema,
  quantity: nonNegativeIntegerSchema,
});

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
