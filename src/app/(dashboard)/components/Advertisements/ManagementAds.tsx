// src\app\(dashboard)\components\Advertisements\ManagementAds.tsx
"use client";
import { adsData, AdsDataItem } from "@/data/adsData";
import { useState } from "react";
import type {
  GenericDataItem,
  ColumnConfig,
  ActionConfig,
  CardConfig,
  FormField,
  SearchFilterConfig,
} from "@/types/dynamicCardTypes";
import { DynamicCard3D } from "@/components/common/DynamicCard3D";
import { DynamicDataCreateModal } from "@/components/common/DynamicDataCreateModal";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Lordicon from "@/components/lordicon/lordicon-wrapper";

interface AdsManagementProps {
  itemsPerPage?: number;
  title?: string;
  buttonText?: string;
  pageUrl?: string;
  showAds?: number;
}

export default function ManagementAds({
  itemsPerPage = 12,
  title = "All Ads",
  showAds = 4,
}: AdsManagementProps) {
  const [ads, setAds] = useState(adsData);
  const [isLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<AdsDataItem | null>(null);

  // Check if we should show Add Ads button
  const shouldShowAddButton = ads.length < showAds;

  // Column Configuration for Ads
  const adsColumns: ColumnConfig[] = [
    {
      key: "title",
      label: "Ad Title",
      sortable: true,
      searchable: true,
      align: "left",
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={
                typeof item.image === "string" && item.image.trim() !== ""
                  ? item.image
                  : "/placeholder.svg?height=48&width=48"
              }
              alt={String(value)}
              className="w-full h-full object-cover"
              width={48}
              height={48}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm truncate">{String(value)}</p>
            {typeof item.subtitle === "string" && item.subtitle && (
              <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      type: "textarea",
      sortable: false,
      searchable: true,
    },
    {
      key: "image",
      label: "Image",
      type: "image",
      sortable: false,
    },
    {
      key: "targetUsers",
      label: "Target Users",
      type: "select",
      sortable: true,
      filterable: true,
      options: [
        { value: "new", label: "New Users", color: "#3b82f6", icon: "👋" },
        { value: "old", label: "Old Users", color: "#10b981", icon: "🤝" },
        { value: "both", label: "All Users", color: "#8b5cf6", icon: "👥" },
      ],
    },
    {
      key: "startDate",
      label: "Start Date",
      type: "date",
      sortable: true,
    },
    {
      key: "endDate",
      label: "End Date",
      type: "date",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      sortable: true,
      filterable: true,
      options: [
        { value: "active", label: "Active", color: "#16a34a" },
        { value: "inactive", label: "Inactive", color: "#ca8a04" },
        { value: "draft", label: "Draft", color: "#6b7280" },
        { value: "scheduled", label: "Scheduled", color: "#3b82f6" },
        { value: "expired", label: "Expired", color: "#dc2626" },
      ],
    },
    {
      key: "tags",
      label: "Tags",
      sortable: false,
      searchable: true,
    },
    {
      key: "keywords",
      label: "Keywords",
      sortable: false,
      searchable: true,
    },
    {
      key: "category",
      label: "Category",
      type: "select",
      sortable: true,
      filterable: true,
    },
    {
      key: "externalLinks",
      label: "External Link",
      sortable: false,
      render: (value) => {
        const externalLinks = value as AdsDataItem["externalLinks"];
        if (!externalLinks || Object.keys(externalLinks).length === 0) {
          return <span className="text-gray-400">No links</span>;
        }
        const linkCount = Object.keys(externalLinks).length;
        return (
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
              {externalLinks.url && (
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                  🌍
                </div>
              )}
            </div>
            <span className="text-xs text-gray-500 ml-1">{linkCount}</span>
          </div>
        );
      },
    },
    {
      key: "createdAt",
      label: "Created At",
      type: "date",
      sortable: true,
    },
    {
      key: "views",
      label: "Views",
      type: "number",
      sortable: true,
    },
  ];

  // Card Configuration
  const cardConfig: CardConfig = {
    titleKey: "title",
    imageKey: "image",
    descriptionKey: "description",
    statusKey: "status",
    badgeKeys: ["targetUsers"],
    metaKeys: ["createdAt", "author", "views"],
    showDetailsButton: true,
    primaryAction: {
      key: "edit",
      label: "Edit",
      variant: "outline",
      onClick: (item) => handleEditAd(item as AdsDataItem),
    },
  };

  // Search Filter Configuration
  const searchFilterConfig: SearchFilterConfig = {
    searchPlaceholder: "Search ads by title, description, category...",
    searchKeys: [
      "title",
      "subtitle",
      "description",
      "category",
      "author",
      "tags",
      "keywords",
    ],
    enableSort: true,
    sortOptions: [
      { key: "title", label: "Title" },
      { key: "createdAt", label: "Created Date" },
      { key: "startDate", label: "Start Date" },
      { key: "views", label: "Views" },
    ],
    filters: [
      {
        key: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
          { value: "draft", label: "Draft" },
          { value: "scheduled", label: "Scheduled" },
          { value: "expired", label: "Expired" },
        ],
      },
      {
        key: "targetUsers",
        label: "Target Users",
        type: "select",
        options: [
          { value: "new", label: "New Users" },
          { value: "old", label: "Old Users" },
          { value: "both", label: "All Users" },
        ],
      },
      {
        key: "category",
        label: "Category",
        type: "select",
        options: Array.from(new Set(adsData.map((ad) => ad.category))).map(
          (cat) => ({
            value: cat,
            label: cat,
          })
        ),
      },
    ],
  };

  // Actions Configuration
  const adActions: ActionConfig[] = [
    {
      key: "edit",
      label: "Edit Ad",
      icon: (
        <Lordicon
          src="https://cdn.lordicon.com/cbtlerlm.json"
          trigger="hover"
          size={16}
          className="mt-1"
          colors={{
            primary: "#9ca3af",
            secondary: "",
          }}
          stroke={4}
        />
      ),
      variant: "ghost",
      onClick: (item) => handleEditAd(item as AdsDataItem),
    },
    {
      key: "delete",
      label: "Delete Ad",
      icon: (
        <Lordicon
          src="https://cdn.lordicon.com/jmkrnisz.json"
          trigger="hover"
          size={16}
          className="mt-1"
          colors={{
            primary: "#FF0000",
            secondary: "#FFFFFF",
          }}
          stroke={4}
        />
      ),
      variant: "ghost",
      onClick: (item) => handleDeleteAd(item.id),
    },
  ];

  // Form Fields Configuration
  const createFormFields: FormField[] = [
    // Basic Information Section
    {
      key: "title",
      label: "Ad Title",
      type: "text",
      required: true,
      placeholder: "Enter ad title",
      validation: {
        minLength: 5,
        maxLength: 100,
      },
      section: "basic",
      gridCol: "full",
    },
    {
      key: "image",
      label: "Ad Image",
      type: "image",
      required: true,
      section: "basic",
      gridCol: "full",
    },
    // Content Section
    {
      key: "description",
      label: "Description",
      type: "textarea",
      required: true,
      placeholder: "Enter ad description with markdown support...",
      section: "content",
      gridCol: "full",
    },
    // Targeting Section
    {
      key: "targetUsers",
      label: "Target Users",
      type: "select",
      required: true,
      options: [
        { value: "new", label: "New Users" },
        { value: "old", label: "Old Users" },
        { value: "both", label: "All Users" },
      ],
      section: "targeting",
      gridCol: "half",
    },
    {
      key: "category",
      label: "Category",
      type: "select",
      required: true,
      options: Array.from(new Set(adsData.map((ad) => ad.category))).map(
        (cat) => ({
          value: cat,
          label: cat,
        })
      ),
      section: "targeting",
      gridCol: "half",
    },
    {
      key: "startDate",
      label: "Start Date",
      type: "date",
      required: true,
      section: "targeting",
      gridCol: "half",
    },
    {
      key: "endDate",
      label: "End Date",
      type: "date",
      required: true,
      section: "targeting",
      gridCol: "half",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { value: "active", label: "Active" },
        { value: "draft", label: "Draft" },
        { value: "scheduled", label: "Scheduled" },
        { value: "inactive", label: "Inactive" },
      ],
      section: "targeting",
      gridCol: "half",
    },
    // SEO Section
    {
      key: "tags",
      label: "Tags",
      type: "text",
      required: false,
      placeholder:
        "Enter tags separated by commas (e.g., technology, innovation)",
      section: "seo",
      gridCol: "full",
      helpText: "Separate multiple tags with commas",
    },
    {
      key: "keywords",
      label: "Keywords",
      type: "text",
      required: false,
      placeholder: "Enter keywords separated by commas for SEO",
      section: "seo",
      gridCol: "full",
      helpText: "Separate multiple keywords with commas",
    },
    // Social Links Section - Fixed with proper field names
    {
      key: "externalLinks.url",
      label: "External Link",
      type: "url",
      required: false,
      placeholder: "https://website.com/company",
      section: "social",
      gridCol: "full",
    },
  ];

  // Form Sections
  const createModalSections = [
    {
      key: "basic",
      title: "Basic Information",
      description: "Enter the basic details for the ad",
      icon: "📝",
    },
    {
      key: "content",
      title: "Content & Media",
      description: "Add description and images for the ad",
      icon: "🎨",
    },
    {
      key: "targeting",
      title: "Targeting & Scheduling",
      description: "Configure target audience and publication schedule",
      icon: "🎯",
    },
    {
      key: "seo",
      title: "SEO & Tags",
      description: "Add tags and keywords for better discoverability",
      icon: "🔍",
      collapsible: true,
      defaultCollapsed: true,
    },
    {
      key: "social",
      title: "Social & External Links",
      description: "Add social media and external links (optional)",
      icon: "🔗",
      collapsible: true,
      defaultCollapsed: true,
    },
  ];

  // Utility function to process form data and extract social links
  const processFormData = (data: Record<string, unknown>) => {
    const processedData: Record<string, unknown> = {};
    const externalLinks: Record<string, string> = {};

    // Process each field
    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith("externalLinks.")) {
        // Extract social link field
        const socialKey = key.replace("externalLinks.", "");
        if (typeof value === "string" && value.trim()) {
          externalLinks[socialKey] = value.trim();
        }
      } else {
        // Regular field
        processedData[key] = value;
      }
    });

    // Add externalLinks object if there are any social links
    if (Object.keys(externalLinks).length > 0) {
      processedData.externalLinks = externalLinks;
    }

    return processedData;
  };

  // Utility function to process tags and keywords
  const processTags = (value: unknown): string[] => {
    if (typeof value === "string" && value.trim()) {
      return value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    }
    return [];
  };

  // Handle creating new ad
  const handleCreateAd = (data: Record<string, unknown>) => {
    const processedData = processFormData(data);

    // Handle image - single image only for ads
    const imageValue =
      Array.isArray(processedData.image) && processedData.image.length > 0
        ? processedData.image[0]
        : typeof processedData.image === "string"
        ? processedData.image
        : "";

    const newAdData = {
      id: `ad${Date.now()}`,
      title: String(processedData.title || ""),
      subtitle: processedData.subtitle
        ? String(processedData.subtitle)
        : undefined,
      description: String(processedData.description || ""),
      image:
        imageValue ||
        `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop`,
      targetUsers: String(processedData.targetUsers || "both") as
        | "new"
        | "old"
        | "both",
      startDate: String(processedData.startDate || new Date().toISOString()),
      endDate: String(
        processedData.endDate ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      ),
      status: String(processedData.status || "draft") as
        | "active"
        | "inactive"
        | "draft"
        | "scheduled"
        | "expired",
      tags: processTags(processedData.tags),
      keywords: processTags(processedData.keywords),
      category: String(processedData.category || "General"),
      externalLinks:
        processedData.externalLinks as AdsDataItem["externalLinks"],
      createdAt: new Date().toISOString(),
      isActive: String(processedData.status || "draft") === "active",
      author: "Current User",
      views: 0,
    };

    const updatedAds = [newAdData, ...ads];
    setAds(updatedAds);
    console.log("New ad created:", newAdData);
  };

  // Handle editing ad
  const handleEditAd = (ad: AdsDataItem) => {
    setEditingAd(ad);
    setEditModalOpen(true);
  };

  // Handle updating ad
  const handleUpdateAd = (data: Record<string, unknown>) => {
    if (!editingAd) return;

    const processedData = processFormData(data);

    // Handle image
    const imageValue =
      Array.isArray(processedData.image) && processedData.image.length > 0
        ? processedData.image[0]
        : typeof processedData.image === "string"
        ? processedData.image
        : editingAd.image;

    const updatedAdData = {
      ...editingAd,
      title: String(processedData.title || ""),
      subtitle: processedData.subtitle
        ? String(processedData.subtitle)
        : undefined,
      description: String(processedData.description || ""),
      image: imageValue,
      targetUsers: String(processedData.targetUsers || "both") as
        | "new"
        | "old"
        | "both",
      startDate: String(processedData.startDate || editingAd.startDate),
      endDate: String(processedData.endDate || editingAd.endDate),
      status: String(processedData.status || "draft") as
        | "active"
        | "inactive"
        | "draft"
        | "scheduled"
        | "expired",
      tags: processTags(processedData.tags),
      keywords: processTags(processedData.keywords),
      category: String(processedData.category || "General"),
      externalLinks:
        processedData.externalLinks as AdsDataItem["externalLinks"],
      updatedAt: new Date().toISOString(),
      isActive: String(processedData.status || "draft") === "active",
    };

    const updatedAds = ads.map((ad) =>
      ad.id === editingAd.id ? updatedAdData : ad
    );
    setAds(updatedAds);
    setEditingAd(null);
    console.log("Ad updated:", updatedAdData);
  };

  // Handle deleting ad
  const handleDeleteAd = (adId: string) => {
    const updatedAds = ads.filter((ad) => ad.id !== adId);
    setAds(updatedAds);
    console.log("Ad deleted:", adId);
  };

  // Handle data change from DynamicCard3D
  const handleDataChange = (newData: GenericDataItem[]) => {
    setAds(newData as AdsDataItem[]);
  };

  // Prepare initial data for edit modal
  const getEditInitialData = () => {
    if (!editingAd) return {};

    const externalLinksData = editingAd.externalLinks || {};
    return {
      ...editingAd,
      tags: editingAd.tags?.join(", ") || "",
      keywords: editingAd.keywords?.join(", ") || "",
      "externalLinks.url": externalLinksData.url || "",
    };
  };

  return (
    <div className="w-full mx-auto">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-foreground text-xl font-semibold">{title}</h2>
        {shouldShowAddButton && (
          <Button
            className="flex items-center gap-2 border-primary/30 rounded-md"
            size="lg"
            onClick={() => setCreateModalOpen(true)}
          >
            <span className="mt-1.5">
              <Lordicon
                src="https://cdn.lordicon.com/ueoydrft.json"
                trigger="hover"
                size={20}
                colors={{
                  primary: "",
                  secondary: "",
                }}
                stroke={1}
              />
            </span>
            <span>Add Ads</span>
          </Button>
        )}
      </div>

      {/* Dynamic 3D Card Component */}
      <DynamicCard3D
        data={ads}
        columns={adsColumns}
        cardConfig={cardConfig}
        actions={adActions}
        searchFilterConfig={searchFilterConfig}
        onDataChange={handleDataChange}
        loading={isLoading}
        emptyMessage="No ads found"
        itemsPerPage={itemsPerPage}
      />

      {/* Create Ad Modal */}
      <DynamicDataCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateAd}
        title="Create New Ad"
        description="Create and publish ads with rich content and social media integration"
        fields={createFormFields}
        sections={createModalSections}
        initialData={{
          status: "active",
          targetUsers: "both",
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        }}
        saveButtonText="Create Ad"
        cancelButtonText="Cancel"
        maxImageSizeInMB={5}
        maxImageUpload={1}
        acceptedImageFormats={[
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ]}
      />

      {/* Edit Ad Modal */}
      {editingAd && (
        <DynamicDataCreateModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingAd(null);
          }}
          onSave={handleUpdateAd}
          title="Edit Ad"
          description="Update ad information and settings"
          fields={createFormFields}
          sections={createModalSections}
          initialData={getEditInitialData()}
          saveButtonText="Update Ad"
          cancelButtonText="Cancel"
          maxImageUpload={1}
          maxImageSizeInMB={5}
          acceptedImageFormats={[
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
          ]}
        />
      )}
    </div>
  );
}
