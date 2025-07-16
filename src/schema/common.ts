import z from "zod";

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
