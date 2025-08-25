// src/app/unauthorized/page.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="w-12 h-12 text-red-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">!</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>
        
        <p className="text-gray-600 mb-2">
          You don't have permission to access this page.
        </p>
        
        {user && (
          <p className="text-sm text-gray-500 mb-8">
            Current role: <span className="font-medium capitalize">{user.role}</span>
          </p>
        )}

        {/* Actions */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            
            <Link href="/overview">
              <Button className="flex items-center gap-2 w-full sm:w-auto">
                <Home className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500 mb-3">
              Need access? Contact your administrator or
            </p>
            <Button
              onClick={logout}
              variant="ghost"
              className="text-red-600 hover:text-red-700"
            >
              Sign out and try different account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}