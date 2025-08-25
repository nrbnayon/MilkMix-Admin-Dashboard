import React, { useState, useCallback, useMemo } from "react";
import {
  FileText,
  Plus,
  Eye,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DynamicDataCreateModal } from "@/components/common/DynamicDataCreateModal";
import { SearchFilterBar } from "@/components/common/SearchFilterBar";
import { ViewModal } from "@/components/common/ViewModal";
import {
  FormField,
  SearchFilterConfig,
  SearchFilterState,
} from "@/types/dynamicCardTypes";
import { ColumnConfig, GenericDataItem } from "@/types/dynamicTableTypes";

// Types
interface TermsItem extends GenericDataItem {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  status: "active" | "deactive";
  order: number;
}

// Mock data
const mockTermsData: TermsItem[] = [
  {
    id: "1",
    title: "Terms of Service",
    description: "General terms and conditions for using our platform",
    content: "# Terms of Service\n\nBy accessing and using this service...",
    category: "legal",
    status: "active",
    order: 1,
  },
  {
    id: "2",
    title: "Privacy Policy",
    description: "How we collect, use, and protect your personal information",
    content:
      "# Privacy Policy\n\nWe are committed to protecting your privacy...",
    category: "privacy",
    status: "active",
    order: 2,
  },
  {
    id: "3",
    title: "Cookie Policy",
    description:
      "Information about our use of cookies and tracking technologies",
    content: "# Cookie Policy\n\nThis policy explains how we use cookies...",
    category: "privacy",
    status: "active",
    order: 3,
  },
  {
    id: "4",
    title: "Data Processing Agreement",
    description: "Terms for data processing and GDPR compliance",
    content: "# Data Processing Agreement\n\nThis agreement outlines...",
    category: "compliance",
    status: "active",
    order: 4,
  },
  {
    id: "5",
    title: "Refund Policy",
    description: "Terms and conditions for refunds and cancellations",
    content: "# Refund Policy\n\nOur refund policy is designed to be fair...",
    category: "commercial",
    status: "deactive",
    order: 5,
  },
];

// Form fields configuration
const formFields: FormField[] = [
  {
    key: "title",
    label: "Title",
    type: "text",
    required: true,
    placeholder: "Enter terms title",
    gridCol: "full",
    validation: {
      minLength: 3,
      maxLength: 100,
    },
  },
  {
    key: "description",
    label: "Description",
    type: "text",
    required: true,
    placeholder: "Brief description of the terms",
    gridCol: "full",
    validation: {
      minLength: 10,
      maxLength: 200,
    },
  },
  {
    key: "category",
    label: "Category",
    type: "select",
    required: true,
    gridCol: "half",
    options: [
      { label: "Legal", value: "legal" },
      { label: "Privacy", value: "privacy" },
      { label: "Compliance", value: "compliance" },
      { label: "Commercial", value: "commercial" },
      { label: "Technical", value: "technical" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    required: true,
    gridCol: "half",
    options: [
      { label: "Active", value: "active" },
      { label: "Deactive", value: "deactive" },
    ],
  },
  {
    key: "order",
    label: "Display Order",
    type: "number",
    required: true,
    gridCol: "half",
    placeholder: "1",
    validation: {
      min: 1,
      max: 999,
    },
  },
  {
    key: "content",
    label: "Content",
    type: "textarea",
    required: true,
    placeholder: "Enter the full terms content with markdown support...",
    gridCol: "full",
    validation: {
      minLength: 50,
    },
  },
];

// Search and filter configuration
const searchFilterConfig: SearchFilterConfig = {
  searchPlaceholder: "Search terms and policies...",
  enableSort: true,
  filters: [
    {
      key: "status",
      label: "Status",
      type: "select",
      placeholder: "All",
      options: [
        { value: "active", label: "Active" },
        { value: "deactive", label: "Deactive" },
      ],
    },
    {
      key: "category",
      label: "Category",
      type: "select",
      placeholder: "All Category",
      options: [
        { label: "Legal", value: "legal" },
        { label: "Privacy", value: "privacy" },
        { label: "Compliance", value: "compliance" },
        { label: "Commercial", value: "commercial" },
        { label: "Technical", value: "technical" },
      ],
    },
  ],
  sortOptions: [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "status", label: "Status" },
    { key: "order", label: "Order" },
  ],
};

// Column configuration for ViewModal
const columnConfig: ColumnConfig[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "description", label: "Description", type: "text" },
  {
    key: "category",
    label: "Category",
    type: "select",
    options: [
      { label: "Legal", value: "legal" },
      { label: "Privacy", value: "privacy" },
      { label: "Compliance", value: "compliance" },
      { label: "Commercial", value: "commercial" },
      { label: "Technical", value: "technical" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "active" },
      { label: "Deactive", value: "deactive" },
    ],
  },
  { key: "order", label: "Display Order", type: "number" },
  { key: "content", label: "Content", type: "textarea" },
];

