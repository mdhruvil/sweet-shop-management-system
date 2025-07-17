import request from "supertest";
import { app } from "../../src/index.js";
import type { Sweet } from "../../src/models/sweet.model.js";
import {
  expectErrorResponse,
  expectSuccessResponse,
  setupTestData,
} from "./utils.js";

describe("GET /api/sweets/search", async () => {
  beforeAll(async () => {
    await setupTestData();
  });

  it("should search by name", async () => {
    const response = await request(app)
      .get("/api/sweets/search")
      .query({ name: "Chocolate" });

    expectSuccessResponse(response, 200);
    expect(response.body.data).toHaveLength(2);
    response.body.data.forEach((sweet: Sweet) => {
      expect(sweet.name.toLowerCase()).toContain("chocolate");
    });
  });

  it("should search by category", async () => {
    const response = await request(app)
      .get("/api/sweets/search")
      .query({ category: "chocolate" });

    expectSuccessResponse(response, 200);
    expect(response.body.data).toHaveLength(2);
    response.body.data.forEach((sweet: Sweet) => {
      expect(sweet.category).toBe("chocolate");
    });
  });

  it("should search by price range", async () => {
    const response = await request(app)
      .get("/api/sweets/search")
      .query({ minPrice: 3.0, maxPrice: 4.0 });

    expectSuccessResponse(response, 200);
    expect(response.body.data.length).toBeGreaterThan(0);
    response.body.data.forEach((sweet: Sweet) => {
      expect(sweet.price).toBeGreaterThanOrEqual(3.0);
      expect(sweet.price).toBeLessThanOrEqual(4.0);
    });
  });

  it("should combine search criteria", async () => {
    const response = await request(app).get("/api/sweets/search").query({
      category: "chocolate",
      minPrice: 4.0,
    });

    expectSuccessResponse(response, 200);
    response.body.data.forEach((sweet: Sweet) => {
      expect(sweet.category).toBe("chocolate");
      expect(sweet.price).toBeGreaterThanOrEqual(4.0);
    });
  });

  it("should return empty array when no matches found", async () => {
    const response = await request(app)
      .get("/api/sweets/search")
      .query({ name: "NonExistentSweet" });

    expectSuccessResponse(response, 200);
    expect(response.body.data).toEqual([]);
  });

  it("should return 400 for invalid search criteria", async () => {
    const response = await request(app).get("/api/sweets/search");

    expectErrorResponse(response, 400);
  });

  it("should handle case-insensitive name search", async () => {
    const response = await request(app)
      .get("/api/sweets/search")
      .query({ name: "DARK" });

    expectSuccessResponse(response, 200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].name).toBe("Dark Chocolate");
  });

  it("should validate price range parameters", async () => {
    const response = await request(app)
      .get("/api/sweets/search")
      .query({ minPrice: "invalid" });

    expectErrorResponse(response, 400);
  });

  it("should handle maxPrice less than minPrice", async () => {
    const response = await request(app)
      .get("/api/sweets/search")
      .query({ minPrice: 10.0, maxPrice: 5.0 });

    expectErrorResponse(response, 400);
  });
});
