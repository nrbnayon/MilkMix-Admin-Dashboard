// src/lib/auth/authGuard.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoadingPing from "@/components/common/LoadingPing";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  allowedRoles?: string[];
}

export function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = "/login",
  allowedRoles = [],
}: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
      router.push("/unauthorized");
      return;
    }

    if (!requireAuth && isAuthenticated) {
      router.push("/overview");
      return;
    }
  }, [
    isLoading,
    isAuthenticated,
    user,
    requireAuth,
    allowedRoles,
    router,
    redirectTo,
  ]);

  if (isLoading) {
    return <LoadingPing />;
  }

  if (requireAuth && !isAuthenticated) {
    return <LoadingPing />;
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <LoadingPing />;
  }

  return <>{children}</>;
}
