// src\components\common\DynamicCard.tsx
"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Eye, Calendar, User, MoreHorizontal } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

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

interface DynamicCardProps {
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

export function DynamicCard({
  data,
  columns,
  cardConfig,
  actions = [],
  searchFilterConfig,
  className,
  loading = false,
  emptyMessage = "No items found",
  itemsPerPage = 12,
}: DynamicCardProps) {
  const [selectedItem, setSelectedItem] = useState<GenericDataItem | null>(
    null
  );
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
            variant='secondary'
            style={
              option.color
                ? {
                    backgroundColor: option.color + "20",
                    color: option.color,
                  }
                : undefined
            }
          >
            {option.icon && <span className='mr-1'>{option.icon}</span>}
            {option.label}
          </Badge>
        );
      }
    }

    if (Array.isArray(value)) {
      return value.slice(0, 3).join(", ") + (value.length > 3 ? "..." : "");
    }

    return String(value);
  };

  // Render single card
  const renderCard = (item: GenericDataItem) => {
    const title = getFieldValue(item, cardConfig.titleKey);
    const subtitle = getFieldValue(item, cardConfig.subtitleKey);
    const image = getFieldValue(item, cardConfig.imageKey);
    const description = getFieldValue(item, cardConfig.descriptionKey);
    const status = getFieldValue(item, cardConfig.statusKey);

    const availableActions = actions.filter(
      (action) => !action.condition || action.condition(item)
    );

    return (
      <Card
        key={item.id}
        className='group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-primary/30 hover:border-primary'
      >
        <CardHeader>
          <div className='flex items-start justify-between'>
            <div className='flex-1 min-w-0'>
              <h3 className='font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors'>
                {String(title)}
              </h3>
              {typeof subtitle === "string" && subtitle && (
                <p className='text-sm text-muted-foreground mt-1 line-clamp-1'>
                  {subtitle}
                </p>
              )}
            </div>

            {(typeof status === "string" || typeof status === "number") && (
              <div className='ml-2'>
                {renderFieldValue(status, cardConfig.statusKey!)}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className='px-3 pb-4'>
          {typeof image === "string" && image && (
            <div className='mb-4 overflow-hidden rounded-lg'>
              <Image
                src={image}
                alt={typeof title === "string" ? title : "Image"}
                width={300}
                height={200}
                className='w-full h-48 object-cover transition-transform group-hover:scale-105'
                unoptimized={
                  image.startsWith("data:") || image.startsWith("blob:")
                }
              />
            </div>
          )}

          {typeof description === "string" && description && (
            <p className='text-sm text-muted-foreground line-clamp-3 mb-4'>
              {description}
            </p>
          )}

          {/* Badge Keys */}
          {cardConfig.badgeKeys && cardConfig.badgeKeys.length > 0 && (
            <div className='flex flex-wrap gap-2 mb-4'>
              {cardConfig.badgeKeys.map((key) => {
                const value = getFieldValue(item, key);
                if (!value) return null;
                return <div key={key}>{renderFieldValue(value, key)}</div>;
              })}
            </div>
          )}

          {/* Meta Information */}
          {cardConfig.metaKeys && cardConfig.metaKeys.length > 0 && (
            <div className='space-y-2 text-xs text-muted-foreground'>
              {cardConfig.metaKeys.map((key) => {
                const value = getFieldValue(item, key);
                if (!value) return null;

                const column = columns.find((col) => col.key === key);
                const icon =
                  key.includes("date") || key.includes("time") ? (
                    <Calendar className='h-3 w-3' />
                  ) : key.includes("author") || key.includes("user") ? (
                    <User className='h-3 w-3' />
                  ) : key.includes("view") ? (
                    <Eye className='h-3 w-3' />
                  ) : null;

                return (
                  <div key={key} className='flex items-center gap-1'>
                    {icon}
                    <span className='capitalize'>{column?.label || key}:</span>
                    <span>{renderFieldValue(value, key)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>

        <CardFooter className='px-3 pt-0 flex items-center justify-between'>
          <div className='flex gap-2'>
            {/* Details Button */}
            {cardConfig.showDetailsButton !== false && (
              <Button
                variant='outline'
                size='sm'
                onClick={() => setSelectedItem(item)}
                className='flex items-center gap-1'
              >
                <Eye className='h-3 w-3' />
                Details
              </Button>
            )}

            {/* Primary Action */}
            {cardConfig.primaryAction && (
              <Button
                variant={cardConfig.primaryAction.variant || "default"}
                size='sm'
                onClick={() => cardConfig.primaryAction!.onClick(item)}
                className='flex items-center gap-1'
              >
                {cardConfig.primaryAction.icon}
                {cardConfig.primaryAction.label}
              </Button>
            )}
          </div>

          {/* Secondary Actions */}
          {(availableActions.length > 0 || cardConfig.secondaryActions) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                {cardConfig.secondaryActions?.map((action) => (
                  <DropdownMenuItem
                    key={action.key}
                    onClick={() => action.onClick(item)}
                    className='flex items-center gap-2'
                  >
                    {action.icon}
                    {action.label}
                  </DropdownMenuItem>
                ))}
                {availableActions.map((action) => (
                  <DropdownMenuItem
                    key={action.key}
                    onClick={() => action.onClick(item)}
                    className='flex items-center gap-2'
                  >
                    {action.icon}
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardFooter>
      </Card>
    );
  };

  // Render pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className='flex items-center justify-between mt-8'>
        <div className='text-sm text-muted-foreground'>
          Showing{" "}
          {(searchFilterState.page - 1) * searchFilterState.itemsPerPage + 1} to{" "}
          {Math.min(
            searchFilterState.page * searchFilterState.itemsPerPage,
            filteredData.length
          )}{" "}
          of {filteredData.length} results
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() =>
              setSearchFilterState((prev) => ({ ...prev, page: prev.page - 1 }))
            }
            disabled={searchFilterState.page <= 1}
          >
            Previous
          </Button>

          <div className='flex items-center gap-1'>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = i + 1;
              return (
                <Button
                  key={pageNumber}
                  variant={
                    pageNumber === searchFilterState.page
                      ? "default"
                      : "outline"
                  }
                  size='sm'
                  onClick={() =>
                    setSearchFilterState((prev) => ({
                      ...prev,
                      page: pageNumber,
                    }))
                  }
                  className='w-8 h-8 p-0'
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>

          <Button
            variant='outline'
            size='sm'
            onClick={() =>
              setSearchFilterState((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            disabled={searchFilterState.page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={cn("space-y-6", className)}>
        {searchFilterConfig && (
          <div className='animate-pulse'>
            <div className='h-10 bg-muted rounded w-full mb-4' />
          </div>
        )}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className='animate-pulse'>
              <CardHeader>
                <div className='h-4 bg-muted rounded w-3/4 mb-2' />
                <div className='h-3 bg-muted rounded w-1/2' />
              </CardHeader>
              <CardContent>
                <div className='h-32 bg-muted rounded mb-4' />
                <div className='h-3 bg-muted rounded w-full mb-2' />
                <div className='h-3 bg-muted rounded w-2/3' />
              </CardContent>
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

      {/* Cards Grid */}
      {paginatedData.length > 0 ? (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {paginatedData.map(renderCard)}
          </div>

          {/* Pagination */}
          {renderPagination()}
        </>
      ) : (
        <div className='text-center py-12'>
          <div className='mx-auto w-24 h-24 text-muted-foreground mb-4'>
            <svg
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='1'
            >
              <circle cx='11' cy='11' r='8' />
              <path d='m21 21-4.35-4.35' />
            </svg>
          </div>
          <h3 className='text-lg font-medium text-muted-foreground mb-2'>
            {emptyMessage}
          </h3>
          <p className='text-sm text-muted-foreground'>
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
    </div>
  );
}
