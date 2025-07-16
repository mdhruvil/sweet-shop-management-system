import request from "supertest";
import { expect } from "vitest";
import { Sweet } from "../../src/models/sweet.model.js";
import type { SweetService } from "../../src/services/sweet.service.js";

export const createTestSweet = (overrides: Partial<Sweet> = {}): Sweet => {
  return new Sweet(
    overrides.id ?? 1,
    overrides.name ?? "Test Chocolate",
    overrides.category ?? "chocolate",
    overrides.price ?? 5.99,
    overrides.quantity ?? 10,
  );
};

export const setupTestData = (service: SweetService) => {
  const sweets = [
    createTestSweet({
      id: 1,
      name: "Dark Chocolate",
      category: "chocolate",
      price: 4.99,
      quantity: 20,
    }),
    createTestSweet({
      id: 2,
      name: "Gummy Bears",
      category: "candy",
      price: 2.99,
      quantity: 50,
    }),
    createTestSweet({
      id: 3,
      name: "Croissant",
      category: "pastry",
      price: 3.49,
      quantity: 15,
    }),
    createTestSweet({
      id: 4,
      name: "Milk Chocolate",
      category: "chocolate",
      price: 3.99,
      quantity: 0,
    }),
  ];

  sweets.forEach((sweet) => service.createSweet(sweet));
  return sweets;
};

export const expectValidSweet = (sweet: Sweet) => {
  expect(sweet).toHaveProperty("id");
  expect(sweet).toHaveProperty("name");
  expect(sweet).toHaveProperty("category");
  expect(sweet).toHaveProperty("price");
  expect(sweet).toHaveProperty("quantity");
  expect(typeof sweet.id).toBe("number");
  expect(typeof sweet.name).toBe("string");
  expect(typeof sweet.category).toBe("string");
  expect(typeof sweet.price).toBe("number");
  expect(typeof sweet.quantity).toBe("number");
};

export const expectApiResponse = (
  response: request.Response,
  expectedStatus: number,
) => {
  expect(response.status).toBe(expectedStatus);
  expect(response.headers["content-type"]).toMatch(/json/);
};

export const expectErrorResponse = (
  response: request.Response,
  expectedStatus: number,
) => {
  expectApiResponse(response, expectedStatus);
  expect(response.body).toHaveProperty("error");
  expect(typeof response.body.error).toBe("string");
};

export const expectSuccessResponse = (
  response: request.Response,
  expectedStatus: number = 200,
) => {
  expectApiResponse(response, expectedStatus);
  expect(response.body).toHaveProperty("data");
};
