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
        console.error("Query error - advertisements:", error);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      console.error("Failed to fetch advertisements:", error);
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
        console.error("Query error - latest advertisements:", error);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      console.error("Failed to fetch latest advertisements:", error);
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
    onSuccess: () => {
      // console.log("Advertisement created successfully:", data);
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
      console.error("Failed to create advertisement:", error);
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
      console.log(
        "Updating advertisement mutation with id:",
        id,
        "data:",
        data
      );
      return AdvertisementsAPI.update(id, data);
    },
    // onMutate: ({ id }) => {
    //   console.log("Starting update advertisement mutation for id:", id);
    // },
    onSuccess: () => {
      // console.log("Advertisement updated successfully:", data);

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
      console.error(
        "Failed to update advertisement with id:",
        variables.id,
        "error:",
        error
      );
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
      // console.log("Deleting advertisement mutation with id:", id);
      return AdvertisementsAPI.delete(id);
    },
    // onMutate: (id) => {
    //   console.log("Starting delete advertisement mutation for id:", id);
    // },
    onSuccess: () => {
      // console.log("Advertisement deleted successfully, id:", id);

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
      console.error(
        "Failed to delete advertisement with id:",
        id,
        "error:",
        error
      );
      toast.error("Failed to delete advertisement", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    },
  });
}
