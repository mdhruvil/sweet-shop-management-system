import express, { type ErrorRequestHandler } from "express";
import { NotFoundError, ValidationError } from "./errors/sweet.errors.js";
import { logger } from "./lib/logger.js";
import { sweetRouter } from "./routes/sweet.router.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.get("/api/health", (req, res) => {
  logger.error("Health check endpoint hit");
  res.json({ status: "OK" });
});

app.use("/api", sweetRouter);
app.all("*path", (req, res) => {
  logger.error(`Route not found: ${req.originalUrl}`);
  res.status(404).json({ error: "Not Found" });
});

const errorHandler: ErrorRequestHandler = (err, req, res) => {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
  } else if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
  } else if (err instanceof SyntaxError) {
    console.error("Syntax Error:", err.message);
    res.status(400).json({ error: "Invalid JSON format" });
  } else {
    console.log("Internal Server Error");
    res.status(500).json({ error: "Internal Server Error" });
  }
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export { app };
