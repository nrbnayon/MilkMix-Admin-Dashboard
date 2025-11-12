// src\app\(dashboard)\components\Overview\UserManagement.tsx
"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type {
  GenericDataItem,
  ColumnConfig,
  FormFieldConfig,
  FilterConfig,
  ActionConfig,
  TableConfig,
} from "@/types/dynamicTableTypes";
import type { MetricData } from "@/types/statsCardDataTypes";
import { DynamicTable } from "@/components/common/DynamicTable";
import StatsCard from "@/components/common/StatsCard";
import { Eye } from "lucide-react";
import { useAllUsers } from "@/hooks/useApi";
import { API_CONFIG } from "@/lib/api/config";
import { toast } from "sonner";
import { getProfilePictureUrl } from "@/utils/imageUtils";

// Define proper TypeScript interfaces for the API response
interface UserProfile {
  id: number;
  user: number;
  name: string;
  profile_picture: string | null;
  phone_number: string | null;
  joined_date: string;
}

interface ApiUser {
  id: number;
  email: string;
  role: "consultant" | "farm" | "farm_user";
  is_verified: boolean;
  user_profile: UserProfile;
}

interface ApiResponse {
  data: ApiUser[];
  status: number;
  success: boolean;
}

interface UserManagementProps {
  itemsPerPage?: number;
  title?: string;
  buttonText?: string;
  pageUrl?: string;
}

