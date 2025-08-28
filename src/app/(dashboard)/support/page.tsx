"use client";
import { useSupport } from "@/hooks/useApi";
import { useEffect, useState } from "react";

// Define the support item type
interface SupportItem {
  id: number;
  problem: string;
  description: string;
  email: string;
  status?: string;
  created_at: string;
}

// Status badge component
const StatusBadge = ({ status }: { status?: string }) => {
  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
        status
      )}`}
    >
      {status || "Open"}
    </span>
  );
};

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    ))}
  </div>
);

// Empty state component
const EmptyState = () => (
  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <svg
        className="w-12 h-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      No support tickets found
    </h3>
    <p className="text-gray-500">
      When you submit support requests, they&lsquo;ll appear here.
    </p>
  </div>
);

export default function SupportPage() {
  const { data: supportResponse, isLoading: supportLoading } = useSupport();
  const [isClient, setIsClient] = useState(false);
  const [support, setSupport] = useState<SupportItem[]>([]);

  useEffect(() => {
    setIsClient(true);
    if (supportResponse?.success && supportResponse.data) {
      const supportItems = supportResponse.data.map((item: unknown) => {
        const supportItem = item as SupportItem;
        return {
          id: supportItem.id,
          problem: supportItem.problem ?? "",
          description: supportItem.description ?? "",
          email: supportItem.email ?? "",
          status: supportItem.status,
          created_at: supportItem.created_at,
        };
      });

      // Sort by ID in ascending order (1, 2, 3, ...)
      const sortedSupport = supportItems.sort((a, b) => a.id - b.id);
      setSupport(sortedSupport);
    }
  }, [supportResponse]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Support Center
          </h1>
          <p className="text-gray-600">
            Track and manage your support requests
          </p>
        </div>

        {/* Content */}
        {supportLoading ? (
          <LoadingSkeleton />
        ) : support.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {support.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        #{item.id}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.problem}
                      </h3>
                      <p className="text-sm text-gray-500">{item.email}</p>
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Created{" "}
                    {new Date(item.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
