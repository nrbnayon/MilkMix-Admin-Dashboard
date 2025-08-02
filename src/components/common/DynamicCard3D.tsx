"use client";

import type React from "react";
import { useState, useMemo } from "react";
import Image from "next/image";
import { Eye, Calendar, User, Edit, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { cn, truncateText } from "@/lib/utils";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { DynamicDetailsModal } from "./DynamicDetailsModal";
import { SearchFilterBar } from "./SearchFilterBar";
import type {
  GenericDataItem,
  ColumnConfig,
  ActionConfig,
  CardConfig,
  SearchFilterState,
  SearchFilterConfig,
} from "@/types/dynamicCardTypes";
import Lordicon from "../lordicon/lordicon-wrapper";

interface DynamicCard3DProps {
  data: GenericDataItem[];
  columns: ColumnConfig[];
  cardConfig: CardConfig;
  actions?: ActionConfig[];
  searchFilterConfig?: SearchFilterConfig;
  onDataChange?: (newData: GenericDataItem[]) => void;
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
  itemsPerPage?: number;
}

export function DynamicCard3D({
  data,
  columns,
  cardConfig,
  actions = [],
  searchFilterConfig,
  className,
  loading = false,
  emptyMessage = "No items found",
  itemsPerPage = 12,
}: DynamicCard3DProps) {
  const [selectedItem, setSelectedItem] = useState<GenericDataItem | null>(
    null
  );
  const [deleteItem, setDeleteItem] = useState<GenericDataItem | null>(null);
  const [searchFilterState, setSearchFilterState] = useState<SearchFilterState>(
    {
      search: "",
      filters: {},
      sortBy: undefined,
      sortOrder: undefined,
      page: 1,
      itemsPerPage,
    }
  );

  // Filter and search data
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchFilterState.search && searchFilterConfig?.searchKeys) {
      const searchTerm = searchFilterState.search.toLowerCase();
      result = result.filter((item) =>
        searchFilterConfig.searchKeys!.some((key) => {
          const value = item[key];
          if (typeof value === "string") {
            return value.toLowerCase().includes(searchTerm);
          }
          if (Array.isArray(value)) {
            return value.some((v) =>
              String(v).toLowerCase().includes(searchTerm)
            );
          }
          return String(value).toLowerCase().includes(searchTerm);
        })
      );
    }

    // Apply filters
    Object.entries(searchFilterState.filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        result = result.filter((item) => {
          const itemValue = item[key];
          if (Array.isArray(itemValue)) {
            return itemValue.includes(value);
          }
          return String(itemValue) === String(value);
        });
      }
    });

    // Apply sorting
    if (searchFilterState.sortBy) {
      result.sort((a, b) => {
        const aValue = a[searchFilterState.sortBy!];
        const bValue = b[searchFilterState.sortBy!];
        if (aValue === bValue) return 0;
        if (
          (typeof aValue === "string" && typeof bValue === "string") ||
          (typeof aValue === "number" && typeof bValue === "number")
        ) {
          const comparison = aValue < bValue ? -1 : 1;
          return searchFilterState.sortOrder === "desc"
            ? -comparison
            : comparison;
        }
        return 0;
      });
    }

    return result;
  }, [data, searchFilterState, searchFilterConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex =
      (searchFilterState.page - 1) * searchFilterState.itemsPerPage;
    const endIndex = startIndex + searchFilterState.itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, searchFilterState.page, searchFilterState.itemsPerPage]);

  const totalPages = Math.ceil(
    filteredData.length / searchFilterState.itemsPerPage
  );

  // Helper function to format date/time values
  const formatDateTime = (value: unknown): string => {
    if (!value) return "";

    // Handle different date formats
    const date = new Date(String(value));

    // Check if it's a valid date
    if (isNaN(date.getTime())) {
      return String(value);
    }

    // Format as human-readable date
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  // Helper function to get field value with fallback
  const getFieldValue = (item: GenericDataItem, key?: string): unknown => {
    if (!key) return null;
    return item[key];
  };

  // Helper function to render field value
  const renderFieldValue = (value: unknown, key: string): React.ReactNode => {
    if (value === null || value === undefined) return null;

    const column = columns.find((col) => col.key === key);
    if (column?.render) {
      return column.render(value, {} as GenericDataItem);
    }

    if (column?.type === "select" && column.options) {
      const option = column.options.find((opt) => opt.value === String(value));
      if (option) {
        return (
          <Badge
            variant="secondary"
            style={
              option.color
                ? {
                    backgroundColor: option.color + "20",
                    color: option.color,
                  }
                : undefined
            }
          >
            {option.icon && <span className="mr-1">{option.icon}</span>}
            {option.label}
          </Badge>
        );
      }
    }

    // Format date/time fields
    if (
      key.includes("date") ||
      key.includes("time") ||
      key.includes("created") ||
      key.includes("updated")
    ) {
      return formatDateTime(value);
    }

    if (Array.isArray(value)) {
      return value.slice(0, 3).join(", ") + (value.length > 3 ? "..." : "");
    }

    return String(value);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!deleteItem) return;

    const deleteAction = actions.find((action) => action.key === "delete");
    if (deleteAction) {
      deleteAction.onClick(deleteItem);
    }
    setDeleteItem(null);
  };

  // Get available actions for an item
  const getAvailableActions = (item: GenericDataItem) => {
    return actions.filter(
      (action) => !action.condition || action.condition(item)
    );
  };

  // Render single 3D card
  const renderCard = (item: GenericDataItem) => {
    const title = getFieldValue(item, cardConfig.titleKey);
    const subtitle = getFieldValue(item, cardConfig.subtitleKey);
    const image = getFieldValue(item, cardConfig.imageKey);
    const description = getFieldValue(item, cardConfig.descriptionKey);
    const status = getFieldValue(item, cardConfig.statusKey);
    const availableActions = getAvailableActions(item);

    const editAction = availableActions.find((action) => action.key === "edit");
    const deleteAction = availableActions.find(
      (action) => action.key === "delete"
    );

    return (
      <CardContainer
        key={item.id}
        className="inter-var w-full h-full border rounded-md border-primary/30 hover:border-primary"
      >
        <CardBody className="bg-white relative group/card dark:hover:shadow-2xl dark:hover:shadow-primary/[0.1] dark:bg-gray-900 dark:border-gray-700 w-full h-full rounded-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
          {/* Status Badge - Fixed Position */}
          <div className="absolute top-4 right-4 z-10">
            <CardItem translateZ="100">
              {(typeof status === "string" || typeof status === "number") &&
                renderFieldValue(status, cardConfig.statusKey!)}
            </CardItem>
          </div>

          {/* Card Header */}
          <CardItem translateZ="50" className="w-full pt-3">
            <CardHeader className="pb-3">
              <div className="pr-20">
                <CardItem
                  translateZ="60"
                  className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover/card:text-primary transition-colors"
                >
                  {truncateText(String(title), 30)}
                </CardItem>
                {typeof subtitle === "string" && subtitle && (
                  <CardItem
                    translateZ="40"
                    as="p"
                    className="text-gray-600 text-sm mt-1 dark:text-gray-300 line-clamp-1"
                  >
                    {truncateText(String(subtitle), 30)}
                  </CardItem>
                )}
              </div>
            </CardHeader>
          </CardItem>

          {/* Card Content - Flexible */}
          <CardItem translateZ="50" className="w-full flex-1">
            <CardContent className="px-3 pb-0">
              {/* Image */}
              {typeof image === "string" && image && (
                <CardItem translateZ="100" className="w-full mb-4 rounded-xl">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={typeof title === "string" ? title : "Image"}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover rounded-xl transition-transform group-hover/card:scale-105 duration-300"
                    unoptimized={
                      image.startsWith("data:") || image.startsWith("blob:")
                    }
                  />
                </CardItem>
              )}

              {/* Description */}
              {typeof description === "string" && description && (
                <CardItem
                  translateZ="60"
                  as="p"
                  className="text-gray-600 text-sm dark:text-gray-300 line-clamp-3 mb-2"
                >
                  {truncateText(String(description), 80)}
                </CardItem>
              )}

              {/* Badge Keys */}
              {cardConfig.badgeKeys && cardConfig.badgeKeys.length > 0 && (
                <CardItem translateZ="40" className="mb-2">
                  <div className="flex flex-wrap gap-2">
                    {cardConfig.badgeKeys.map((key) => {
                      const value = getFieldValue(item, key);
                      if (!value) return null;
                      return (
                        <div key={key}>{renderFieldValue(value, key)}</div>
                      );
                    })}
                  </div>
                </CardItem>
              )}

              {/* Meta Information */}
              {cardConfig.metaKeys && cardConfig.metaKeys.length > 0 && (
                <CardItem
                  translateZ="30"
                  className="space-y-2 text-xs text-gray-500 dark:text-gray-400 mb-4"
                >
                  {cardConfig.metaKeys.map((key) => {
                    const value = getFieldValue(item, key);
                    if (!value) return null;
                    const column = columns.find((col) => col.key === key);
                    const icon =
                      key.includes("date") || key.includes("time") ? (
                        <Calendar className="h-3 w-3" />
                      ) : key.includes("author") || key.includes("user") ? (
                        <User className="h-3 w-3" />
                      ) : key.includes("view") ? (
                        <Eye className="h-3 w-3" />
                      ) : null;

                    return (
                      <div key={key} className="flex items-center gap-1">
                        {icon}
                        <span className="capitalize">
                          {column?.label || key}:
                        </span>
                        <span>{renderFieldValue(value, key)}</span>
                      </div>
                    );
                  })}
                </CardItem>
              )}
            </CardContent>
          </CardItem>

          {/* Card Footer - Fixed at Bottom */}
          <CardItem translateZ="60" className="w-full mt-auto">
            <div className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
              <CardFooter className="p-3 flex items-center justify-between gap-2">
                {/* Primary Actions */}
                <div className="flex gap-2">
                  {/* Details Button */}
                  {cardConfig.showDetailsButton !== false && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                      }}
                      className="flex items-center gap-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors border-primary/20 bg-white dark:bg-gray-900"
                    >
                      <Eye className="h-3 w-3" />
                      Details
                    </Button>
                  )}
                </div>

                {/* Action Icons */}
                <div className="flex items-center gap-1">
                  {/* Edit Button */}
                  {editAction && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        editAction.onClick(item);
                      }}
                      className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-xl"
                      title="Edit"
                    >
                      <Edit className="h-5 w-5" />
                    </Button>
                  )}

                  {/* Delete Button */}
                  {deleteAction && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteItem(item);
                      }}
                      className="h-9 w-9 hover:bg-red-50 hover:text-red-600 transition-colors rounded-xl"
                      title="Delete"
                    >
                      <Lordicon
                        src="https://cdn.lordicon.com/jmkrnisz.json"
                        trigger="hover"
                        size={20}
                        colors={{
                          primary: "#FF0000",
                          secondary: "#ffffff",
                        }}
                        stroke={4}
                      />
                    </Button>
                  )}
                </div>
              </CardFooter>
            </div>
          </CardItem>
        </CardBody>
      </CardContainer>
    );
  };

  // Render pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
      const current = searchFilterState.page;
      const total = totalPages;
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (
        let i = Math.max(2, current - delta);
        i <= Math.min(total - 1, current + delta);
        i++
      ) {
        range.push(i);
      }

      if (current - delta > 2) {
        rangeWithDots.push(1, "...");
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (current + delta < total - 1) {
        rangeWithDots.push("...", total);
      } else if (total > 1) {
        rangeWithDots.push(total);
      }

      return rangeWithDots;
    };

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {(searchFilterState.page - 1) * searchFilterState.itemsPerPage + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {Math.min(
              searchFilterState.page * searchFilterState.itemsPerPage,
              filteredData.length
            )}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {filteredData.length}
          </span>{" "}
          results
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setSearchFilterState((prev) => ({ ...prev, page: prev.page - 1 }))
            }
            disabled={searchFilterState.page <= 1}
            className="flex items-center gap-1"
          >
            ← Previous
          </Button>
          <div className="flex items-center gap-1">
            {getVisiblePages().map((page, index) => (
              <div key={index}>
                {page === "..." ? (
                  <span className="px-2 py-1 text-gray-500">...</span>
                ) : (
                  <Button
                    variant={
                      page === searchFilterState.page ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      setSearchFilterState((prev) => ({
                        ...prev,
                        page: page as number,
                      }))
                    }
                    className="w-10 h-8 p-0"
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setSearchFilterState((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            disabled={searchFilterState.page >= totalPages}
            className="flex items-center gap-1"
          >
            Next →
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={cn("space-y-6", className)}>
        {searchFilterConfig && (
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-full mb-4" />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse h-96 flex flex-col">
              <CardHeader className="flex-shrink-0">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              </CardContent>
              <CardFooter className="flex-shrink-0 border-t bg-gray-50 dark:bg-gray-800">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Search and Filter Bar */}
      {searchFilterConfig && (
        <SearchFilterBar
          state={searchFilterState}
          config={searchFilterConfig}
          onStateChange={setSearchFilterState}
        />
      )}

      {/* 3D Cards Grid */}
      {paginatedData.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedData.map(renderCard)}
          </div>
          {/* Pagination */}
          {renderPagination()}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 text-muted-foreground mb-4">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            {emptyMessage}
          </h3>
          <p className="text-sm text-muted-foreground">
            {searchFilterState.search ||
            Object.keys(searchFilterState.filters).length > 0
              ? "Try adjusting your search or filters"
              : "No items to display"}
          </p>
        </div>
      )}

      {/* Details Modal */}
      {selectedItem && (
        <DynamicDetailsModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
          columns={columns}
          actions={actions}
        />
      )}

      {/* Delete Confirmation Modal */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-semibold text-red-600">
                &ldquo;
                {deleteItem &&
                  String(getFieldValue(deleteItem, cardConfig.titleKey))}
                &rdquo;
              </span>
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
