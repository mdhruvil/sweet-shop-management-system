import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../../src/index.js";
import type { Sweet } from "../../src/models/sweet.model.js";
import { InMemorySweetRepository } from "../../src/repositories/sweet.repository.js";
import { SweetService } from "../../src/services/sweet.service.js";
import {
  expectErrorResponse,
  expectSuccessResponse,
  expectValidSweet,
  setupTestData,
} from "./utils.js";

describe("Sweet Shop API Integration Tests", () => {
  let service: SweetService;

  beforeEach(() => {
    const repository = new InMemorySweetRepository();
    service = new SweetService(repository);
  });

  describe("GET /api/sweets", () => {
    it("should return empty array when no sweets exist", async () => {
      const response = await request(app).get("/api/sweets");

      expectSuccessResponse(response, 200);
      expect(response.body.data).toEqual([]);
    });

    it("should return all sweets when they exist", async () => {
      setupTestData(service);

      const response = await request(app).get("/api/sweets");

      expectSuccessResponse(response, 200);
      expect(response.body.data).toHaveLength(4);
      response.body.data.forEach(expectValidSweet);
    });

    it("should return sweets in consistent order", async () => {
      setupTestData(service);

      const response1 = await request(app).get("/api/sweets");
      const response2 = await request(app).get("/api/sweets");

      expect(response1.body.data).toEqual(response2.body.data);
    });
  });

  describe("POST /api/sweets", () => {
    const validSweetData = {
      name: "New Chocolate",
      category: "chocolate",
      price: 6.99,
      quantity: 25,
    };

    it("should create a new sweet with valid data", async () => {
      const response = await request(app)
        .post("/api/sweets")
        .send(validSweetData);

      expectSuccessResponse(response, 201);
      expectValidSweet(response.body.data);
      expect(response.body.data.name).toBe(validSweetData.name);
      expect(response.body.data.category).toBe(validSweetData.category);
      expect(response.body.data.price).toBe(validSweetData.price);
      expect(response.body.data.quantity).toBe(validSweetData.quantity);
      expect(response.body.data.id).toBeDefined();
    });

    it("should reject sweet with missing required fields", async () => {
      const invalidData = { name: "Incomplete Sweet" };

      const response = await request(app).post("/api/sweets").send(invalidData);

      expectErrorResponse(response, 400);
    });

    it("should reject sweet with invalid price", async () => {
      const invalidData = { ...validSweetData, price: -5.99 };
      const invalidData2 = { ...validSweetData, quantity: -10 };
      const invalidData3 = { ...validSweetData, category: "" };
      const invalidData4 = { ...validSweetData, name: "" };

      const response = await request(app).post("/api/sweets").send(invalidData);
      const response2 = await request(app)
        .post("/api/sweets")
        .send(invalidData2);
      const response3 = await request(app)
        .post("/api/sweets")
        .send(invalidData3);
      const response4 = await request(app)
        .post("/api/sweets")
        .send(invalidData4);
      expectErrorResponse(response, 400);
      expectErrorResponse(response2, 400);
      expectErrorResponse(response3, 400);
      expectErrorResponse(response4, 400);
    });
  });

  describe("GET /api/sweets/:id", () => {
    it("should return sweet by valid id", async () => {
      const sweets = setupTestData(service);

      const response = await request(app).get("/api/sweets/1");
      const sweet = sweets.find((s) => s.id === 1);

      expectSuccessResponse(response, 200);
      expectValidSweet(response.body.data);
      expect(response.body.data.id).toBe(1);
      expect(response.body.data.name).toBe(sweet?.name);
    });

    it("should return 404 for non-existent sweet", async () => {
      const response = await request(app).get("/api/sweets/999");

      expectErrorResponse(response, 404);
    });

    it("should return 400 for invalid id format", async () => {
      const response = await request(app).get("/api/sweets/invalid");

      expectErrorResponse(response, 400);
    });
  });

  describe("PUT /api/sweets/:id", () => {
    const updateData = {
      name: "Updated Chocolate",
      category: "chocolate",
      price: 7.99,
      quantity: 30,
    };

    it("should update existing sweet", async () => {
      setupTestData(service);

      const response = await request(app).put("/api/sweets/1").send(updateData);

      expectSuccessResponse(response, 200);
      expectValidSweet(response.body.data);
      expect(response.body.data.id).toBe(1);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.price).toBe(updateData.price);
    });

    it("should return 404 for updating non-existent sweet", async () => {
      const response = await request(app)
        .put("/api/sweets/999")
        .send(updateData);

      expectErrorResponse(response, 404);
    });

    it("should reject update with invalid data", async () => {
      setupTestData(service);
      const invalidData = { ...updateData, price: -10 };
      const invalidData2 = { ...updateData, quantity: -5 };
      const invalidData3 = { ...updateData, name: "" };
      const invalidData4 = { ...updateData, category: "" };

      const response = await request(app)
        .put("/api/sweets/1")
        .send(invalidData);

      const response2 = await request(app)
        .put("/api/sweets/1")
        .send(invalidData2);

      const response3 = await request(app)
        .put("/api/sweets/1")
        .send(invalidData3);

      const response4 = await request(app)
        .put("/api/sweets/1")
        .send(invalidData4);

      expectErrorResponse(response, 400);
      expectErrorResponse(response2, 400);
      expectErrorResponse(response3, 400);
      expectErrorResponse(response4, 400);
    });
  });

  describe("DELETE /api/sweets/:id", () => {
    it("should delete existing sweet", async () => {
      setupTestData(service);

      const response = await request(app).delete("/api/sweets/1");

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it("should return 404 for deleting non-existent sweet", async () => {
      const response = await request(app).delete("/api/sweets/999");

      expectErrorResponse(response, 404);
    });

    it("should return 400 for invalid id format", async () => {
      const response = await request(app).delete("/api/sweets/invalid");

      expectErrorResponse(response, 400);
    });

    it("should actually remove sweet from repository", async () => {
      setupTestData(service);

      await request(app).delete("/api/sweets/1");

      const getResponse = await request(app).get("/api/sweets/1");
      expectErrorResponse(getResponse, 404);
    });
  });

  describe("POST /api/sweets/:id/purchase", () => {
    const purchaseData = { quantity: 5 };

    it("should purchase sweet with sufficient stock", async () => {
      setupTestData(service);

      const response = await request(app)
        .post("/api/sweets/1/purchase")
        .send(purchaseData);

      expectSuccessResponse(response, 200);
      expectValidSweet(response.body.data);
      expect(response.body.data.quantity).toBe(15); // 20 - 5
    });

    it("should return 400 for insufficient stock", async () => {
      setupTestData(service);
      const largeOrder = { quantity: 100 };

      const response = await request(app)
        .post("/api/sweets/1/purchase")
        .send(largeOrder);

      expectErrorResponse(response, 400);
    });

    it("should return 400 for zero or negative quantity", async () => {
      setupTestData(service);
      const invalidOrder = { quantity: 0 };

      const response = await request(app)
        .post("/api/sweets/1/purchase")
        .send(invalidOrder);

      expectErrorResponse(response, 400);
    });

    it("should return 404 for non-existent sweet", async () => {
      const response = await request(app)
        .post("/api/sweets/999/purchase")
        .send(purchaseData);

      expectErrorResponse(response, 404);
    });

    it("should reject purchase without quantity field", async () => {
      setupTestData(service);

      const response = await request(app)
        .post("/api/sweets/1/purchase")
        .send({});

      expectErrorResponse(response, 400);
    });
  });

  describe("POST /api/sweets/:id/restock", () => {
    const restockData = { quantity: 10 };

    it("should restock sweet with valid quantity", async () => {
      setupTestData(service);

      const response = await request(app)
        .post("/api/sweets/1/restock")
        .send(restockData);

      expectSuccessResponse(response, 200);
      expectValidSweet(response.body.data);
      expect(response.body.data.quantity).toBe(30); // 20 + 10
    });

    it("should return 404 for non-existent sweet", async () => {
      const response = await request(app)
        .post("/api/sweets/999/restock")
        .send(restockData);

      expectErrorResponse(response, 404);
    });

    it("should return 400 for zero or negative quantity", async () => {
      setupTestData(service);
      const invalidRestock = { quantity: -5 };

      const response = await request(app)
        .post("/api/sweets/1/restock")
        .send(invalidRestock);

      expectErrorResponse(response, 400);
    });

    it("should reject restock without quantity field", async () => {
      setupTestData(service);

      const response = await request(app)
        .post("/api/sweets/1/restock")
        .send({});

      expectErrorResponse(response, 400);
    });

    it("should work on out of stock items", async () => {
      setupTestData(service);

      const response = await request(app)
        .post("/api/sweets/4/restock") // Sweet with 0 quantity
        .send({ quantity: 15 });

      expectSuccessResponse(response, 200);
      expect(response.body.data.quantity).toBe(15);
    });
  });

  describe("GET /api/sweets/search", () => {
    beforeEach(() => {
      setupTestData(service);
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

  describe("Error Handling", () => {
    it("should return 404 for non-existent endpoints", async () => {
      const response = await request(app).get("/api/nonexistent");

      expect(response.status).toBe(404);
    });

    it("should handle malformed JSON in request body", async () => {
      const response = await request(app)
        .post("/api/sweets")
        .set("Content-Type", "application/json")
        .send("{ invalid json }");

      expectErrorResponse(response, 400);
    });

    it("should return appropriate content-type headers", async () => {
      setupTestData(service);

      const response = await request(app).get("/api/sweets");

      expect(response.headers["content-type"]).toMatch(/application\/json/);
    });
  });
});
