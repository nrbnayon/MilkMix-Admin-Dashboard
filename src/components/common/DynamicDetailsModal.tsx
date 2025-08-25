// src\components\common\DynamicDetailsModal.tsx
"use client";
import React from "react";
import Image from "next/image";
import { Calendar, ExternalLink, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import type {
  GenericDataItem,
  ColumnConfig,
  ActionConfig,
} from "@/types/dynamicCardTypes";

interface DynamicDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: GenericDataItem;
  columns: ColumnConfig[];
  title?: string;
  actions?: ActionConfig[];
  className?: string;
}

export function DynamicDetailsModal({
  isOpen,
  onClose,
  item,
  columns,
  title,
  actions = [],
  className,
}: DynamicDetailsModalProps) {
  // Helper function to format values
  const formatValue = (
    value: unknown,
    column: ColumnConfig
  ): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground italic">Not provided</span>;
    }

    // Use custom render function if available
    if (column.render) {
      return column.render(value, item);
    }

    // Handle different data types
    switch (column.type) {
      case "date":
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm sm:text-base break-words">
              {new Date(String(value)).toLocaleDateString()}
            </span>
          </div>
        );

      case "url":
        return (
          <a
            href={String(value)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-start gap-1 text-primary hover:underline break-all text-sm sm:text-base"
          >
            <span className="break-all">{String(value)}</span>
            <ExternalLink className="h-3 w-3 flex-shrink-0 mt-0.5" />
          </a>
        );

      case "select":
        if (column.options) {
          const option = column.options.find(
            (opt) => opt.value === String(value)
          );
          if (option) {
            return (
              <Badge
                variant="secondary"
                className="text-xs sm:text-sm max-w-full"
                style={
                  option.color
                    ? {
                        backgroundColor: option.color + "20",
                        color: option.color,
                      }
                    : undefined
                }
              >
                {option.icon && (
                  <span className="mr-1 flex-shrink-0">{option.icon}</span>
                )}
                <span className="truncate">{option.label}</span>
              </Badge>
            );
          }
        }
        return (
          <Badge
            variant="outline"
            className="text-xs sm:text-sm max-w-full truncate"
          >
            {String(value)}
          </Badge>
        );

      case "image":
        if (typeof value === "string" && value.trim()) {
          return (
            <div className="space-y-2 w-full">
              <div className="relative w-full max-w-full mx-auto">
                <Image
                  src={value}
                  alt="Detail image"
                  width={400}
                  height={300}
                  className="rounded-lg border object-cover w-full h-auto max-h-[300px] sm:max-h-[400px]"
                  unoptimized={
                    value.startsWith("data:") || value.startsWith("blob:")
                  }
                />
              </div>
            </div>
          );
        } else if (Array.isArray(value) && value.length > 0) {
          return (
            <div className="space-y-3 w-full">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                {value.map((img, index) => (
                  <div key={index} className="relative aspect-square w-full">
                    <Image
                      src={String(img)}
                      alt={`Image ${index + 1}`}
                      width={150}
                      height={150}
                      className="rounded-lg border object-cover w-full h-full"
                      unoptimized={
                        String(img).startsWith("data:") ||
                        String(img).startsWith("blob:")
                      }
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground text-center">
                {value.length} image{value.length > 1 ? "s" : ""}
              </p>
            </div>
          );
        }
        return (
          <span className="text-muted-foreground italic text-sm">No image</span>
        );

      case "textarea":
        return (
          <div className="prose prose-sm max-w-none w-full">
            <div
              className="whitespace-pre-wrap text-sm leading-relaxed break-words overflow-hidden"
              dangerouslySetInnerHTML={{
                __html: String(value).replace(/\n/g, "<br>"),
              }}
            />
          </div>
        );

      default:
        // Handle arrays (like tags, keywords)
        if (Array.isArray(value)) {
          if (value.length === 0) {
            return (
              <span className="text-muted-foreground italic text-sm">None</span>
            );
          }
          return (
            <div className="flex flex-wrap gap-1 w-full">
              {value.map((item, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs max-w-full"
                >
                  <Tag className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{String(item)}</span>
                </Badge>
              ))}
            </div>
          );
        }

        // Handle objects (like social links)
        if (typeof value === "object" && value !== null) {
          const obj = value as Record<string, unknown>;
          const entries = Object.entries(obj).filter(([, v]) => v);

          if (entries.length === 0) {
            return (
              <span className="text-muted-foreground italic text-sm">
                None provided
              </span>
            );
          }

          return (
            <div className="space-y-2 w-full">
              {entries.map(([key, val]) => (
                <div
                  key={key}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-md bg-muted/50 gap-2 w-full overflow-hidden"
                >
                  <span className="font-medium capitalize text-sm flex-shrink-0">
                    {key}:
                  </span>
                  <div className="min-w-0 flex-1">
                    {typeof val === "string" && val.startsWith("http") ? (
                      <a
                        href={val}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm flex items-start gap-1 break-all"
                      >
                        <span className="break-all">{val}</span>
                        <ExternalLink className="h-3 w-3 flex-shrink-0 mt-0.5" />
                      </a>
                    ) : (
                      <span className="text-sm break-words">{String(val)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        }

        // Handle boolean values
        if (typeof value === "boolean") {
          return (
            <Badge
              variant={value ? "default" : "secondary"}
              className="text-xs sm:text-sm"
            >
              {value ? "Yes" : "No"}
            </Badge>
          );
        }

        // Handle numbers
        if (typeof value === "number") {
          return (
            <span className="font-mono text-sm sm:text-base break-all">
              {value.toLocaleString()}
            </span>
          );
        }

        // Default string handling
        return (
          <span className="text-sm sm:text-base break-words">
            {String(value)}
          </span>
        );
    }
  };

  // Group columns into sections for better organization
  const basicFields = columns.filter((col) =>
    ["title", "subtitle", "name", "email", "phone"].includes(col.key)
  );

  const mediaFields = columns.filter(
    (col) => col.type === "image" || col.key.includes("image")
  );

  const metaFields = columns.filter((col) =>
    [
      "createdAt",
      "updatedAt",
      "author",
      "views",
      "priority",
      "status",
    ].includes(col.key)
  );

  const otherFields = columns.filter(
    (col) =>
      !basicFields.includes(col) &&
      !mediaFields.includes(col) &&
      !metaFields.includes(col)
  );

  const renderFieldSection = (sectionTitle: string, fields: ColumnConfig[]) => {
    if (fields.length === 0) return null;

    return (
      <div className="space-y-3 sm:space-y-4 w-full">
        <h3 className="text-base sm:text-lg font-semibold text-foreground px-1">
          {sectionTitle}
        </h3>
        <div className="grid gap-3 sm:gap-4 w-full">
          {fields.map((column) => (
            <div key={column.key} className="space-y-2 w-full overflow-hidden">
              <Label className="text-xs sm:text-sm font-medium text-muted-foreground px-1">
                {column.label}
              </Label>
              <div className="min-h-6 w-full overflow-hidden px-1">
                {formatValue(item[column.key], column)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className,
  }) => <div className={cn("text-sm font-medium", className)}>{children}</div>;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          // Mobile-first responsive classes
          "w-[100vw] h-[95vh] sm:w-[95vw] sm:h-auto",
          "sm:max-w-3xl sm:max-h-[90vh]",
          "p-0 sm:p-6 sm:rounded-lg",
          "overflow-auto flex flex-col",
          className
        )}
      >
        {/* Header - Fixed on mobile, scrollable on desktop */}
        <DialogHeader className="flex-shrink-0 p-4 sm:p-0 space-y-2 sm:space-y-3 border-b sm:border-none bg-background">
          <DialogTitle className="text-lg sm:text-2xl leading-tight break-words pr-8 sm:pr-0">
            {title ||
              formatValue(item[columns[0]?.key], columns[0]) ||
              "Details"}
          </DialogTitle>
          {(typeof item.subtitle === "string" ||
            typeof item.subtitle === "number") && (
            <DialogDescription className="text-sm sm:text-base break-words">
              {item.subtitle}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4 sm:space-y-6 p-4 sm:p-0 sm:py-4 w-full">
            {/* Basic Information */}
            <div className="w-full">
              {renderFieldSection("Basic Information", basicFields)}
            </div>

            {basicFields.length > 0 &&
              (mediaFields.length > 0 ||
                otherFields.length > 0 ||
                metaFields.length > 0) && (
                <Separator className="my-4 sm:my-6" />
              )}

            {/* Media */}
            <div className="w-full">
              {renderFieldSection("Media", mediaFields)}
            </div>

            {mediaFields.length > 0 &&
              (otherFields.length > 0 || metaFields.length > 0) && (
                <Separator className="my-4 sm:my-6" />
              )}

            {/* Other Fields */}
            <div className="w-full">
              {renderFieldSection("Additional Information", otherFields)}
            </div>

            {otherFields.length > 0 && metaFields.length > 0 && (
              <Separator className="my-4 sm:my-6" />
            )}

            {/* Meta Information */}
            <div className="w-full">
              {renderFieldSection("Meta Information", metaFields)}
            </div>
          </div>
        </div>

        {/* Actions - Fixed at bottom on mobile */}
        {actions.length > 0 && (
          <div className="flex-shrink-0 p-4 sm:p-0 sm:pt-4 border-t bg-background">
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:justify-end w-full">
              {actions
                .filter((action) => !action.condition || action.condition(item))
                .map((action) => (
                  <Button
                    key={action.key}
                    variant={action.variant || "outline"}
                    size="sm"
                    className="flex items-center justify-center gap-2 border border-primary/50 rounded-md w-full sm:w-auto min-h-[44px] sm:min-h-[36px] text-sm"
                    onClick={() => {
                      action.onClick(item);
                      onClose();
                    }}
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
