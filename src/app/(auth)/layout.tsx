// src/app/(auth)/layout.tsx
import React from "react";
import { AuthGuard } from "@/lib/auth/authGuard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAuth={false}>
      {children}
    </AuthGuard>
  );
}
