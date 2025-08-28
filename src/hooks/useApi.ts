// src/hooks/useApi.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthAPI } from "@/lib/api/auth";
import { MilkHistoryAPI } from "@/lib/api/milkHistory";
import { MembersAPI } from "@/lib/api/members";
import { ConsultantsAPI } from "@/lib/api/consultants";
import { NotificationsAPI, SupportAPI } from "@/lib/api/notifications";
import { SubscriptionsAPI } from "@/lib/api/subscriptions";
import { useAuth as useAuthContext } from "@/contexts/AuthContext";
import type {
  MilkHistoryRequest,
  MemberCreateRequest,
  ConsultantRequest,
  RequestManageRequest,
  ProfileUpdateRequest,
  PasswordChangeRequest,
  OTPRequest,
  OTPVerifyRequest,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
} from "@/types/api";
import { toast } from "sonner";

// Types for error handling
interface APIErrorResponse {
  error?: string;
  details?: {
    email?: string | string[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface APIError extends Error {
  response?: {
    data?: APIErrorResponse;
    status?: number;
    [key: string]: unknown;
  };
}

// Query Keys
export const QUERY_KEYS = {
  AUTH: {
    PROFILE: ["auth", "profile"],
    ALL_USERS: ["auth", "users"],
  },
  MILK_HISTORY: {
    ALL: ["milk-history"],
    BY_USER: (userId: number) => ["milk-history", "user", userId],
  },
  MEMBERS: {
    PROFILE: ["members", "profile"],
    BY_FARM: (farmId: number) => ["members", "farm", farmId],
  },
  CONSULTANTS: {
    FARMS: ["consultants", "farms"],
    SEARCH: (query: string) => ["consultants", "search", query],
  },
  NOTIFICATIONS: {
    ALL: ["notifications"],
  },
  SUBSCRIPTIONS: {
    ALL: ["subscriptions"],
  },
  SUPPORT: {
    ALL: ["support"],
  },
} as const;

// Auth Hooks
export function useProfile() {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH.PROFILE,
    queryFn: () => AuthAPI.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAllUsers() {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH.ALL_USERS,
    queryFn: () => AuthAPI.getAllUsers(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProfileUpdateRequest) => AuthAPI.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.PROFILE });
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update profile", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: PasswordChangeRequest) => AuthAPI.changePassword(data),
    onSuccess: () => {
      toast.success("Password changed successfully!");
    },
    onError: (error) => {
      toast.error("Failed to change password", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });
}

// OTP Hooks
export function useCreateOTP() {
  return useMutation({
    mutationFn: (data: OTPRequest) => AuthAPI.createOTP(data),
    onSuccess: () => {
      toast.success("OTP sent successfully!");
    },
    onError: (error) => {
      toast.error("Failed to send OTP", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });
}

export function useVerifyOTP() {
  return useMutation({
    mutationFn: (data: OTPVerifyRequest) => AuthAPI.verifyOTP(data),
    onSuccess: () => {
      toast.success("OTP verified successfully!");
    },
    onError: (error) => {
      toast.error("Invalid OTP", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });
}

// Password Reset Hooks
export function usePasswordResetRequest() {
  return useMutation({
    mutationFn: async (data: PasswordResetRequest) => {
      const response = await AuthAPI.requestPasswordReset(data);

      // Additional check in case the API client doesn't throw on errors
      if (response.status >= 400 || !response.success) {
        const errorMsg =
          response.data &&
          typeof response.data === "object" &&
          response.data !== null &&
          "error" in response.data
            ? (response.data as { error?: string }).error
            : "Request failed";
        const error = new Error(errorMsg) as Error & { response?: unknown };
        error.response = response;
        throw error;
      }

      return response;
    },
    onSuccess: () => {
      toast.success("Password reset email sent!");
    },
    onError: (error: APIError) => {
      const errorMessage = "Failed to send reset email";
      let errorDescription = "Unknown error";

      // console.log("Password reset error details:", error);

      // Handle API response errors
      if (error?.response?.data) {
        const errorData = error.response.data;

        if (errorData.error) {
          errorDescription = errorData.error;
        } else if (errorData.details?.email) {
          errorDescription = Array.isArray(errorData.details.email)
            ? errorData.details.email[0]
            : errorData.details.email;
        }
      }
      // Handle network or other errors
      else if (error instanceof Error) {
        errorDescription = error.message;
      }

      toast.error(errorMessage, {
        description: errorDescription,
      });
    },
  });
}

export function usePasswordResetConfirm() {
  return useMutation({
    mutationFn: (data: PasswordResetConfirmRequest) =>
      AuthAPI.confirmPasswordReset(data),
    onSuccess: () => {
      toast.success("Password reset successful!");
    },
    onError: (error) => {
      toast.error("Failed to reset password", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });
}

// Milk History Hooks
export function useMilkHistory() {
  return useQuery({
    queryKey: QUERY_KEYS.MILK_HISTORY.ALL,
    queryFn: () => MilkHistoryAPI.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMilkHistoryByUser(userId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.MILK_HISTORY.BY_USER(userId),
    queryFn: () => MilkHistoryAPI.getByUser(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateMilkHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MilkHistoryRequest) => MilkHistoryAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MILK_HISTORY.ALL });
      toast.success("Milk history record created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create milk history", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });
}

// Members Hooks
export function useMembersByFarm(farmId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.MEMBERS.BY_FARM(farmId),
    queryFn: () => MembersAPI.getByFarm(farmId),
    enabled: !!farmId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMemberProfile() {
  return useQuery({
    queryKey: QUERY_KEYS.MEMBERS.PROFILE,
    queryFn: () => MembersAPI.getProfile(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MemberCreateRequest) => MembersAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Member created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create member", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });
}

// Consultants Hooks
export function useSearchFarm(name: string) {
  return useQuery({
    queryKey: QUERY_KEYS.CONSULTANTS.SEARCH(name),
    queryFn: () => ConsultantsAPI.searchFarm(name),
    enabled: !!name && name.length > 2,
    staleTime: 2 * 60 * 1000,
  });
}

export function useAcceptedFarms() {
  return useQuery({
    queryKey: QUERY_KEYS.CONSULTANTS.FARMS,
    queryFn: () => ConsultantsAPI.getAllAcceptedFarms(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRequestOnFarm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConsultantRequest) => ConsultantsAPI.requestOnFarm(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONSULTANTS.FARMS });
      toast.success("Request sent successfully!");
    },
    onError: (error) => {
      toast.error("Failed to send request", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });
}

export function useManageRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      data,
    }: {
      requestId: number;
      data: RequestManageRequest;
    }) => ConsultantsAPI.manageRequest(requestId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONSULTANTS.FARMS });
      toast.success("Request managed successfully!");
    },
    onError: (error) => {
      toast.error("Failed to manage request", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });
}

// Notifications Hooks
export function useNotifications() {
  return useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS.ALL,
    queryFn: () => NotificationsAPI.getAll(),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

// Support Hooks
export function useSupport() {
  return useQuery({
    queryKey: QUERY_KEYS.SUPPORT.ALL,
    queryFn: () => SupportAPI.getAll(),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) =>
      NotificationsAPI.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.ALL });
    },
    onError: (error) => {
      toast.error("Failed to mark notification as read", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });
}

// Subscriptions Hooks
export function useSubscriptions() {
  return useQuery({
    queryKey: QUERY_KEYS.SUBSCRIPTIONS.ALL,
    queryFn: () => SubscriptionsAPI.getAllSubscriptions(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useAuth() {
  return useAuthContext();
}