export default function UserManagement({
  itemsPerPage = 10,
  title = "Recently Joined Users",
  buttonText = "Show all",
  pageUrl = "/manage-users",
}: UserManagementProps) {
  const pathname = usePathname();

  const {
    data: usersResponse,
    isLoading,
    refetch,
  } = useAllUsers() as {
    data: ApiResponse | undefined;
    isLoading: boolean;
    refetch: () => void;
  };
  const [users, setUsers] = useState<GenericDataItem[]>([]);

  // Transform API data to match component expectations
  useEffect(() => {
    if (
      usersResponse?.success &&
      usersResponse.data &&
      Array.isArray(usersResponse.data)
    ) {
      const transformedUsers: GenericDataItem[] =
        // usersResponse.data.length > 0 &&
        usersResponse.data.map((user: ApiUser) => {
          // Extract profile data with proper typing
          const profile: UserProfile = user.user_profile;

          // Safe name splitting
          const fullName = profile?.name || user?.email.split("@")[0];
          const nameParts = fullName?.trim().split(" ");
          const firstName = nameParts[0] || "";
          const lastName =
            nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

          return {
            id: user.id.toString(),
            name: fullName,
            email: user.email,
            avatar: getProfilePictureUrl(profile?.profile_picture || ""),
            status: user.is_verified ? "active" : "inactive",
            accountType: user.role,
            firstName: firstName,
            lastName: lastName,
            phone: profile?.phone_number || "",
            username: user.email.split("@")[0],
            role: user.role,
            department:
              user.role === "consultant"
                ? "Consultant"
                : user.role === "farm"
                ? "Farm"
                : user.role === "farm_user"
                ? "Farm User"
                : "General",
            joinDate: profile?.joined_date,
            isActive: user.is_verified,
            permissions: ["read"],
            accessLevel: user.role === "consultant" ? "advanced" : "basic",
            isEmailVerified: user.is_verified,
            isTwoFactorEnabled: false,
            createdAt: profile?.joined_date,
            // Additional fields for better display
            verificationStatus: user.is_verified ? "verified" : "pending",
            profileId: profile?.id,
            userId: user.id,
            profilePicture: profile?.profile_picture,
            phoneNumber: profile?.phone_number,
            joinedDate: profile?.joined_date,
          };
        });

      setUsers(transformedUsers);
    }
  }, [usersResponse]);

  // Delete user function
  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem("auth-token");

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/auth/user/${userId}/delete/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.statusText}`);
      }

      // Check if response has content before parsing JSON
      const contentLength = response.headers.get("content-length");
      const contentType = response.headers.get("content-type");

      let result = null;

      // Only try to parse JSON if there's content and it's JSON
      if (
        contentLength &&
        contentLength !== "0" &&
        contentType &&
        contentType.includes("application/json")
      ) {
        try {
          const text = await response.text();
          if (text.trim()) {
            result = JSON.parse(text);
          }
        } catch (error) {
          console.log(
            "Response is not JSON, treating as successful deletion",
            error
          );
        }
      }

      // Consider it successful if:
      // 1. Status is success-related (200, 204, 202)
      // 2. OR result indicates success
      return (
        response.status === 200 ||
        response.status === 204 ||
        response.status === 202 ||
        result?.success === true
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error; // Re-throw to handle in calling function
    }
  };

  // Column Configuration for User Table
  const userColumns: ColumnConfig[] = [
    {
      key: "name",
      label: "User Name",
      sortable: true,
      searchable: true,
      showAvatar: true,
      width: "280px",
    },
    {
      key: "email",
      label: "Email Address",
      type: "email",
      sortable: true,
      searchable: true,
      width: "250px",
    },
    {
      key: "role",
      label: "Role",
      type: "select",
      sortable: true,
      filterable: true,
      width: "140px",
      align: "center",
      options: [
        { value: "consultant", label: "Consultant", color: "#f59e0b" },
        { value: "farm", label: "Farm", color: "#10b981" },
        { value: "farm_user", label: "Farm User", color: "#6366f1" },
      ],
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      sortable: true,
      filterable: true,
      width: "120px",
      align: "center",
      options: [
        { value: "active", label: "Active", color: "#16a34a" },
        { value: "inactive", label: "Inactive", color: "#ca8a04" },
        { value: "blocked", label: "Blocked", color: "#dc2626" },
        { value: "pending", label: "Pending", color: "#6b7280" },
      ],
    },
    {
      key: "verificationStatus",
      label: "Verification",
      type: "select",
      sortable: true,
      filterable: true,
      width: "130px",
      align: "center",
      options: [
        { value: "verified", label: "Verified", color: "#16a34a" },
        { value: "pending", label: "Pending", color: "#ca8a04" },
      ],
    },
    {
      key: "phone",
      label: "Phone",
      sortable: true,
      searchable: true,
      width: "150px",
    },
    {
      key: "joinDate",
      label: "Join Date",
      type: "date",
      sortable: true,
      width: "150px",
    },
  ];

  // Form Field Configuration for User Edit Modal
  const userFormFields: FormFieldConfig[] = [
    // Personal Information Section
    {
      key: "firstName",
      label: "First Name",
      type: "text",
      required: true,
      section: "personal",
      gridCol: "half",
      validation: {
        minLength: 2,
        maxLength: 50,
      },
    },
    {
      key: "lastName",
      label: "Last Name",
      type: "text",
      required: false,
      section: "personal",
      gridCol: "half",
      validation: {
        minLength: 2,
        maxLength: 50,
      },
    },
    {
      key: "email",
      label: "Email Address",
      type: "email",
      required: true,
      section: "personal",
      gridCol: "half",
      validation: {
        pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
      },
    },
    {
      key: "phone",
      label: "Phone Number",
      type: "tel",
      section: "personal",
      gridCol: "half",
      placeholder: "+880-1XXX-XXXXXX",
    },
    {
      key: "username",
      label: "Username",
      type: "text",
      required: true,
      section: "personal",
      gridCol: "half",
      validation: {
        minLength: 3,
        maxLength: 20,
        pattern: "^[a-zA-Z0-9_]+$",
      },
    },
    {
      key: "avatar",
      label: "Profile Picture",
      type: "file",
      section: "personal",
      gridCol: "half",
      placeholder: "Upload profile picture (max 5MB)",
    },

    // Account & Access Section
    {
      key: "role",
      label: "Role",
      type: "select",
      required: true,
      section: "account",
      gridCol: "half",
      options: [
        { value: "consultant", label: "Consultant", color: "#f59e0b" },
        { value: "farm", label: "Farm", color: "#10b981" },
        { value: "farm_user", label: "Farm User", color: "#6366f1" },
      ],
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      required: true,
      section: "account",
      gridCol: "half",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "blocked", label: "Blocked" },
        { value: "pending", label: "Pending" },
      ],
    },
    {
      key: "verificationStatus",
      label: "Email Verification",
      type: "select",
      required: true,
      section: "account",
      gridCol: "half",
      options: [
        { value: "verified", label: "Verified" },
        { value: "pending", label: "Pending" },
      ],
    },
    {
      key: "accountType",
      label: "Account Type",
      type: "select",
      required: true,
      section: "account",
      gridCol: "half",
      options: [
        { value: "consultant", label: "Consultant Plan", color: "#f59e0b" },
        { value: "farm", label: "Farm Plan", color: "#10b981" },
        { value: "farm_user", label: "Farm User Plan", color: "#6366f1" },
      ],
    },
  ];

  // Filter Configuration for User Table
  const userFilters: FilterConfig[] = [
    {
      key: "role",
      label: "Role",
      type: "select",
      options: [
        { value: "consultant", label: "Consultant", color: "#f59e0b" },
        { value: "farm", label: "Farm", color: "#10b981" },
        { value: "farm_user", label: "Farm User", color: "#6366f1" },
      ],
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "blocked", label: "Blocked" },
        { value: "pending", label: "Pending" },
      ],
    },
    {
      key: "verificationStatus",
      label: "Verification Status",
      type: "select",
      options: [
        { value: "verified", label: "Verified" },
        { value: "pending", label: "Pending" },
      ],
    },
  ];

  // Action Configuration for User Table
  const userActions: ActionConfig[] = [
    {
      key: "view",
      label: "View",
      icon: <Eye className="w-4 h-4" />,
      variant: "ghost",
      // onClick: (item) => {
      //   console.log("View user:", item.id);
      // },
    },
  ];

  // Table Configuration for User Management
  const userTableConfig: TableConfig = {
    title: title,
    description: `Manage and monitor all users in the system. Total users: ${users.length}`,
    searchPlaceholder: "Search users by name, email, or role...",
    itemsPerPage: itemsPerPage,
    enableSearch: true,
    enableFilters: true,
    enablePagination: true,
    enableSelection: true,
    enableSorting: true,
    striped: true,
    emptyMessage: "No users found matching your criteria",
    loadingMessage: "Loading users...",
  };

  const handleDataChange = (newData: GenericDataItem[]) => {
    setUsers(newData);
    // console.log("Users data changed:", newData.length, "users");
  };

  const handleUserDelete = async (userId: string) => {
    try {
      const success = await deleteUser(userId);

      if (success) {
        const updatedData = users.filter((user) => user.id !== userId);
        setUsers(updatedData);
        // console.log("User deleted successfully:", userId);
        if (refetch) {
          refetch();
        }
        toast.success("User deleted successfully");
      } else {
        throw new Error("Failed to delete user from server");
      }
    } catch (error) {
      console.error("Error in handleUserDelete:", error);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  const handleExport = (exportData: GenericDataItem[]) => {
    // Convert data to CSV format
    const headers = userColumns.map((col) => col.label).join(",");
    const csvData = exportData
      .map((user) =>
        userColumns
          .map((col) => {
            const value = user[col.key];
            if (value === null || value === undefined) return "";
            if (Array.isArray(value)) return `"${value.join("; ")}"`;
            if (typeof value === "string" && value.includes(","))
              return `"${value}"`;
            return String(value);
          })
          .join(",")
      )
      .join("\n");

    const csv = `${headers}\n${csvData}`;

    // Create and download file
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-export-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    // console.log("Refreshing users data...");
    refetch();
  };

  // Calculate stats for display with proper error handling
  const stats = {
    total: users.length,
    active: users.filter((user) => user.status === "active").length,
    inactive: users.filter((user) => user.status === "inactive").length,
    consultants: users.filter((user) => user.role === "consultant").length,
    farms: users.filter((user) => user.role === "farm").length,
    farmUsers: users.filter((user) => user.role === "farm_user").length,
    verified: users.filter((user) => user.verificationStatus === "verified")
      .length,
    pending: users.filter((user) => user.verificationStatus === "pending")
      .length,
  };

  // Generate metrics for StatsCard component
  const userMetrics: MetricData[] = [
    {
      title: "Total Users",
      value: stats.total.toString(),
      trend: stats.total > 0 ? "up" : "down",
      trendValue: "12.5",
      trendColor: "text-green-500",
      sparklinePoints: [20, 25, 30, 28, 35, 40, 45, stats.total],
    },
    {
      title: "Active Users",
      value: stats.active.toString(),
      trend: "up",
      trendValue: "8.3",
      trendColor: "text-green-500",
      sparklinePoints: [10, 15, 18, 20, 25, 28, 30, stats.active],
    },
    {
      title: "Consultants",
      value: stats.consultants.toString(),
      trend: "up",
      trendValue: "15.7",
      trendColor: "text-green-500",
      sparklinePoints: [5, 8, 10, 12, 15, 18, 20, stats.consultants],
    },
    {
      title: "Farms",
      value: stats.farms.toString(),
      trend: "up",
      trendValue: "22.1",
      trendColor: "text-green-500",
      sparklinePoints: [8, 12, 15, 18, 22, 25, 28, stats.farms],
    },
    {
      title: "Farm Users",
      value: stats.farmUsers.toString(),
      trend: "up",
      trendValue: "18.9",
      trendColor: "text-green-500",
      sparklinePoints: [10, 15, 20, 25, 30, 35, 40, stats.farmUsers],
    },
    {
      title: "Pending Users",
      value: stats.pending.toString(),
      trend: stats.pending > stats.verified / 3 ? "up" : "down",
      trendValue: "3.1",
      trendColor:
        stats.pending > stats.verified / 3 ? "text-red-500" : "text-green-500",
      sparklinePoints: [8, 6, 5, 4, 3, 2, 3, stats.pending],
    },
  ];

  // Handle loading state
  if (isLoading) {
    return (
      <div className="mx-auto">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 p-6 rounded-lg h-32"
              ></div>
            ))}
          </div>
          <div className="bg-gray-200 h-96 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (!usersResponse?.success) {
    return (
      <div className="mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Failed to Load Users
          </h3>
          <p className="text-red-600 mb-4">
            There was an error loading the user data. Please try again.
          </p>
          <button
            onClick={handleRefresh}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      {/* Stats Display using StatsCard component */}
      {pathname !== "/manage-users" && (
        <div className="mb-6">
          <StatsCard metrics={userMetrics} />
        </div>
      )}

      {/* Dynamic Table */}
      <DynamicTable
        data={users}
        columns={userColumns}
        formFields={userFormFields}
        filters={userFilters}
        actions={userActions}
        tableConfig={userTableConfig}
        onDataChange={handleDataChange}
        onItemDelete={handleUserDelete}
        isDataEditable={false}
        onExport={handleExport}
        onRefresh={handleRefresh}
        buttonText={buttonText}
        pageUrl={pageUrl}
        isLoading={isLoading}
      />
    </div>
  );
}
