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
      const errorText = (await response.json()).error.catch(
        () => "Unknown error!",
      );

      throw new Error(errorText);
    }
    return response.json();
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
}

export const apiClient = new ApiClient("http://localhost:5173/api");
