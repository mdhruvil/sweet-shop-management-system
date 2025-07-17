import express, { type ErrorRequestHandler } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { NotFoundError, ValidationError } from "./errors/sweet.errors.js";
import { logger } from "./lib/logger.js";
import { sweetRouter } from "./routes/sweet.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  logger.http(`${req.method.toUpperCase()} ${res.statusCode} ${req.originalUrl}`);
  next();
});


// Serve static files from frontend build
app.use(express.static(path.join(__dirname, "../../../frontend/dist")));

app.get("/api/health", (req, res) => {
  logger.info("Health check endpoint hit");
  res.json({ status: "OK" });
});

app.use("/api", sweetRouter);

// Serve frontend for all non-API routes
app.get("*path", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../frontend/dist/index.html"));
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
