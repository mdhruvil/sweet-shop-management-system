import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../src/index.js";
import {
  expectErrorResponse,
  expectSuccessResponse,
  expectValidSweet,
  setupTestData,
} from "./utils.js";

describe("Sweet Shop API Integration Tests", () => {
  describe("GET /api/sweets", () => {
    it("should return empty array when no sweets exist", async () => {
      const response = await request(app).get("/api/sweets");

      expectSuccessResponse(response, 200);
      expect(response.body.data).toEqual([]);
    });

    it("should return all sweets when they exist", async () => {
      await setupTestData();

      const response = await request(app).get("/api/sweets");

      expectSuccessResponse(response, 200);
      expect(response.body.data).toHaveLength(4);
      response.body.data.forEach(expectValidSweet);
    });

    it("should return sweets in consistent order", async () => {
      await setupTestData();

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
      const sweets = await setupTestData();

      const sweet = sweets[0];
      const response = await request(app).get(`/api/sweets/${sweet?.id}`);

      expectSuccessResponse(response, 200);
      expectValidSweet(response.body.data);
      expect(response.body.data.id).toBe(sweet?.id);
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

  describe("DELETE /api/sweets/:id", () => {
    it("should delete existing sweet", async () => {
      const sweets = await setupTestData();

      const response = await request(app).delete(
        `/api/sweets/${sweets[0]?.id}`,
      );

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
      const sweets = await setupTestData();

      await request(app).delete(`/api/sweets/${sweets[0]?.id}`);

      const getResponse = await request(app).get(
        `/api/sweets/${sweets[0]?.id}`,
      );
      expectErrorResponse(getResponse, 404);
    });
  });

  describe("POST /api/sweets/:id/purchase", () => {
    const purchaseData = { quantity: 5 };

    it("should purchase sweet with sufficient stock", async () => {
      const sweets = await setupTestData();

      const response = await request(app)
        .post(`/api/sweets/${sweets[0]?.id}/purchase`)
        .send(purchaseData);

      expectSuccessResponse(response, 200);
      expectValidSweet(response.body.data);
      expect(response.body.data.quantity).toBe(15); // 20 - 5
    });

    it("should return 400 for insufficient stock", async () => {
      const sweets = await setupTestData();
      console.log(sweets);
      const largeOrder = { quantity: 100 };

      const response = await request(app)
        .post(`/api/sweets/${sweets[0]?.id}/purchase`)
        .send(largeOrder);
      console.log(response.body);

      expectErrorResponse(response, 400);
    });

    it("should return 400 for zero or negative quantity", async () => {
      const sweets = await setupTestData();
      const invalidOrder = { quantity: 0 };

      const response = await request(app)
        .post(`/api/sweets/${sweets[0]?.id}/purchase`)
        .send(invalidOrder);

      expectErrorResponse(response, 400);
    });

    it("should return 404 for non-existent sweet", async () => {
      const response = await request(app)
        .post("/api/sweets/999/purchase")
        .send(purchaseData);

      expectErrorResponse(response, 404);
    });

    it("should handle service returning null for purchase", async () => {
      const response = await request(app)
        .post("/api/sweets/999999/purchase")
        .send(purchaseData);

      expectErrorResponse(response, 404);
    });

    it("should reject purchase without quantity field", async () => {
      const sweets = await setupTestData();

      const response = await request(app)
        .post(`/api/sweets/${sweets[0]?.id}/purchase`)
        .send({});

      expectErrorResponse(response, 400);
    });
  });

  describe("POST /api/sweets/:id/restock", () => {
    const restockData = { quantity: 10 };

    it("should restock sweet with valid quantity", async () => {
      const sweets = await setupTestData();

      const response = await request(app)
        .post(`/api/sweets/${sweets[0]?.id}/restock`)
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

    it("should handle service returning null for restock", async () => {
      const response = await request(app)
        .post("/api/sweets/999999/restock")
        .send(restockData);

      expectErrorResponse(response, 404);
    });

    it("should return 400 for zero or negative quantity", async () => {
      const sweets = await setupTestData();
      const invalidRestock = { quantity: -5 };

      const response = await request(app)
        .post(`/api/sweets/${sweets[0]?.id}/restock`)
        .send(invalidRestock);

      expectErrorResponse(response, 400);
    });

    it("should reject restock without quantity field", async () => {
      const sweets = await setupTestData();

      const response = await request(app)
        .post(`/api/sweets/${sweets[0]?.id}/restock`)
        .send({});

      expectErrorResponse(response, 400);
    });

    it("should work on out of stock items", async () => {
      const sweets = await setupTestData();

      const response = await request(app)
        .post(`/api/sweets/${sweets[3]?.id}/restock`) // Sweet with 0 quantity
        .send({ quantity: 15 });

      expectSuccessResponse(response, 200);
      expect(response.body.data.quantity).toBe(15);
    });
  });

  describe("Error Handling", () => {
    it("should return 404 for non-existent endpoints", async () => {
      const response = await request(app).get("/api/nonexistent");

      expect(response.status).toBe(404);
    });

    it("should return appropriate content-type headers", async () => {
      await setupTestData();

      const response = await request(app).get("/api/sweets");

      expect(response.headers["content-type"]).toMatch(/application\/json/);
    });
  });
});
