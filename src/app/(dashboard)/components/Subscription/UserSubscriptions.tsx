// src/app/(dashboard)/components/Subscription/UserSubscriptions.tsx
"use client";
import { useEffect, useState } from "react";
import type {
  GenericDataItem,
  ColumnConfig,
  FormFieldConfig,
  FilterConfig,
  ActionConfig,
  TableConfig,
} from "@/types/dynamicTableTypes";
import { DynamicTable } from "@/components/common/DynamicTable";
import Lordicon from "@/components/lordicon/lordicon-wrapper";
import { useSubscriptions } from "@/hooks/useApi";
import { getProfilePictureUrl } from "@/utils/imageUtils";

// Type definitions
interface UserProfile {
  id: number;
  user: number;
  name: string;
  profile_picture: string | null;
  phone_number: string | null;
  joined_date: string;
}

interface SubscriptionPlan {
  id: number;
  name: string;
  amount: string;
  description?: string;
  features?: string[];
}

interface ApiUser {
  id: number;
  email: string;
  role: "consultant" | "farm" | "farm_user";
  is_verified: boolean;
  user_profile: UserProfile;
}

interface SubscriptionData {
  id: number;
  user: ApiUser;
  plan: SubscriptionPlan;
  status: "active" | "inactive" | "blocked" | "pending" | "expired";
  start_date: string;
  end_date: string;
  created_at?: string;
  updated_at?: string;
}

interface SubscriptionsApiResponse {
  data: SubscriptionData[];
  status: number;
  success: boolean;
  message?: string;
}

interface UserManagementProps {
  itemsPerPage?: number;
  title?: string;
  buttonText?: string;
  pageUrl?: string;
}

