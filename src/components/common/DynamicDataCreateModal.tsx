"use client";
import React from "react";
import type { ReactElement } from "react";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { FormField } from "@/types/dynamicCardTypes";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface Section {
  key: string;
  title: string;
  description?: string;
  [key: string]: string | unknown;
}

interface DynamicDataCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => void;
  title: string;
  description?: string;
  fields: FormField[];
  sections?: Section[];
  initialData?: Record<string, unknown>;
  saveButtonText?: string;
  cancelButtonText?: string;
  maxImageSizeInMB?: number;
  maxImageUpload?: number;
  acceptedImageFormats?: string[];
  [key: string]: string | unknown;
}

export function DynamicDataCreateModal({
  isOpen,
  onClose,
  onSave,
  title,
  description,
  fields,
  sections = [],
  initialData = {},
  saveButtonText = "Save",
  cancelButtonText = "Cancel",
  maxImageSizeInMB = 5,
  maxImageUpload = 5,
  acceptedImageFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
}: DynamicDataCreateModalProps): ReactElement {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState<Record<string, boolean>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // FIXED: Track original images vs new uploads
  const [originalImages, setOriginalImages] = useState<
    Record<string, string[]>
  >({});

  // FIXED: Wrap isBase64DataURL in useCallback to prevent infinite re-renders
  const isBase64DataURL = useCallback((url: string): boolean => {
    return url.startsWith("data:image/");
  }, []);

  // Handle input change
  const handleInputChange = useCallback(
    (key: string, value: unknown) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      // Clear error when user starts typing
      if (errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: "" }));
      }
    },
    [errors]
  );

  // Handle drag events for image upload
  const handleDrag = useCallback((e: React.DragEvent, fieldKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive((prev) => ({ ...prev, [fieldKey]: true }));
    } else if (e.type === "dragleave") {
      setDragActive((prev) => ({ ...prev, [fieldKey]: false }));
    }
  }, []);

  // Handle drop event for image upload
  const handleDrop = useCallback(
    (e: React.DragEvent, fieldKey: string) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive((prev) => ({ ...prev, [fieldKey]: false }));
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files);
        handleMultipleImageFiles(files, fieldKey);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [maxImageUpload, formData] // Added proper dependencies
  );

  // Handle file input change for image upload
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string) => {
      e.preventDefault();
      if (e.target.files && e.target.files.length > 0) {
        const files = Array.from(e.target.files);
        handleMultipleImageFiles(files, fieldKey);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [maxImageUpload, formData] 
  );

  // Handle multiple image files
  const handleMultipleImageFiles = useCallback(
    (files: File[], fieldKey: string) => {
      const currentImages = Array.isArray(formData[fieldKey])
        ? (formData[fieldKey] as string[])
        : formData[fieldKey]
        ? [formData[fieldKey] as string]
        : [];

      const remainingSlots = maxImageUpload - currentImages.length;
      if (remainingSlots <= 0) {
        setErrors((prev) => ({
          ...prev,
          [fieldKey]: `Maximum ${maxImageUpload} images allowed`,
        }));
        return;
      }

      const filesToProcess = files.slice(0, remainingSlots);
      if (files.length > remainingSlots) {
        setErrors((prev) => ({
          ...prev,
          [fieldKey]: `Only ${remainingSlots} more image(s) can be uploaded`,
        }));
      } else {
        // Clear previous error
        setErrors((prev) => ({ ...prev, [fieldKey]: "" }));
      }

      filesToProcess.forEach((file) => {
        handleImageFile(file, fieldKey);
      });
    },
    [formData, maxImageUpload] // Added proper dependencies
  );

  // FIXED: Validate and process image file - store as File objects for new uploads
  const handleImageFile = useCallback(
    (file: File, fieldKey: string) => {
      // Validate file type
      if (!acceptedImageFormats.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [fieldKey]: `Please upload a valid image file (${acceptedImageFormats.join(
            ", "
          )})`,
        }));
        return;
      }

      // Validate file size
      if (file.size > maxImageSizeInMB * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [fieldKey]: `File size must be less than ${maxImageSizeInMB}MB`,
        }));
        return;
      }

      setUploading((prev) => ({ ...prev, [fieldKey]: true }));

      // For new uploads, create a preview URL and store the File object
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;

        // Store the base64 data URL for preview, but we'll send the File object to the parent
        setFormData((prev) => {
          const currentImages = Array.isArray(prev[fieldKey])
            ? (prev[fieldKey] as string[])
            : prev[fieldKey]
            ? [prev[fieldKey] as string]
            : [];
          const newImages = [...currentImages, result];
          return { ...prev, [fieldKey]: newImages };
        });
        setUploading((prev) => ({ ...prev, [fieldKey]: false }));
      };
      reader.onerror = () => {
        setErrors((prev) => ({ ...prev, [fieldKey]: "Error reading file" }));
        setUploading((prev) => ({ ...prev, [fieldKey]: false }));
      };
      reader.readAsDataURL(file);
    },
    [acceptedImageFormats, maxImageSizeInMB]
  );

  // Remove specific image
  const handleRemoveImage = useCallback(
    (fieldKey: string, imageIndex?: number) => {
      setFormData((prev) => {
        if (typeof imageIndex === "number") {
          // Remove specific image from array
          const currentImages = Array.isArray(prev[fieldKey])
            ? (prev[fieldKey] as string[])
            : prev[fieldKey]
            ? [prev[fieldKey] as string]
            : [];
          const newImages = currentImages.filter(
            (_, index) => index !== imageIndex
          );
          return { ...prev, [fieldKey]: newImages.length > 0 ? newImages : [] };
        } else {
          // Remove all images
          return { ...prev, [fieldKey]: [] };
        }
      });
      setErrors((prev) => ({ ...prev, [fieldKey]: "" }));
      if (fileInputRefs.current[fieldKey]) {
        fileInputRefs.current[fieldKey]!.value = "";
      }
    },
    []
  );

  // Open file dialog
  const openFileDialog = useCallback((fieldKey: string) => {
    fileInputRefs.current[fieldKey]?.click();
  }, []);

  // FIXED: Enhanced form validation
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = formData[field.key];

      // Required field validation
      if (field.required) {
        if (field.type === "image") {
          const images = Array.isArray(value) ? value : value ? [value] : [];
          const originalImagesForField = originalImages[field.key] || [];

          // Check if we have either original images or new uploads
          if (images.length === 0 && originalImagesForField.length === 0) {
            newErrors[field.key] = `${field.label} is required`;
            return;
          }
        } else if (!value || (typeof value === "string" && !value.trim())) {
          newErrors[field.key] = `${field.label} is required`;
          return;
        }
      }

      // Skip validation if field is empty and not required
      if (!value) return;

      // Type-specific validation
      if (field.validation) {
        const { minLength, maxLength, pattern, min, max } = field.validation;

        if (typeof value === "string") {
          if (minLength && value.length < minLength) {
            newErrors[
              field.key
            ] = `${field.label} must be at least ${minLength} characters`;
          }
          if (maxLength && value.length > maxLength) {
            newErrors[
              field.key
            ] = `${field.label} must be no more than ${maxLength} characters`;
          }
          if (pattern && !new RegExp(pattern).test(value)) {
            newErrors[field.key] = `${field.label} format is invalid`;
          }
        }

        if (typeof value === "number") {
          if (min !== undefined && value < min) {
            newErrors[field.key] = `${field.label} must be at least ${min}`;
          }
          if (max !== undefined && value > max) {
            newErrors[field.key] = `${field.label} must be no more than ${max}`;
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [fields, formData, originalImages]);

  // FIXED: Handle save with proper image data
  const handleSave = useCallback(() => {
    if (validateForm()) {
      // Transform formData to send the correct image data
      const transformedData = { ...formData };

      // For image fields, send the base64 data or maintain original URLs
      fields.forEach((field) => {
        if (field.type === "image" && formData[field.key]) {
          const images = Array.isArray(formData[field.key])
            ? (formData[field.key] as string[])
            : [formData[field.key] as string];

          // Send the images array (base64 for new uploads, URLs for existing)
          transformedData[field.key] = images;
        }
      });

      onSave(transformedData);
    }
  }, [formData, validateForm, onSave, fields]);

  // Handle close
  const handleClose = useCallback(() => {
    setFormData({});
    setErrors({});
    setDragActive({});
    setUploading({});
    setOriginalImages({});
    // Clear file inputs
    Object.values(fileInputRefs.current).forEach((input) => {
      if (input) input.value = "";
    });
    onClose();
  }, [onClose]);

  // Helper function to safely convert value to string
  const getStringValue = (value: unknown): string => {
    if (value === null || value === undefined) return "";
    return String(value);
  };

  // Helper function to safely convert value to number
  const getNumberValue = (value: unknown): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === "number") return value;
    const parsed = Number(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Render field based on type
  const renderField = useCallback(
    (field: FormField) => {
      const value = formData[field.key];
      const error = errors[field.key];
      const isUploading = uploading[field.key];
      const isDragActive = dragActive[field.key];

      switch (field.type) {
        case "text":
        case "email":
        case "tel":
        case "date":
        case "datetime-local":
        case "password":
        case "url":
          return (
            <Input
              type={field.type === "url" ? "text" : field.type}
              value={getStringValue(value)}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className={
                error
                  ? "border-red-500"
                  : "border-primary/30 focus-visible:border-primary rounded-md"
              }
            />
          );

        case "number":
          return (
            <Input
              type="number"
              value={getNumberValue(value)}
              onChange={(e) =>
                handleInputChange(field.key, Number(e.target.value))
              }
              placeholder={field.placeholder}
              className={
                error
                  ? "border-red-500"
                  : "border-primary/30 focus-visible:border-primary rounded-md"
              }
              min={field.validation?.min}
              max={field.validation?.max}
            />
          );

        case "textarea":
          return (
            <MDEditor
              value={getStringValue(value)}
              onChange={(val) => handleInputChange(field.key, val || "")}
              preview="edit"
              hideToolbar={false}
              visibleDragbar={false}
              data-color-mode="light"
              textareaProps={{
                placeholder:
                  field.placeholder ||
                  "Enter description with markdown support...",
                style: {
                  fontSize: 14,
                  lineHeight: 1.5,
                  fontFamily:
                    'ui-monospace,SFMono-Regular,"SF Mono",Consolas,"Liberation Mono",Menlo,monospace',
                },
              }}
              className={
                error
                  ? "border-red-500"
                  : "border border-primary/30 focus-visible:border-primary rounded-md"
              }
              height={200}
            />
          );

        case "select":
          return (
            <Select
              value={getStringValue(value)}
              onValueChange={(val) => handleInputChange(field.key, val)}
            >
              <SelectTrigger
                className={
                  error ? "border-red-500" : "border-primary/30 rounded-md"
                }
              >
                <SelectValue
                  placeholder={field.placeholder || `Select ${field.label}`}
                />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );

        case "image":
          // FIXED: Better handling of existing vs new images
          const currentImages = Array.isArray(value)
            ? (value as string[])
            : value && typeof value === "string" && value.trim() !== ""
            ? [value as string]
            : [];

          const originalImagesForField = originalImages[field.key] || [];
          const totalImages = [
            ...originalImagesForField,
            ...currentImages.filter((img) => isBase64DataURL(img)),
          ];
          const canUploadMore = totalImages.length < maxImageUpload;

          return (
            <div className="space-y-4">
              {/* Image Previews */}
              {totalImages.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">
                      {totalImages.length === 1
                        ? "Current Image"
                        : `Images (${totalImages.length}/${maxImageUpload})`}
                    </p>
                    {totalImages.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleRemoveImage(field.key);
                          setOriginalImages((prev) => ({
                            ...prev,
                            [field.key]: [],
                          }));
                        }}
                        className="text-xs h-7"
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 p-4 bg-gray-50/50 rounded-lg border">
                    {/* Show original images first */}
                    {originalImagesForField.map((imageUrl, index) => (
                      <div key={`original-${index}`} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-blue-200 shadow-sm bg-white hover:shadow-md transition-shadow">
                          <Image
                            src={imageUrl}
                            alt={`Original ${index + 1}`}
                            width={120}
                            height={120}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                            Original
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-1 -right-1 h-5 w-5 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOriginalImages((prev) => ({
                              ...prev,
                              [field.key]:
                                prev[field.key]?.filter(
                                  (_, i) => i !== index
                                ) || [],
                            }));
                          }}
                        >
                          <X className="h-2.5 w-2.5" />
                        </Button>
                      </div>
                    ))}

                    {/* Show new uploaded images */}
                    {currentImages
                      .filter((img) => isBase64DataURL(img))
                      .map((imageUrl, index) => (
                        <div key={`new-${index}`} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border-2 border-green-200 shadow-sm bg-white hover:shadow-md transition-shadow">
                            <Image
                              src={imageUrl}
                              alt={`New ${index + 1}`}
                              width={120}
                              height={120}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                            <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                              New
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-1 -right-1 h-5 w-5 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newImageIndex = currentImages
                                .filter((img) => isBase64DataURL(img))
                                .indexOf(imageUrl);
                              const allCurrentImages = currentImages.filter(
                                (img) => isBase64DataURL(img)
                              );
                              const updatedImages = allCurrentImages.filter(
                                (_, i) => i !== newImageIndex
                              );
                              const existingNonBase64 = currentImages.filter(
                                (img) => !isBase64DataURL(img)
                              );
                              handleInputChange(field.key, [
                                ...existingNonBase64,
                                ...updatedImages,
                              ]);
                            }}
                          >
                            <X className="h-2.5 w-2.5" />
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Upload Area */}
              {canUploadMore && (
                <div
                  className={cn(
                    "relative border-2 border-dashed rounded-lg transition-all duration-200",
                    isDragActive
                      ? "border-primary bg-primary/5 scale-[1.02]"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50/50",
                    isUploading && "pointer-events-none opacity-50",
                    error && "border-red-500 bg-red-50/30",
                    "cursor-pointer"
                  )}
                  onDragEnter={(e) => handleDrag(e, field.key)}
                  onDragLeave={(e) => handleDrag(e, field.key)}
                  onDragOver={(e) => handleDrag(e, field.key)}
                  onDrop={(e) => handleDrop(e, field.key)}
                  onClick={() => openFileDialog(field.key)}
                >
                  <input
                    ref={(el) => {
                      fileInputRefs.current[field.key] = el;
                    }}
                    type="file"
                    accept={acceptedImageFormats.join(",")}
                    multiple={maxImageUpload > 1}
                    onChange={(e) => handleFileChange(e, field.key)}
                    className="hidden"
                  />
                  <div className="p-8 text-center">
                    <div className="space-y-3">
                      <div className="mx-auto w-12 h-12 text-gray-400">
                        {isUploading ? (
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        ) : (
                          <Upload className="w-12 h-12" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-base font-medium text-gray-900">
                          {isUploading
                            ? "Processing images..."
                            : totalImages.length > 0
                            ? "Replace or add more images"
                            : "Upload images"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Drop files here or{" "}
                          <span className="text-primary font-medium">
                            browse
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {acceptedImageFormats
                            .map((format) => format.split("/")[1].toUpperCase())
                            .join(", ")}{" "}
                          • Max {maxImageSizeInMB}MB each
                          {totalImages.length > 0 &&
                            ` • ${
                              maxImageUpload - totalImages.length
                            } remaining`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Show message when upload limit reached */}
              {!canUploadMore && totalImages.length >= maxImageUpload && (
                <div className="text-center p-4 bg-gray-50 rounded-lg border">
                  <p className="text-sm text-gray-600">
                    Maximum {maxImageUpload} image
                    {maxImageUpload > 1 ? "s" : ""} uploaded. Remove an image to
                    add a new one.
                  </p>
                </div>
              )}
            </div>
          );

        default:
          return null;
      }
    },
    [
      formData,
      errors,
      uploading,
      dragActive,
      originalImages,
      acceptedImageFormats,
      maxImageSizeInMB,
      maxImageUpload,
      handleInputChange,
      handleDrag,
      handleDrop,
      handleFileChange,
      handleRemoveImage,
      openFileDialog,
      isBase64DataURL,
    ]
  );

  // Group fields by section
  const fieldsBySection = useMemo(() => {
    if (sections.length > 0) {
      return sections.map((section) => ({
        ...section,
        fields: fields.filter((field) => field.section === section.key),
      }));
    }
    return [{ key: "default", title: "", description: "", fields }];
  }, [sections, fields]);

  // FIXED: Better initialization of form data and original images
  useEffect(() => {
    if (isOpen && initialData && Object.keys(initialData).length > 0) {
      const newFormData = { ...initialData };
      const newOriginalImages: Record<string, string[]> = {};

      // Process image fields to separate original images from form data
      fields.forEach((field) => {
        if (field.type === "image" && initialData[field.key]) {
          const imageValue = initialData[field.key];
          if (typeof imageValue === "string" && !isBase64DataURL(imageValue)) {
            // This is an original image URL
            newOriginalImages[field.key] = [imageValue];
            // Don't include it in formData initially
            delete newFormData[field.key];
          } else if (Array.isArray(imageValue)) {
            // Handle array of images
            const originalUrls = imageValue.filter(
              (img) => typeof img === "string" && !isBase64DataURL(img)
            );
            const base64Images = imageValue.filter(
              (img) => typeof img === "string" && isBase64DataURL(img)
            );

            if (originalUrls.length > 0) {
              newOriginalImages[field.key] = originalUrls;
            }
            if (base64Images.length > 0) {
              newFormData[field.key] = base64Images;
            } else {
              delete newFormData[field.key];
            }
          }
        }
      });

      setFormData(newFormData);
      setOriginalImages(newOriginalImages);
      setErrors({});
      setDragActive({});
      setUploading({});
    } else if (isOpen) {
      // Reset everything when opening without initial data
      setFormData({});
      setOriginalImages({});
      setErrors({});
      setDragActive({});
      setUploading({});
    }
  }, [isOpen, initialData, fields, isBase64DataURL]);

  // Reset everything when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({});
      setOriginalImages({});
      setErrors({});
      setDragActive({});
      setUploading({});
      Object.values(fileInputRefs.current).forEach((input) => {
        if (input) input.value = "";
      });
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-full md:min-w-3xl max-h-[90vh] overflow-y-auto scrollbar-custom">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-6 py-4">
          {fieldsBySection.map((section) => (
            <div key={section.key} className="space-y-4">
              {section.title && (
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">{section.title}</h3>
                  {section.description && (
                    <p className="text-sm text-gray-600">
                      {section.description}
                    </p>
                  )}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.fields.map((field) => (
                  <div
                    key={field.key}
                    className={cn(
                      field.gridCol === "full"
                        ? "md:col-span-2"
                        : "md:col-span-1"
                    )}
                  >
                    <div className="space-y-2">
                      <Label htmlFor={field.key}>
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </Label>
                      {renderField(field)}
                      {errors[field.key] && (
                        <p className="text-sm text-red-600">
                          {errors[field.key]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {cancelButtonText}
          </Button>
          <Button onClick={handleSave}>{saveButtonText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
