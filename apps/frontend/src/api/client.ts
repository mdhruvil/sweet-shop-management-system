import type { SearchCriteria, Sweet } from "@/schema/sweet";

class ApiClient {
  baseURL: string;
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async $fetch<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    if (!response.ok) {
      let errorText = "Unknown error!";
      try {
        const errorResponse = await response.json();
        errorText =
          errorResponse.error ||
          errorResponse.message ||
          `HTTP ${response.status}`;
      } catch {
        errorText = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorText);
    }
    const { data } = await response.json();
    return data as T;
  }

  getSweets(): Promise<Sweet[]> {
    return this.$fetch<Sweet[]>("/sweets");
  }

  getSweet(id: number): Promise<Sweet> {
    return this.$fetch<Sweet>(`/sweets/${id}`);
  }

  createSweet(sweet: Omit<Sweet, "id">): Promise<Sweet> {
    return this.$fetch<Sweet>("/sweets", {
      method: "POST",
      body: JSON.stringify(sweet),
    });
  }

  searchSweets(SearchCriteria: SearchCriteria) {
    const queryParams = new URLSearchParams();
    if (SearchCriteria.name) queryParams.append("name", SearchCriteria.name);
    if (SearchCriteria.category)
      queryParams.append("category", SearchCriteria.category);
    if (SearchCriteria.minPrice !== undefined)
      queryParams.append("minPrice", SearchCriteria.minPrice.toString());
    if (SearchCriteria.maxPrice !== undefined)
      queryParams.append("maxPrice", SearchCriteria.maxPrice.toString());

    return this.$fetch<Sweet[]>(`/sweets/search?${queryParams.toString()}`);
  }

  purchaseSweet(id: number, quantity: number): Promise<Sweet> {
    return this.$fetch<Sweet>(`/sweets/${id}/purchase`, {
      method: "POST",
      body: JSON.stringify({ quantity }),
    });
  }

  restockSweet(id: number, quantity: number): Promise<Sweet> {
    return this.$fetch<Sweet>(`/sweets/${id}/restock`, {
      method: "POST",
      body: JSON.stringify({ quantity }),
    });
  }

  async createMultipleSweets(sweets: Omit<Sweet, "id">[]): Promise<Sweet[]> {
    const results: Sweet[] = [];
    for (const sweet of sweets) {
      try {
        const result = await this.createSweet(sweet);
        results.push(result);
      } catch (error) {
        console.error(`Failed to create sweet ${sweet.name}:`, error);
      }
    }
    return results;
  }
}

export const apiClient = new ApiClient(window.location.origin + "/api");