interface TransformedUserData extends GenericDataItem {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: string;
  accountType: string;
  subscription: string;
  amount: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

export default function UserSubscriptions({
  itemsPerPage = 10,
  title = "Subscription user list",
  buttonText = "Show all",
  pageUrl = "/users-subscription",
}: UserManagementProps) {
  const {
    data: subscriptionsResponse,
    isLoading,
    refetch,
  } = useSubscriptions() as {
    data: SubscriptionsApiResponse | undefined;
    isLoading: boolean;
    refetch: () => void;
  };

  const [users, setUsers] = useState<TransformedUserData[]>([]);

  // Transform API data to match component expectations
  useEffect(() => {
    if (subscriptionsResponse?.success && subscriptionsResponse.data) {
      const transformedUsers: TransformedUserData[] =
        subscriptionsResponse.data.map((subscription: SubscriptionData) => ({
          id: subscription.id.toString(),
          name:
            subscription.user?.user_profile?.name ||
            `User ${subscription.user?.id || "Unknown"}`,
          email: subscription.user?.email || "No email provided",
          avatar: getProfilePictureUrl(
            subscription.user?.user_profile?.profile_picture
          ),
          status: subscription.status,
          accountType:
            subscription.plan?.name?.toLowerCase().replace(/\s+/g, "") ||
            "unknown",
          subscription: subscription.plan?.name || "Unknown Plan",
          amount: subscription.plan?.amount || "0.00",
          startDate: subscription.start_date,
          endDate: subscription.end_date,
          isActive: subscription.status === "active",
          createdAt: subscription.start_date,
        }));
      setUsers(transformedUsers);
    }
  }, [subscriptionsResponse]);

  // console.log("All subscriptionsResponse Users:", subscriptionsResponse);

  // Column Configuration for User Table
  const userColumns: ColumnConfig[] = [
    {
      key: "name",
      label: "User Name",
      sortable: true,
      searchable: true,
      showAvatar: true,
      align: "left",
      width: "200px",
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
        { value: "expired", label: "Expired", color: "#ef4444" },
      ],
    },
    {
      key: "accountType",
      label: "Subscription Plan",
      type: "select",
      sortable: true,
      filterable: true,
      width: "180px",
      align: "center",
      options: [
        { value: "freeplan", label: "Free Plan", color: "#9ca3af" },
        { value: "personalplan", label: "Personal Plan", color: "#10b981" },
        { value: "enterpriseplan", label: "Enterprise Plan", color: "#1e40af" },
        { value: "consultantplan", label: "Consultant Plan", color: "#f59e0b" },
      ],
    },
    {
      key: "amount",
      label: "Amount",
      type: "currency",
      sortable: true,
      width: "100px",
      align: "right",
    },
    {
      key: "startDate",
      label: "Start Date",
      type: "date",
      sortable: true,
      width: "120px",
      align: "center",
    },
    {
      key: "endDate",
      label: "End Date",
      type: "date",
      sortable: true,
      width: "120px",
      align: "center",
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
      required: true,
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
      placeholder: "+1-555-0123",
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
      key: "dateOfBirth",
      label: "Date of Birth",
      type: "date",
      section: "personal",
      gridCol: "half",
    },
    {
      key: "gender",
      label: "Gender",
      type: "select",
      section: "personal",
      gridCol: "half",
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
        { value: "prefer-not-to-say", label: "Prefer not to say" },
      ],
    },
    {
      key: "avatar",
      label: "Profile Picture",
      type: "file",
      section: "personal",
      gridCol: "half",
      placeholder: "Upload profile picture (max 5MB)",
    },
    // Address Information Section
    {
      key: "address",
      label: "Address",
      type: "textarea",
      section: "address",
      gridCol: "half",
      placeholder: "123 Main Street, Apt 4B",
    },
    {
      key: "country",
      label: "Country",
      type: "select",
      section: "address",
      gridCol: "half",
      options: [
        { value: "United States", label: "United States" },
        { value: "Canada", label: "Canada" },
        { value: "United Kingdom", label: "United Kingdom" },
        { value: "Australia", label: "Australia" },
        { value: "Germany", label: "Germany" },
        { value: "France", label: "France" },
        { value: "Bangladesh", label: "Bangladesh" },
        { value: "Other", label: "Other" },
      ],
    },
    // Account & Access Section
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
        { value: "expired", label: "Expired" },
      ],
    },
    {
      key: "accountType",
      label: "Subscription Plan",
      type: "select",
      required: true,
      section: "account",
      gridCol: "half",
      options: [
        { value: "freeplan", label: "Free Plan" },
        { value: "personalplan", label: "Personal Plan" },
        { value: "enterpriseplan", label: "Enterprise Plan" },
        { value: "consultantplan", label: "Consultant Plan" },
      ],
    },
  ];

  // Filter Configuration for User Table
  const userFilters: FilterConfig[] = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "blocked", label: "Blocked" },
        { value: "pending", label: "Pending" },
        { value: "expired", label: "Expired" },
      ],
    },
    {
      key: "accountType",
      label: "Subscription Plan",
      type: "select",
      options: [
        { value: "freeplan", label: "Free Plan" },
        { value: "personalplan", label: "Personal Plan" },
        { value: "enterpriseplan", label: "Enterprise Plan" },
        { value: "consultantplan", label: "Consultant Plan" },
      ],
    },
  ];

  // Action Configuration for User Table
  const userActions: ActionConfig[] = [
    {
      key: "view",
      label: "",
      icon: (
        <Lordicon
          src="https://cdn.lordicon.com/knitbwfa.json"
          trigger="hover"
          size={20}
          colors={{
            primary: "#9ca3af",
            secondary: "",
          }}
          stroke={4}
        />
      ),
      variant: "ghost",
      onClick: (item: GenericDataItem) => {
        console.log("View user:", item.name);
        // Add your view logic here
      },
    },
    // {
    //   key: "edit",
    //   label: "",
    //   icon: (
    //     <Lordicon
    //       src="https://cdn.lordicon.com/gwlusjdu.json"
    //       trigger="hover"
    //       size={20}
    //       colors={{
    //         primary: "#4f46e5",
    //         secondary: "",
    //       }}
    //       stroke={4}
    //     />
    //   ),
    //   variant: "ghost",
    //   onClick: (item: GenericDataItem) => {
    //     console.log("Edit user:", item.name);
    //     // Add your edit logic here
    //   },
    // },
  ];

  // Table Configuration for User Management
  const userTableConfig: TableConfig = {
    title: title,
    description: "Manage user subscriptions and their status",
    searchPlaceholder: "Search users by name, email, or subscription plan...",
    itemsPerPage: itemsPerPage,
    enableSearch: true,
    enableFilters: true,
    enablePagination: true,
    enableSelection: true,
    enableSorting: true,
    striped: true,
    emptyMessage: "No subscription users found",
    loadingMessage: "Loading subscription users...",
  };

  const handleDataChange = (newData: GenericDataItem[]) => {
    setUsers(newData as TransformedUserData[]);
    console.log("Users data changed:", newData);
  };

  const handleUsersSelect = (selectedIds: string[]) => {
    // console.log("Selected users:", selectedIds);
    users.filter((user) => selectedIds.includes(user.id));
    // console.log("Selected user objects:", selectedUsers);
    // Handle bulk operations like bulk status update, export, etc.
  };

  const handleExport = (exportData: GenericDataItem[]) => {
    // console.log("Exporting users:", exportData);

    // Convert data to CSV format
    const headers = userColumns.map((col) => col.label).join(",");
    const csvData = exportData
      .map((user) =>
        userColumns
          .map((col) => {
            const value = user[col.key];
            if (Array.isArray(value)) return `"${value.join("; ")}"`;
            if (typeof value === "string" && value.includes(","))
              return `"${value}"`;
            return value || "";
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
    a.download = `subscription-users-export-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    // console.log("Refreshing subscription data...");
    refetch();
  };

  return (
    <div className="mx-auto">
      <DynamicTable
        data={users}
        columns={userColumns}
        formFields={userFormFields}
        filters={userFilters}
        actions={userActions}
        tableConfig={userTableConfig}
        onDataChange={handleDataChange}
        isDataEditable={false}
        isDataDeletable={false}
        onItemsSelect={handleUsersSelect}
        onExport={handleExport}
        onRefresh={handleRefresh}
        buttonText={buttonText}
        pageUrl={pageUrl}
        isLoading={isLoading}
      />
    </div>
  );
}
