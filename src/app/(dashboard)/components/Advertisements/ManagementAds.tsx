// src/app/(dashboard)/components/Advertisements/ManagementAds.tsx
"use client";
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
import {
  useAdvertisements,
  useCreateAdvertisement,
  useUpdateAdvertisement,
  useDeleteAdvertisement,
} from "@/hooks/useAdvertisements";
import { Advertisement } from "@/lib/api/advertisements";
import { getProfilePictureUrl } from "@/utils/imageUtils";

interface AdsDataItem extends GenericDataItem {
  id: string; // Changed from number to string
  title: string;
  external_link: string;
  image: string;
  target_user: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

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
  const { data: apiAds, isLoading } = useAdvertisements();
  const createMutation = useCreateAdvertisement();
  const updateMutation = useUpdateAdvertisement();
  const deleteMutation = useDeleteAdvertisement();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<AdsDataItem | null>(null);

  // Transform API data to component data format
  const ads: AdsDataItem[] =
    apiAds?.map((ad: Advertisement) => ({
      id: String(ad.id),
      title: ad.title,
      external_link: ad.external_link,
      image: getProfilePictureUrl(ad.image),
      target_user: ad.target_user,
      status: ad.status,
      start_date: ad.start_date,
      end_date: ad.end_date,
      created_at: ad.created_at,
      targetUsers: ad.target_user,
      startDate: ad.start_date,
      endDate: ad.end_date,
      createdAt: ad.created_at,
      externalLinks: { url: ad.external_link },
      views: 0,
      author: "Admin",
    })) || [];

  console.log("Fetched all ads:", ads);

