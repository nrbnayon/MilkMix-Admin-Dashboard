// src/app/(dashboard)/layout.tsx
import React from "react";
import DashboardWrapper from "./components/dashboard-wrapper";
import { AuthGuard } from "@/lib/auth/authGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAuth={true}>
      <DashboardWrapper>{children}</DashboardWrapper>
    </AuthGuard>
  );
}
