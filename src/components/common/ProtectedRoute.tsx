// src/components/common/ProtectedRoute.tsx
'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingPing from './LoadingPing';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles = [],
  fallbackPath = '/login',
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push(fallbackPath);
      return;
    }

    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
      router.push('/unauthorized');
      return;
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router, fallbackPath]);

  if (isLoading) {
    return <LoadingPing />;
  }

  if (!isAuthenticated) {
    return <LoadingPing />;
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <LoadingPing />;
  }

  return <>{children}</>;
}