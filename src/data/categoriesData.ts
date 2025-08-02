import type { GenericDataItem } from "../types/dynamicTableTypes";

export interface CategoryDataItem extends GenericDataItem {
  id: string;
  name: string;
  avatar?: string;
  status: "active" | "inactive" | "blocked" | "pending";
  description?: string;
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
}

// Sample category data
export const categoriesData: CategoryDataItem[] = [
  {
    id: "cat1",
    name: "Technology",
    avatar:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=40&h=40&fit=crop&crop=face",
    status: "active",
    description: "Technology related content",
    createdAt: "2023-01-15T00:00:00Z",
    isActive: true,
  },
  {
    id: "cat2",
    name: "Design",
    avatar:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=40&h=40&fit=crop&crop=face",
    status: "active",
    description: "Design and creative content",
    createdAt: "2023-02-20T00:00:00Z",
    isActive: true,
  },
  {
    id: "cat3",
    name: "Business",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    status: "inactive",
    description: "Business and entrepreneurship",
    createdAt: "2022-11-10T00:00:00Z",
    isActive: false,
  },
  {
    id: "cat4",
    name: "Education",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    status: "active",
    description: "Educational content and resources",
    createdAt: "2023-04-05T00:00:00Z",
    isActive: true,
  },
  {
    id: "cat5",
    name: "Healthcare",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face",
    status: "pending",
    description: "Healthcare and medical content",
    createdAt: "2023-03-22T00:00:00Z",
    isActive: false,
  },
  {
    id: "cat6",
    name: "Finance",
    avatar:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=40&h=40&fit=crop&crop=face",
    status: "active",
    description: "Financial services and advice",
    createdAt: "2023-07-01T00:00:00Z",
    isActive: true,
  },
  {
    id: "cat7",
    name: "Entertainment",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face",
    status: "blocked",
    description: "Entertainment and media content",
    createdAt: "2022-12-08T00:00:00Z",
    isActive: false,
  },
  {
    id: "cat8",
    name: "Sports",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face",
    status: "active",
    description: "Sports and fitness content",
    createdAt: "2023-05-12T00:00:00Z",
    isActive: true,
  },
];