export default function TermsAdminPage() {
  const [termsData, setTermsData] = useState<TermsItem[]>(mockTermsData);
  const [searchFilterState, setSearchFilterState] = useState<SearchFilterState>(
    {
      search: "",
      filters: {},
      sortBy: undefined,
      sortOrder: undefined,
      page: 1,
      itemsPerPage: 10,
    }
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TermsItem | null>(null);
  const [viewingItem, setViewingItem] = useState<TermsItem | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    item: TermsItem | null;
  }>({ isOpen: false, item: null });

  // Filter, search, and sort terms
  const filteredTerms = useMemo(() => {
    const filtered = termsData.filter((item) => {
      // Search filter
      const matchesSearch =
        searchFilterState.search === "" ||
        item.title
          .toLowerCase()
          .includes(searchFilterState.search.toLowerCase()) ||
        item.description
          .toLowerCase()
          .includes(searchFilterState.search.toLowerCase());

      // Status filter
      const statusFilter = searchFilterState.filters.status;
      const matchesStatus = !statusFilter || item.status === statusFilter;

      // Category filter
      const categoryFilter = searchFilterState.filters.category;
      const matchesCategory =
        !categoryFilter || item.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    // Sort
    if (searchFilterState.sortBy) {
      filtered.sort((a, b) => {
        const aValue = a[searchFilterState.sortBy as keyof TermsItem];
        const bValue = b[searchFilterState.sortBy as keyof TermsItem];

        let comparison = 0;

        // Handle different types properly
        if (typeof aValue === "string" && typeof bValue === "string") {
          comparison = aValue.localeCompare(bValue);
        } else if (typeof aValue === "number" && typeof bValue === "number") {
          comparison = aValue - bValue;
        } else if (aValue instanceof Date && bValue instanceof Date) {
          comparison = aValue.getTime() - bValue.getTime();
        } else {
          // Convert to string for comparison as fallback
          const aStr = String(aValue || "");
          const bStr = String(bValue || "");
          comparison = aStr.localeCompare(bStr);
        }

        return searchFilterState.sortOrder === "desc"
          ? -comparison
          : comparison;
      });
    } else {
      // Default sort by order
      filtered.sort((a, b) => a.order - b.order);
    }

    return filtered;
  }, [termsData, searchFilterState]);

  // Handle create
  const handleCreate = useCallback((data: Record<string, unknown>) => {
    const newItem: TermsItem = {
      id: Date.now().toString(),
      title: data.title as string,
      description: data.description as string,
      content: data.content as string,
      category: data.category as string,
      status: data.status as "active" | "deactive",
      order: data.order as number,
    };

    setTermsData((prev) => [...prev, newItem]);
  }, []);

  // Handle edit
  const handleEdit = useCallback(
    (data: Record<string, unknown>) => {
      if (!editingItem) return;

      setTermsData((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                title: data.title as string,
                description: data.description as string,
                content: data.content as string,
                category: data.category as string,
                status: data.status as "active" | "deactive",
                order: data.order as number,
              }
            : item
        )
      );
      setEditingItem(null);
    },
    [editingItem]
  );

  // Handle delete
  const handleDelete = useCallback((item: TermsItem) => {
    setTermsData((prev) => prev.filter((t) => t.id !== item.id));
    setDeleteDialog({ isOpen: false, item: null });
  }, []);

  // Handle order change
  const handleOrderChange = useCallback(
    (item: TermsItem, direction: "up" | "down") => {
      const currentIndex = filteredTerms.findIndex((t) => t.id === item.id);
      if (
        (direction === "up" && currentIndex === 0) ||
        (direction === "down" && currentIndex === filteredTerms.length - 1)
      ) {
        return;
      }

      const targetIndex =
        direction === "up" ? currentIndex - 1 : currentIndex + 1;
      const targetItem = filteredTerms[targetIndex];

      setTermsData((prev) =>
        prev.map((t) => {
          if (t.id === item.id) {
            return { ...t, order: targetItem.order };
          }
          if (t.id === targetItem.id) {
            return { ...t, order: item.order };
          }
          return t;
        })
      );
    },
    [filteredTerms]
  );

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "deactive":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "legal":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "privacy":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "compliance":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "commercial":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "technical":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const openEditModal = (item: TermsItem) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const openViewModal = (item: TermsItem) => {
    setViewingItem(item);
    setIsViewModalOpen(true);
  };

  const getEditInitialData = () => {
    if (!editingItem) return {};
    return { ...editingItem };
  };

  return (
    <div className="p-3 md:p-6 space-y-3 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-base md:text-2xl font-semibold text-gray-900">
              Terms & Conditions
            </h1>
            <p className="text-sm md:text-lg text-gray-600">
              Manage legal documents and policies
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Terms</span>
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <SearchFilterBar
        state={searchFilterState}
        config={searchFilterConfig}
        onStateChange={setSearchFilterState}
        className="bg-white rounded-lg border border-gray-200 p-4"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Terms</p>
              <p className="text-2xl font-semibold text-gray-900">
                {termsData.length}
              </p>
            </div>
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-semibold text-green-600">
                {termsData.filter((t) => t.status === "active").length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Deactive</p>
              <p className="text-2xl font-semibold text-red-600">
                {termsData.filter((t) => t.status === "deactive").length}
              </p>
            </div>
            <Edit className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-semibold text-blue-600">
                {new Set(termsData.map((t) => t.category)).size}
              </p>
            </div>
            <FileText className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Terms List */}
      <div className="space-y-4">
        {filteredTerms.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No terms found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchFilterState.search ||
              Object.keys(searchFilterState.filters).length > 0
                ? "No terms match your current filters."
                : "Get started by creating your first terms document."}
            </p>
            {!searchFilterState.search &&
              Object.keys(searchFilterState.filters).length === 0 && (
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Terms
                </Button>
              )}
          </div>
        ) : (
          filteredTerms.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gray-200 p-3 md:p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                {/* Content */}
                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-md md:text-lg font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        <Badge
                          className={`px-2 py-1 text-xs font-medium border ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </Badge>
                        <Badge
                          className={`px-2 py-1 text-xs font-medium border ${getCategoryColor(
                            item.category
                          )}`}
                        >
                          {item.category.charAt(0).toUpperCase() +
                            item.category.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Order: #{item.order}</span>
                    <span>Content: {item.content.length} characters</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  {/* Order Controls */}
                  <div className="flex flex-col space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOrderChange(item, "up")}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOrderChange(item, "down")}
                      disabled={index === filteredTerms.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* More Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openViewModal(item)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditModal(item)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeleteDialog({ isOpen: true, item })}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      <DynamicDataCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreate}
        title="Create New Terms & Conditions"
        description="Add a new legal document or policy to your platform"
        fields={formFields}
        saveButtonText="Create Terms"
        cancelButtonText="Cancel"
      />

      {/* Edit Modal */}
      <DynamicDataCreateModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleEdit}
        title="Edit Terms & Conditions"
        description="Update the selected legal document or policy"
        fields={formFields}
        initialData={getEditInitialData()}
        saveButtonText="Update Terms"
        cancelButtonText="Cancel"
      />

      {/* View Modal */}
      <ViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingItem(null);
        }}
        item={viewingItem}
        columns={columnConfig}
        title="Terms & Conditions Details"
        description="Detailed view of the selected terms and conditions"
      />

      {/* Delete Dialog */}
      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => setDeleteDialog({ isOpen: open, item: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Terms & Conditions</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{deleteDialog.item?.title}
              &ldquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteDialog.item && handleDelete(deleteDialog.item)
              }
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
