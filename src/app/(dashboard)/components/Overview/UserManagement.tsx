// src\app\(dashboard)\components\Overview\UserManagement.tsx
"use client";
import { usersData } from "@/data/usersDataSets";
import { useState } from "react";
import type {
  GenericDataItem,
  ColumnConfig,
  FormFieldConfig,
  FilterConfig,
  ActionConfig,
  TableConfig,
  EditModalConfig,
} from "@/types/dynamicTableTypes";
import { DynamicTable } from "@/components/common/DynamicTable";
import { Eye, Edit } from "lucide-react";

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
  const [users, setUsers] = useState<GenericDataItem[]>(
    usersData as GenericDataItem[]
  );
  const [isLoading, setIsLoading] = useState(false);

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
        { value: "free", label: "Free" },
        { value: "premium", label: "Premium" },
        { value: "enterprise", label: "Enterprise" },
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
      ],
    },
    {
      key: "accountType",
      label: "Account Type",
      type: "select",
      options: [
        { value: "free", label: "Free" },
        { value: "premium", label: "Premium" },
        { value: "enterprise", label: "Enterprise" },
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
      onClick: (item) => console.log("View user:", item.name),
    },
    {
      key: "edit",
      label: "Edit",
      icon: <Edit className="w-4 h-4" />,
      variant: "ghost",
      onClick: (item) => console.log("Edit user:", item.name),
    },
  ];

  // Table Configuration for User Management
  const userTableConfig: TableConfig = {
    title: title,
    description: "",
    searchPlaceholder: "Search users by name, email, or department...",
    itemsPerPage: itemsPerPage,
    enableSearch: true,
    enableFilters: true,
    enablePagination: true,
    enableSelection: true,
    enableSorting: true,
    striped: true,
    emptyMessage: "No users found",
    loadingMessage: "Loading users...",
  };

  // Edit Modal Configuration for User Form
  const userEditModalConfig: EditModalConfig = {
    title: "Edit User",
    description: "Update user information and settings",
    width: "xl",
    sections: [
      {
        key: "personal",
        title: "Personal Information",
        description: "Basic personal details and contact information",
      },
      {
        key: "address",
        title: "Address Information",
        description: "Location and address details",
      },
      {
        key: "professional",
        title: "Professional Information",
        description: "Job-related details and organizational information",
      },
      {
        key: "account",
        title: "Account & Access",
        description: "Account status, permissions, and security settings",
      },
    ],
  };

  const handleDataChange = (newData: GenericDataItem[]) => {
    setUsers(newData);
    console.log("Users data changed:", newData);
  };

  const handleUserEdit = (user: GenericDataItem) => {
    console.log("User edited:", user);
    // Here you would typically make an API call to update the user
  };

  const handleUserDelete = (userId: string) => {
    console.log("User deleted:", userId);
    // Here you would typically make an API call to delete the user
  };

  const handleUsersSelect = (selectedIds: string[]) => {
    console.log("Selected users:", selectedIds);
    // Handle bulk operations
  };

  const handleExport = (exportData: GenericDataItem[]) => {
    console.log("Exporting users:", exportData);
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
    const blob = new Blob([csv], { type: "text/csv" });
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
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUsers([...usersData] as GenericDataItem[]);
      setIsLoading(false);
      console.log("Users data refreshed");
    }, 1000);
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
        editModalConfig={userEditModalConfig}
        onDataChange={handleDataChange}
        onItemEdit={handleUserEdit}
        onItemDelete={handleUserDelete}
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
