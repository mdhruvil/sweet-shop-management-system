import express from "express";
import { logger } from "./lib/logger.js";

export const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/health", (req, res) => {
  logger.error("Health check endpoint hit");
  res.json({ status: "OK" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
