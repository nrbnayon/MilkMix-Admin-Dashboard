// src\components\common\DynamicTable.tsx
"use client";
import React, { useState, useMemo, useCallback } from "react";
import {
  Search,
  Calendar,
  ChevronUp,
  ChevronDown,
  Download,
  RefreshCw,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { DynamicEditModal } from "./DynamicEditModal";
import type {
  GenericDataItem,
  ColumnConfig,
  FormFieldConfig,
  FilterConfig,
  ActionConfig,
  TableConfig,
  EditModalConfig,
  DateRangeFilter,
} from "../../types/dynamicTableTypes";
import { ViewModal } from "./ViewModal";
import Lordicon from "../lordicon/lordicon-wrapper";
import { useRouter } from "next/navigation";

interface DynamicTableProps {
  data: GenericDataItem[];
  columns: ColumnConfig[];
  formFields?: FormFieldConfig[];
  filters?: FilterConfig[];
  actions?: ActionConfig[];
  tableConfig?: TableConfig;
  editModalConfig?: EditModalConfig;
  onDataChange?: (data: GenericDataItem[]) => void;
  onItemEdit?: (item: GenericDataItem) => void;
  onItemDelete?: (itemId: string) => void;
  onItemsSelect?: (selectedIds: string[]) => void;
  onExport?: (data: GenericDataItem[]) => void;
  onRefresh?: () => void;
  buttonText?: string;
  pageUrl?: string;
  isLoading?: boolean;
}

export const DynamicTable: React.FC<DynamicTableProps> = ({
  data = [],
  columns,
  formFields = [],
  filters = [],
  actions = [],
  tableConfig = {},
  editModalConfig = {},
  onDataChange,
  onItemEdit,
  onItemDelete,
  onItemsSelect,
  onExport,
  onRefresh,
  buttonText,
  pageUrl,
  isLoading = false,
}) => {
  const router = useRouter();

  // State management
  const [localData, setLocalData] = useState<GenericDataItem[]>(data);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>(
    {}
  );
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GenericDataItem | null>(
    null
  );
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    itemId: string;
    itemName: string;
  }>({
    open: false,
    itemId: "",
    itemName: "",
  });
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewItem, setViewItem] = useState<GenericDataItem | null>(null);

  // Configuration with defaults
  const config: Required<TableConfig> = {
    title: "Data Table",
    description: "",
    searchPlaceholder: "Search...",
    itemsPerPage: 10,
    enableSearch: true,
    enableFilters: true,
    enablePagination: true,
    enableSelection: false,
    enableSorting: true,
    stickyHeader: false,
    striped: true,
    bordered: false,
    compact: false,
    className: "",
    emptyMessage: "No data found",
    loadingMessage: "Loading...",
    ...tableConfig,
  };

  // Update local data when props change
  React.useEffect(() => {
    setLocalData(data);
  }, [data]);

  // Format value based on column type
  const formatValue = useCallback(
    (value: unknown, column: ColumnConfig): string => {
      if (value === null || value === undefined) return "-";
      switch (column.type) {
        case "currency":
          const numValue =
            typeof value === "string"
              ? Number.parseFloat(value.replace(/[$,]/g, ""))
              : typeof value === "number"
              ? value
              : 0;
          return isNaN(numValue) ? "$0" : `$${numValue.toLocaleString()}`;
        case "percentage":
          const percentValue = Number(value) || 0;
          return `${percentValue}%`;
        case "date":
          try {
            return new Date(
              value as string | number | Date
            ).toLocaleDateString();
          } catch {
            return value.toString();
          }
        case "datetime-local":
          try {
            return new Date(value as string | number | Date).toLocaleString();
          } catch {
            return value.toString();
          }
        case "checkbox":
          return value ? "Yes" : "No";
        default:
          if (Array.isArray(value)) {
            return value.map((v) => String(v || "")).join(", ");
          }
          return String(value || "");
      }
    },
    []
  );

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = [...localData];
    // Apply search
    if (config.enableSearch && searchTerm) {
      filtered = filtered.filter((item) => {
        const searchableColumns = columns.filter(
          (col) => col.searchable !== false
        );
        return searchableColumns.some((column) => {
          const value = item[column.key];
          if (value === null || value === undefined) return false;
          return formatValue(value, column)
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        });
      });
    }

    // Apply filters
    if (config.enableFilters) {
      Object.entries(activeFilters).forEach(([filterKey, filterValue]) => {
        if (!filterValue || filterValue === "all") return;
        const filter = filters.find((f) => f.key === filterKey);
        if (!filter) return;

        filtered = filtered.filter((item) => {
          const itemValue = item[filterKey];
          switch (filter.type) {
            case "select":
              if (filter.multiple && Array.isArray(filterValue)) {
                return filterValue.some((val) =>
                  Array.isArray(itemValue)
                    ? itemValue.includes(val)
                    : itemValue === val
                );
              }
              return Array.isArray(itemValue)
                ? itemValue.includes(filterValue)
                : itemValue === filterValue;
            case "date":
              try {
                const itemDate = new Date(itemValue as string | number | Date);
                const filterDate = new Date(
                  filterValue as string | number | Date
                );
                return itemDate.toDateString() === filterDate.toDateString();
              } catch {
                return false;
              }
            case "daterange":
              const dateRange = filterValue as DateRangeFilter;
              if (dateRange.start && dateRange.end) {
                try {
                  const itemDate = new Date(
                    itemValue as string | number | Date
                  );
                  return (
                    itemDate >= new Date(dateRange.start) &&
                    itemDate <= new Date(dateRange.end)
                  );
                } catch {
                  return false;
                }
              }
              return true;
            case "number":
              return Number(itemValue) === Number(filterValue);
            case "text":
              return (itemValue as string)
                ?.toString()
                .toLowerCase()
                .includes((filterValue as string).toLowerCase());
            default:
              return true;
          }
        });
      });
    }

    // Apply sorting
    if (config.enableSorting && sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        let comparison = 0;
        if (typeof aValue === "number" && typeof bValue === "number") {
          comparison = aValue - bValue;
        } else {
          comparison = aValue.toString().localeCompare(bValue.toString());
        }

        return sortConfig.direction === "desc" ? -comparison : comparison;
      });
    }

    return filtered;
  }, [
    localData,
    searchTerm,
    activeFilters,
    sortConfig,
    columns,
    config.enableSearch,
    config.enableFilters,
    config.enableSorting,
    filters,
    formatValue,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / config.itemsPerPage);
  const startIndex = (currentPage - 1) * config.itemsPerPage;
  const currentData = config.enablePagination
    ? filteredData.slice(startIndex, startIndex + config.itemsPerPage)
    : filteredData;

  // Handle sorting
  const handleSort = (columnKey: string) => {
    const column = columns.find((col) => col.key === columnKey);
    if (!column?.sortable) return;

    setSortConfig((current) => {
      if (current?.key === columnKey) {
        return current.direction === "asc"
          ? { key: columnKey, direction: "desc" }
          : null;
      }
      return { key: columnKey, direction: "asc" };
    });
  };

  // Handle selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(currentData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  // Handle edit
  const handleEdit = (item: GenericDataItem) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleModalSave = (updatedItem: GenericDataItem) => {
    const updatedData = localData.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setLocalData(updatedData);
    onDataChange?.(updatedData);
    onItemEdit?.(updatedItem);
    setEditModalOpen(false);
    setSelectedItem(null);
  };

  // Handle view
  const handleView = (item: GenericDataItem) => {
    setViewItem(item);
    setViewModalOpen(true);
  };

  // Handle delete
  const handleDelete = (item: GenericDataItem) => {
    setDeleteConfirm({
      open: true,
      itemId: item.id,
      itemName: item.name?.toString() || item.id,
    });
  };

  const confirmDelete = () => {
    if (deleteConfirm.itemId === "bulk") {
      // Handle bulk deletion
      const updatedData = localData.filter(
        (item) => !selectedItems.includes(item.id)
      );
      setLocalData(updatedData);
      onDataChange?.(updatedData);
      selectedItems.forEach((id) => onItemDelete?.(id));
      setSelectedItems([]);
    } else {
      // Handle single item deletion
      const updatedData = localData.filter(
        (item) => item.id !== deleteConfirm.itemId
      );
      setLocalData(updatedData);
      onDataChange?.(updatedData);
      onItemDelete?.(deleteConfirm.itemId);
    }
    setDeleteConfirm({ open: false, itemId: "", itemName: "" });

    // Adjust current page if necessary
    const newTotalPages = Math.ceil(
      (deleteConfirm.itemId === "bulk"
        ? localData.filter((item) => !selectedItems.includes(item.id)).length
        : localData.length - 1) / config.itemsPerPage
    );
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  // Handle redirect to see more page
  const handleSeeMore = () => {
    if (pageUrl) {
      router.push(pageUrl);
    }
  };

  // Render filter controls
  const renderFilters = () => {
    if (!config.enableFilters || filters.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          switch (filter.type) {
            case "select":
              return (
                <Select
                  key={filter.key}
                  value={(activeFilters[filter.key] as string) || "all"}
                  onValueChange={(value) =>
                    setActiveFilters((prev) => ({
                      ...prev,
                      [filter.key]: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-fit md:w-48 border-primary/30 rounded-md">
                    <SelectValue placeholder={filter.label} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All {filter.label}</SelectItem>
                    {filter.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            case "date":
              return (
                <div
                  key={filter.key}
                  className="relative border w-48 border-primary/30 rounded-md"
                >
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="date"
                    placeholder={filter.label}
                    className="pl-10 w-[180px]"
                    value={(activeFilters[filter.key] as string) || ""}
                    onChange={(e) =>
                      setActiveFilters((prev) => ({
                        ...prev,
                        [filter.key]: e.target.value,
                      }))
                    }
                  />
                </div>
              );
            default:
              return null;
          }
        })}
        {Object.keys(activeFilters).length > 0 && (
          <Button
            variant="destructive"
            className="py-4 mt-2"
            size="sm"
            onClick={() => setActiveFilters({})}
          >
            Clear Filters
          </Button>
        )}
      </div>
    );
  };

  // Render cell content with avatar support
  const renderCellContent = (item: GenericDataItem, column: ColumnConfig) => {
    const value = item[column.key];

    if (column.render) {
      return column.render(value, item);
    }

    // Handle name column with avatar
    if (column.key === "name" && column.showAvatar) {
      return (
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage
              src={item.avatar || "/placeholder.svg"}
              alt={value?.toString() || "User"}
            />
            <AvatarFallback>
              <Lordicon
                src="https://cdn.lordicon.com/hhljfoaj.json"
                trigger="hover"
                size={24}
                colors={{
                  primary: "",
                  secondary: "",
                }}
                stroke={1}
              />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm truncate">
              {formatValue(value, column)}
            </p>
            {typeof item.username === "string" && (
              <p className="font-normal text-xs text-gray-500 truncate">
                @{String(item.username)}
              </p>
            )}
          </div>
        </div>
      );
    }

    // Handle special column types
    if (column.type === "checkbox") {
      return <Checkbox checked={Boolean(value)} disabled className="mx-auto" />;
    }

    if (column.type === "select" || column.type === "multiselect") {
      const values = Array.isArray(value) ? value : [value];
      return (
        <div
          className={cn(
            "flex flex-wrap gap-1",
            column.align === "center" ? "justify-center" : "justify-start"
          )}
        >
          {values.map((val, index) => {
            const option = column.options?.find((opt) => opt.value === val);
            return (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs"
                style={
                  option?.color
                    ? { backgroundColor: option.color, color: "white" }
                    : undefined
                }
              >
                {option?.label || val}
              </Badge>
            );
          })}
        </div>
      );
    }

    return (
      <div
        className={cn("truncate", column.className)}
        title={formatValue(value, column)}
      >
        {formatValue(value, column)}
      </div>
    );
  };

  // Generate page numbers
  const generatePageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Update selected items callback
  React.useEffect(() => {
    onItemsSelect?.(selectedItems);
  }, [selectedItems, onItemsSelect]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          {config.loadingMessage}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "space-y-5 border border-primary/30 p-2 md:p-4 mt-4 rounded-2xl",
        config.className
      )}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl text-foreground font-semibold">
            {config.title}
          </h2>
          {config.description && (
            <p className="text-gray-700 mt-1">{config.description}</p>
          )}
        </div>
        {buttonText && pageUrl && (
          <Button
            variant="outline"
            onClick={handleSeeMore}
            className="flex items-center gap-2 bg-transparent"
          >
            {buttonText}
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        {config.enableSearch && (
          <div className="relative w-full lg:flex-1 lg:max-w-sm border-primary/30 rounded-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={config.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 border-primary/30 rounded-md focus-visible:border-primary"
            />
          </div>
        )}
        <div className="flex flex-col xs:flex-row gap-2 lg:gap-3 w-full lg:w-auto">
          {renderFilters()}
        </div>
        <div className="flex flex-row gap-2 w-full lg:w-auto justify-center lg:justify-end">
          {onRefresh && (
            <Button
              variant="outline"
              size="lg"
              onClick={onRefresh}
              className="border-primary/30 rounded-md flex-1 lg:flex-none"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
          {onExport && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => onExport(filteredData)}
              className="border-primary/30 rounded-md flex-1 lg:flex-none"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Selection Info with Bulk Actions - Fully Responsive */}
      {config.enableSelection && selectedItems.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-blue-50 rounded-lg text-black">
          <span className="text-sm text-blue-700 text-center sm:text-left">
            {selectedItems.length} item(s) selected
          </span>
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            {onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const selectedData = filteredData.filter((item) =>
                    selectedItems.includes(item.id)
                  );
                  onExport(selectedData);
                }}
                className="w-full md:w-auto"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Selected
              </Button>
            )}
            {onItemDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setDeleteConfirm({
                    open: true,
                    itemId: "bulk",
                    itemName: `${selectedItems.length} selected items`,
                  });
                }}
                className="w-full md:w-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedItems([])}
              className="w-full md:w-auto"
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border border-primary/80 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader
              className={cn(
                config.stickyHeader && "sticky top-0 z-10",
                "text-black bg-yellow-50"
              )}
            >
              <TableRow className={cn(config.bordered && "border-b")}>
                {config.enableSelection && (
                  <TableHead className="w-10 py-5 px-2 ">
                    <Checkbox
                      checked={
                        selectedItems.length === currentData.length &&
                        currentData.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                )}
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={cn(
                      column.headerClassName,
                      column.sortable && "cursor-pointer text-black",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right ",
                      "py-5 px-2"
                    )}
                    style={{
                      width: column.width,
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                    }}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-2",
                        column.align === "center" && "justify-center",
                        column.align === "right" && "justify-end"
                      )}
                    >
                      {column.label}
                      {column.sortable &&
                        sortConfig?.key === column.key &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        ))}
                    </div>
                  </TableHead>
                ))}
                {(actions.length > 0 || formFields.length > 0) && (
                  <TableHead className="w-[150px] text-center px-3 text-black">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={cn(
                      config.striped &&
                        index % 2 === 0 &&
                        "bg-gray-50/50 dark:bg-background",
                      config.bordered && "border-b",
                      config.compact && "h-12"
                    )}
                  >
                    {config.enableSelection && (
                      <TableCell className="w-[40px] px-2">
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={(checked) =>
                            handleSelectItem(item.id, Boolean(checked))
                          }
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell
                        key={column.key}
                        className={cn(
                          column.className,
                          column.align === "center" && "text-center",
                          column.align === "right" && "text-right",
                          "px-3"
                        )}
                        style={{
                          width: column.width,
                          minWidth: column.minWidth,
                          maxWidth: column.maxWidth,
                        }}
                      >
                        {renderCellContent(item, column)}
                      </TableCell>
                    ))}
                    {(actions.length > 0 || formFields.length > 0) && (
                      <TableCell className="w-[150px] px-3">
                        <div className="flex items-center justify-center gap-1">
                          {/* Only show Edit button if formFields exist and no custom edit action */}
                          {formFields.length > 0 &&
                            !actions.some(
                              (action) => action.key === "edit"
                            ) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(item)}
                              >
                                Edit
                              </Button>
                            )}
                          {/* Render custom actions */}
                          {actions.map((action) => {
                            if (action.show && !action.show(item)) return null;
                            return (
                              <Button
                                key={action.key}
                                variant={action.variant || "ghost"}
                                size={action.size || "sm"}
                                onClick={() => {
                                  if (action.key === "view") {
                                    handleView(item);
                                  } else if (action.key === "edit") {
                                    handleEdit(item);
                                  } else {
                                    action.onClick(item);
                                  }
                                }}
                                className={cn(action.className)}
                              >
                                {action.icon}
                                {action.label}
                              </Button>
                            );
                          })}
                          {/* Only show Delete button if no custom delete action and onItemDelete exists */}
                          {onItemDelete &&
                            !actions.some(
                              (action) => action.key === "delete"
                            ) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(item)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Lordicon
                                  src="https://cdn.lordicon.com/jmkrnisz.json"
                                  trigger="hover"
                                  size={20}
                                  colors={{
                                    primary: "#FF0000",
                                    secondary: "#ffffff",
                                  }}
                                  stroke={1}
                                />
                              </Button>
                            )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={
                      columns.length +
                      (config.enableSelection ? 1 : 0) +
                      (actions.length > 0 || formFields.length > 0 ? 1 : 0)
                    }
                    className="text-center py-8 text-gray-500"
                  >
                    {config.emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Results Summary */}
      {filteredData.length > 0 && config.enablePagination && (
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + config.itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} results
        </div>
      )}

      {/* Pagination */}
      {config.enablePagination && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {generatePageNumbers().map((pageNum, index) => (
                <PaginationItem key={index}>
                  {pageNum === "..." ? (
                    <span className="px-3 py-2">...</span>
                  ) : (
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNum as number)}
                      isActive={currentPage === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Edit Modal */}
      {formFields.length > 0 && (
        <DynamicEditModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
          onSave={handleModalSave}
          fieldConfigs={formFields}
          modalConfig={editModalConfig}
        />
      )}

      {/* Delete Confirmation */}
      <Dialog
        open={deleteConfirm.open}
        onOpenChange={() =>
          setDeleteConfirm({ open: false, itemId: "", itemName: "" })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{deleteConfirm.itemName}
              &ldquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setDeleteConfirm({ open: false, itemId: "", itemName: "" })
              }
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <ViewModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setViewItem(null);
        }}
        item={viewItem}
        columns={columns}
        title="Data Details"
        description="Complete information about the selected data"
      />
    </div>
  );
};
