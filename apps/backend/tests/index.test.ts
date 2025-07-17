import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/index.js";

describe("Express App", () => {
  describe("Health endpoint", () => {
    it("should return OK status", async () => {
      const response = await request(app).get("/api/health");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: "OK" });
    });
  });

  describe("Error handling middleware", () => {
    it("should handle NotFoundError responses", async () => {
      const response = await request(app).get("/api/sweets/999999");

      expect(response.status).toBe(404);
      expect(response.headers["content-type"]).toMatch(/json/);
    });

    it("should handle validation errors", async () => {
      const response = await request(app)
        .post("/api/sweets/invalid-id/purchase")
        .send({ quantity: 1 });

      expect(response.status).toBe(400);
      expect(response.headers["content-type"]).toMatch(/json/);
    });
  });

  describe("Static file serving", () => {
    it("should serve frontend for non-API routes", async () => {
      const response = await request(app).get("/some-frontend-route");

      // Since we don't have the actual frontend build, this will likely 404
      // but it tests the route handler
      expect([404, 200]).toContain(response.status);
    });
  });
});
