import { describe, expect, it } from "vitest";
import { handleCommonErrors } from "../../src/controllers/utils.js";
import {
  NotFoundError,
  ValidationError,
} from "../../src/errors/sweet.errors.js";

// Mock Response object
function createMockResponse() {
  const res = {
    status: function (code: number) {
      this.statusCode = code;
      return this;
    },
    json: function (data: any) {
      this.body = data;
      return this;
    },
    statusCode: 0,
    body: {},
  };
  return res as any;
}

describe("Utils - handleCommonErrors", () => {
  it("should handle ValidationError with 400 status", () => {
    const res = createMockResponse();
    const error = new ValidationError("Validation failed");

    handleCommonErrors(error, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Validation failed" });
  });

  it("should handle NotFoundError with 404 status", () => {
    const res = createMockResponse();
    const error = new NotFoundError("Item not found");

    handleCommonErrors(error, res);

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "Item not found" });
  });

  it("should handle unknown errors with 500 status", () => {
    const res = createMockResponse();
    const error = new Error("Unknown error");

    handleCommonErrors(error, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "Internal Server Error" });
  });
});
