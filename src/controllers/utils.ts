import type { Response } from "express";
import { NotFoundError, ValidationError } from "../errors/sweet.errors.js";

export function handleCommonErrors(err: unknown, res: Response) {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
  } else if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
