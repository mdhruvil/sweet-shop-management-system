import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import type { SearchCriteria, Sweet } from "@/schema/sweet";

const SWEET_QUERY_KEY = "sweets";

export function useSweets() {
  return useQuery({
    queryKey: [SWEET_QUERY_KEY],
    queryFn: async () => {
      try {
        const result = await apiClient.getSweets();
        return Array.isArray(result) ? result : [];
      } catch (error) {
        console.error("Failed to fetch sweets:", error);
        throw error;
      }
    },
  });
}

export function useSweet(id: number) {
  return useQuery({
    queryKey: [SWEET_QUERY_KEY, id],
    queryFn: () => apiClient.getSweet(id),
    enabled: !!id,
  });
}

export function useCreateSweet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sweet: Omit<Sweet, "id">) => apiClient.createSweet(sweet),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SWEET_QUERY_KEY] });
    },
  });
}

export function useSearchSweets() {
  return useMutation({
    mutationFn: (criteria: SearchCriteria) => apiClient.searchSweets(criteria),
  });
}

export function usePurchaseSweet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      apiClient.purchaseSweet(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SWEET_QUERY_KEY] });
    },
  });
}

export function useRestockSweet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      apiClient.restockSweet(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SWEET_QUERY_KEY] });
    },
  });
}

export function useCreateMultipleSweets() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sweets: Omit<Sweet, "id">[]) =>
      apiClient.createMultipleSweets(sweets),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SWEET_QUERY_KEY] });
    },
  });
}