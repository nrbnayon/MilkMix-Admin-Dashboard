// src/hooks/useAdvertisements.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdvertisementsAPI } from "@/lib/api/advertisements";
import type {
  CreateAdvertisementRequest,
  UpdateAdvertisementRequest,
} from "@/lib/api/advertisements";
import { toast } from "sonner";

// Query Keys
export const ADVERTISEMENTS_QUERY_KEYS = {
  ALL: ["advertisements"],
  LATEST: ["advertisements", "latest"],
} as const;

// Get all advertisements
export function useAdvertisements() {
  return useQuery({
    queryKey: ADVERTISEMENTS_QUERY_KEYS.ALL,
    queryFn: async () => {
      try {
        const data = await AdvertisementsAPI.getAll();
        return data;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      return failureCount < 3;
    },
  });
}

// Get latest advertisements
export function useLatestAdvertisements() {
  return useQuery({
    queryKey: ADVERTISEMENTS_QUERY_KEYS.LATEST,
    queryFn: async () => {
      try {
        const data = await AdvertisementsAPI.getLatest();
        return data;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      return failureCount < 3;
    },
  });
}

// Create advertisement
export function useCreateAdvertisement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdvertisementRequest) => {
      return AdvertisementsAPI.create(data);
    },
    onMutate: () => {},
    onSuccess: (data) => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({
        queryKey: ADVERTISEMENTS_QUERY_KEYS.ALL,
      });
      queryClient.invalidateQueries({
        queryKey: ADVERTISEMENTS_QUERY_KEYS.LATEST,
      });

      toast.success("Advertisement created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create advertisement", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    },
  });
}

// Update advertisement
export function useUpdateAdvertisement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateAdvertisementRequest;
    }) => {
      return AdvertisementsAPI.update(id, data);
    },
    onMutate: ({ id }) => {},
    onSuccess: (data) => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({
        queryKey: ADVERTISEMENTS_QUERY_KEYS.ALL,
      });
      queryClient.invalidateQueries({
        queryKey: ADVERTISEMENTS_QUERY_KEYS.LATEST,
      });

      toast.success("Advertisement updated successfully!");
    },
    onError: (error, variables) => {
      toast.error("Failed to update advertisement", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    },
  });
}

// Delete advertisement
export function useDeleteAdvertisement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => {
      return AdvertisementsAPI.delete(id);
    },
    onMutate: (id) => {},
    onSuccess: (data, id) => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({
        queryKey: ADVERTISEMENTS_QUERY_KEYS.ALL,
      });
      queryClient.invalidateQueries({
        queryKey: ADVERTISEMENTS_QUERY_KEYS.LATEST,
      });

      toast.success("Advertisement deleted successfully!");
    },
    onError: (error, id) => {
      toast.error("Failed to delete advertisement", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    },
  });
}