  // Check if we should show Add Ads button - Fixed logic
  const shouldShowAddButton = ads.length < showAds;
  console.log("Should show Add Ads button:", shouldShowAddButton, "Current ads:", ads.length, "Max ads:", showAds);

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
                  ? getProfilePictureUrl(item.image)
                  : "/placeholder.svg"
              }
              alt={String(value)}
              className="w-full h-full object-cover"
              width={48}
              height={48}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm truncate">{String(value)}</p>
          </div>
        </div>
      ),
    },
    {
      key: "external_link",
      label: "External Link",
      sortable: false,
      render: (value) => {
        const link = value as string;
        if (!link || link.trim() === "") {
          return <span className="text-gray-400">No link</span>;
        }
        return (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm truncate max-w-32 block"
          >
            {link}
          </a>
        );
      },
    },
    {
      key: "target_user",
      label: "Target Users",
      type: "select",
      sortable: true,
      filterable: true,
      options: [
        { value: "New User", label: "New Users", color: "#3b82f6", icon: "👋" },
        { value: "Old User", label: "Old Users", color: "#10b981", icon: "🤝" },
        { value: "All User", label: "All Users", color: "#8b5cf6", icon: "👥" },
      ],
    },
    {
      key: "start_date",
      label: "Start Date",
      type: "date",
      sortable: true,
      render: (value) => {
        const date = new Date(value as string);
        return date.toLocaleDateString();
      },
    },
    {
      key: "end_date",
      label: "End Date",
      type: "date",
      sortable: true,
      render: (value) => {
        const date = new Date(value as string);
        return date.toLocaleDateString();
      },
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      sortable: true,
      filterable: true,
      options: [
        { value: "Active", label: "Active", color: "#16a34a" },
        { value: "Inactive", label: "Inactive", color: "#ca8a04" },
        { value: "Draft", label: "Draft", color: "#6b7280" },
        { value: "Scheduled", label: "Scheduled", color: "#3b82f6" },
        { value: "Expired", label: "Expired", color: "#dc2626" },
      ],
    },
    {
      key: "created_at",
      label: "Created At",
      type: "date",
      sortable: true,
      render: (value) => {
        const date = new Date(value as string);
        return date.toLocaleDateString();
      },
    },
  ];

  // Card Configuration
  const cardConfig: CardConfig = {
    titleKey: "title",
    imageKey: "image",
    statusKey: "status",
    badgeKeys: ["target_user"],
    metaKeys: ["created_at"],
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
    searchPlaceholder: "Search ads by title, status...",
    searchKeys: ["title", "status", "target_user"],
    enableSort: true,
    sortOptions: [
      { key: "title", label: "Title" },
      { key: "created_at", label: "Created Date" },
      { key: "start_date", label: "Start Date" },
    ],
    filters: [
      {
        key: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "Active", label: "Active" },
          { value: "Inactive", label: "Inactive" },
          { value: "Draft", label: "Draft" },
          { value: "Scheduled", label: "Scheduled" },
          { value: "Expired", label: "Expired" },
        ],
      },
      {
        key: "target_user",
        label: "Target Users",
        type: "select",
        options: [
          { value: "New User", label: "New Users" },
          { value: "Old User", label: "Old Users" },
          { value: "All User", label: "All Users" },
        ],
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
      onClick: (item) => handleDeleteAd(Number(item.id)), // Convert back to number for API
    },
  ];

  // Form Fields Configuration
  const createFormFields: FormField[] = [
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
      required: false,
      section: "basic",
      gridCol: "full",
    },
    {
      key: "external_link",
      label: "External Link",
      type: "url",
      required: false,
      placeholder: "https://example.com",
      section: "basic",
      gridCol: "full",
    },
    {
      key: "target_user",
      label: "Target Users",
      type: "select",
      required: false,
      options: [
        { value: "New User", label: "New Users" },
        { value: "Old User", label: "Old Users" },
        { value: "All User", label: "All Users" },
      ],
      section: "targeting",
      gridCol: "half",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      required: false,
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
        { value: "Draft", label: "Draft" },
        { value: "Scheduled", label: "Scheduled" },
      ],
      section: "targeting",
      gridCol: "half",
    },
    {
      key: "start_date",
      label: "Start Date",
      type: "datetime-local",
      required: false,
      section: "targeting",
      gridCol: "half",
    },
    {
      key: "end_date",
      label: "End Date",
      type: "datetime-local",
      required: false,
      section: "targeting",
      gridCol: "half",
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
      key: "targeting",
      title: "Targeting & Scheduling",
      description: "Configure target audience and publication schedule",
      icon: "🎯",
    },
  ];

  // Handle creating new ad
  const handleCreateAd = async (data: Record<string, unknown>) => {
    try {
      console.log("Creating ad with data:", data);
      
      const imageFile =
        Array.isArray(data.image) && data.image.length > 0
          ? (data.image[0] as File)
          : (data.image as File);

      if (!imageFile || !(imageFile instanceof File)) {
        console.error("No valid image file provided");
        return;
      }

      const createData = {
        title: String(data.title || ""),
        external_link: String(data.external_link || ""),
        image: imageFile,
        target_user: String(data.target_user || "All User"),
        status: String(data.status || "Draft"),
        start_date: new Date(data.start_date as string).toISOString(),
        end_date: new Date(data.end_date as string).toISOString(),
      };

      console.log("Sending create data:", createData);

      await createMutation.mutateAsync(createData);
      setCreateModalOpen(false);
      console.log("Advertisement created successfully");
    } catch (error) {
      console.error("Failed to create advertisement:", error);
    }
  };

  // Handle editing ad
  const handleEditAd = (ad: AdsDataItem) => {
    console.log("Editing ad:", ad);
    setEditingAd(ad);
    setEditModalOpen(true);
  };

  // Handle updating ad
  const handleUpdateAd = async (data: Record<string, unknown>) => {
    if (!editingAd) return;

    try {
      console.log("Updating ad with data:", data);
      console.log("Current editing ad:", editingAd);

      const updateData: Record<string, unknown> = {};

      // Only include fields that have changed
      if (data.title && data.title !== editingAd.title) {
        updateData.title = String(data.title);
      }
      if (data.external_link && data.external_link !== editingAd.external_link) {
        updateData.external_link = String(data.external_link);
      }
      if (data.target_user && data.target_user !== editingAd.target_user) {
        updateData.target_user = String(data.target_user);
      }
      if (data.status && data.status !== editingAd.status) {
        updateData.status = String(data.status);
      }
      if (data.start_date) {
        updateData.start_date = new Date(data.start_date as string).toISOString();
      }
      if (data.end_date) {
        updateData.end_date = new Date(data.end_date as string).toISOString();
      }

      // Handle image update
      if (data.image) {
        const imageFile =
          Array.isArray(data.image) && data.image.length > 0
            ? (data.image[0] as File)
            : (data.image as File);

        if (imageFile instanceof File) {
          updateData.image = imageFile;
        }
      }

      console.log("Sending update data:", updateData);

      await updateMutation.mutateAsync({
        id: Number(editingAd.id), // Convert back to number for API
        data: updateData,
      });
      
      setEditModalOpen(false);
      setEditingAd(null);
      console.log("Advertisement updated successfully");
    } catch (error) {
      console.error("Failed to update advertisement:", error);
    }
  };

  // Handle deleting ad
  const handleDeleteAd = async (adId: number) => {
    try {
      console.log("Deleting ad with id:", adId);
      await deleteMutation.mutateAsync(adId);
      console.log("Advertisement deleted successfully");
    } catch (error) {
      console.error("Failed to delete advertisement:", error);
    }
  };

  // Prepare initial data for edit modal
  const getEditInitialData = () => {
    if (!editingAd) return {};

    return {
      title: editingAd.title,
      image: getProfilePictureUrl(editingAd.image),
      external_link: editingAd.external_link,
      target_user: editingAd.target_user,
      status: editingAd.status,
      start_date: new Date(editingAd.start_date).toISOString().slice(0, 16),
      end_date: new Date(editingAd.end_date).toISOString().slice(0, 16),
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
        loading={
          isLoading ||
          createMutation.isPending ||
          updateMutation.isPending ||
          deleteMutation.isPending
        }
        emptyMessage="No ads found"
        itemsPerPage={itemsPerPage}
      />

      {/* Create Ad Modal */}
      <DynamicDataCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateAd}
        title="Create New Ad"
        description="Create and publish ads with rich content"
        fields={createFormFields}
        sections={createModalSections}
        initialData={{
          status: "Active",
          target_user: "All User",
          start_date: new Date().toISOString().slice(0, 16),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 16),
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