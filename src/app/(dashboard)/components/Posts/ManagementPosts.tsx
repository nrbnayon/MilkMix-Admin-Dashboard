"use client";

import { PostDataItem, postsData } from "@/data/postsData";
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
// import { DynamicCard } from "@/components/common/DynamicCard";

interface PostManagementProps {
  itemsPerPage?: number;
  title?: string;
  buttonText?: string;
  pageUrl?: string;
}

export default function ManagementPosts({
  itemsPerPage = 12,
  title = "All Posts",
}: PostManagementProps) {
  const [posts, setPosts] = useState(postsData);
  const [isLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PostDataItem | null>(null);

  // Column Configuration for Posts
  const postColumns: ColumnConfig[] = [
    {
      key: "title",
      label: "Post Title",
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
      key: "subtitle",
      label: "Subtitle",
      sortable: false,
      searchable: true,
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
      key: "socialLinks",
      label: "Social Links",
      sortable: false,
      render: (value) => {
        const socialLinks = value as PostDataItem["socialLinks"];
        if (!socialLinks || Object.keys(socialLinks).length === 0) {
          return <span className="text-gray-400">No links</span>;
        }
        const linkCount = Object.keys(socialLinks).length;
        return (
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
              {socialLinks.facebook && (
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                  F
                </div>
              )}
              {socialLinks.linkedin && (
                <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center text-white text-xs">
                  L
                </div>
              )}
              {socialLinks.twitter && (
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">
                  X
                </div>
              )}
              {socialLinks.instagram && (
                <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center text-white text-xs">
                  I
                </div>
              )}
              {socialLinks.tiktok && (
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">
                  T
                </div>
              )}
              {socialLinks.website && (
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs">
                  W
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
      key: "author",
      label: "Author",
      sortable: true,
      searchable: true,
    },
    {
      key: "views",
      label: "Views",
      type: "number",
      sortable: true,
    },
    {
      key: "priority",
      label: "Priority",
      type: "select",
      sortable: true,
      filterable: true,
      options: [
        { value: "low", label: "Low", color: "#6b7280" },
        { value: "medium", label: "Medium", color: "#ca8a04" },
        { value: "high", label: "High", color: "#dc2626" },
      ],
    },
  ];

  // Card Configuration
  const cardConfig: CardConfig = {
    titleKey: "title",
    subtitleKey: "subtitle",
    imageKey: "image",
    descriptionKey: "description",
    statusKey: "status",
    badgeKeys: ["targetUsers", "priority"],
    metaKeys: ["createdAt", "author", "views"],
    showDetailsButton: true,
    primaryAction: {
      key: "edit",
      label: "Edit",
      variant: "outline",
      onClick: (item) => handleEditPost(item as PostDataItem),
    },
  };

  // Search Filter Configuration
  const searchFilterConfig: SearchFilterConfig = {
    searchPlaceholder: "Search posts by title, description, category...",
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
        key: "priority",
        label: "Priority",
        type: "select",
        options: [
          { value: "low", label: "Low" },
          { value: "medium", label: "Medium" },
          { value: "high", label: "High" },
        ],
      },
      {
        key: "category",
        label: "Category",
        type: "select",
        options: Array.from(
          new Set(postsData.map((post) => post.category))
        ).map((cat) => ({
          value: cat,
          label: cat,
        })),
      },
    ],
  };

  // Actions Configuration
  const postActions: ActionConfig[] = [
    {
      key: "edit",
      label: "Edit Post",
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
      onClick: (item) => handleEditPost(item as PostDataItem),
    },
    {
      key: "delete",
      label: "Delete Post",
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
      onClick: (item) => handleDeletePost(item.id),
    },
  ];

  // Form Fields Configuration
  const createFormFields: FormField[] = [
    // Basic Information Section
    {
      key: "title",
      label: "Post Title",
      type: "text",
      required: true,
      placeholder: "Enter post title",
      validation: {
        minLength: 5,
        maxLength: 100,
      },
      section: "basic",
      gridCol: "full",
    },
    {
      key: "subtitle",
      label: "Subtitle",
      type: "text",
      required: false,
      placeholder: "Enter subtitle (optional)",
      validation: {
        maxLength: 150,
      },
      section: "basic",
      gridCol: "full",
    },
    {
      key: "image",
      label: "Post Image",
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
      placeholder: "Enter post description with markdown support...",
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
      options: Array.from(new Set(postsData.map((post) => post.category))).map(
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
      key: "priority",
      label: "Priority",
      type: "select",
      required: true,
      options: [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
      ],
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
      key: "socialLinks.facebook",
      label: "Facebook",
      type: "url",
      required: false,
      placeholder: "https://facebook.com/company",
      section: "social",
      gridCol: "half",
    },
    {
      key: "socialLinks.linkedin",
      label: "LinkedIn",
      type: "url",
      required: false,
      placeholder: "https://linkedin.com/company",
      section: "social",
      gridCol: "half",
    },
    {
      key: "socialLinks.twitter",
      label: "X (Twitter)",
      type: "url",
      required: false,
      placeholder: "https://twitter.com/company",
      section: "social",
      gridCol: "half",
    },
    {
      key: "socialLinks.instagram",
      label: "Instagram",
      type: "url",
      required: false,
      placeholder: "https://instagram.com/company",
      section: "social",
      gridCol: "half",
    },
    {
      key: "socialLinks.tiktok",
      label: "TikTok",
      type: "url",
      required: false,
      placeholder: "https://tiktok.com/@company",
      section: "social",
      gridCol: "half",
    },
    {
      key: "socialLinks.website",
      label: "Website",
      type: "url",
      required: false,
      placeholder: "https://website.com",
      section: "social",
      gridCol: "half",
    },
  ];

  // Form Sections
  const createModalSections = [
    {
      key: "basic",
      title: "Basic Information",
      description: "Enter the basic details for the post",
      icon: "📝",
    },
    {
      key: "content",
      title: "Content & Media",
      description: "Add description and images for the post",
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
    const socialLinks: Record<string, string> = {};

    // Process each field
    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith("socialLinks.")) {
        // Extract social link field
        const socialKey = key.replace("socialLinks.", "");
        if (typeof value === "string" && value.trim()) {
          socialLinks[socialKey] = value.trim();
        }
      } else {
        // Regular field
        processedData[key] = value;
      }
    });

    // Add socialLinks object if there are any social links
    if (Object.keys(socialLinks).length > 0) {
      processedData.socialLinks = socialLinks;
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

  // Handle creating new post
  const handleCreatePost = (data: Record<string, unknown>) => {
    const processedData = processFormData(data);

    // Handle image - single image only for posts
    const imageValue =
      Array.isArray(processedData.image) && processedData.image.length > 0
        ? processedData.image[0]
        : typeof processedData.image === "string"
        ? processedData.image
        : "";

    const newPostData = {
      id: `post${Date.now()}`,
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
      socialLinks: processedData.socialLinks as PostDataItem["socialLinks"],
      createdAt: new Date().toISOString(),
      isActive: String(processedData.status || "draft") === "active",
      author: "Current User",
      views: 0,
      priority: String(processedData.priority || "medium") as
        | "low"
        | "medium"
        | "high",
    };

    const updatedPosts = [newPostData, ...posts];
    setPosts(updatedPosts);
    console.log("New post created:", newPostData);
  };

  // Handle editing post
  const handleEditPost = (post: PostDataItem) => {
    setEditingPost(post);
    setEditModalOpen(true);
  };

  // Handle updating post
  const handleUpdatePost = (data: Record<string, unknown>) => {
    if (!editingPost) return;

    const processedData = processFormData(data);

    // Handle image
    const imageValue =
      Array.isArray(processedData.image) && processedData.image.length > 0
        ? processedData.image[0]
        : typeof processedData.image === "string"
        ? processedData.image
        : editingPost.image;

    const updatedPostData = {
      ...editingPost,
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
      startDate: String(processedData.startDate || editingPost.startDate),
      endDate: String(processedData.endDate || editingPost.endDate),
      status: String(processedData.status || "draft") as
        | "active"
        | "inactive"
        | "draft"
        | "scheduled"
        | "expired",
      tags: processTags(processedData.tags),
      keywords: processTags(processedData.keywords),
      category: String(processedData.category || "General"),
      socialLinks: processedData.socialLinks as PostDataItem["socialLinks"],
      updatedAt: new Date().toISOString(),
      isActive: String(processedData.status || "draft") === "active",
      priority: String(processedData.priority || "medium") as
        | "low"
        | "medium"
        | "high",
    };

    const updatedPosts = posts.map((post) =>
      post.id === editingPost.id ? updatedPostData : post
    );
    setPosts(updatedPosts);
    setEditingPost(null);
    console.log("Post updated:", updatedPostData);
  };

  // Handle deleting post
  const handleDeletePost = (postId: string) => {
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts);
    console.log("Post deleted:", postId);
  };

  // Handle data change from DynamicCard3D
  const handleDataChange = (newData: GenericDataItem[]) => {
    setPosts(newData as PostDataItem[]);
  };

  // Prepare initial data for edit modal
  const getEditInitialData = () => {
    if (!editingPost) return {};

    const socialLinksData = editingPost.socialLinks || {};
    return {
      ...editingPost,
      tags: editingPost.tags?.join(", ") || "",
      keywords: editingPost.keywords?.join(", ") || "",
      "socialLinks.facebook": socialLinksData.facebook || "",
      "socialLinks.linkedin": socialLinksData.linkedin || "",
      "socialLinks.twitter": socialLinksData.twitter || "",
      "socialLinks.instagram": socialLinksData.instagram || "",
      "socialLinks.tiktok": socialLinksData.tiktok || "",
      "socialLinks.website": socialLinksData.website || "",
    };
  };

  return (
    <div className="w-full mx-auto">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-foreground text-xl font-semibold">{title}</h2>
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
          <span>Add Post</span>
        </Button>
      </div>

      {/* Dynamic 3D Card Component */}
      <DynamicCard3D
        data={posts}
        columns={postColumns}
        cardConfig={cardConfig}
        actions={postActions}
        searchFilterConfig={searchFilterConfig}
        onDataChange={handleDataChange}
        loading={isLoading}
        emptyMessage="No posts found"
        itemsPerPage={itemsPerPage}
      />

      {/* Create Post Modal */}
      <DynamicDataCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreatePost}
        title="Create New Post"
        description="Create and publish posts with rich content and social media integration"
        fields={createFormFields}
        sections={createModalSections}
        initialData={{
          status: "active",
          targetUsers: "both",
          priority: "medium",
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        }}
        saveButtonText="Create Post"
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

      {/* Edit Post Modal */}
      {editingPost && (
        <DynamicDataCreateModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingPost(null);
          }}
          onSave={handleUpdatePost}
          title="Edit Post"
          description="Update post information and settings"
          fields={createFormFields}
          sections={createModalSections}
          initialData={getEditInitialData()}
          saveButtonText="Update Post"
          cancelButtonText="Cancel"
          maxImageUpload={2}
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
