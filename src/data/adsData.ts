// src\data\adsData.ts
import type { GenericDataItem } from "../types/dynamicTableTypes";

export interface AdsDataItem extends GenericDataItem {
  id: string;
  title?: string;
  description?: string;
  image?: string;
  targetUsers: "new" | "old" | "both";
  startDate: string;
  endDate: string;
  status: "active" | "inactive" | "draft" | "scheduled" | "expired";
  tags?: string[];
  keywords?: string[];
  category: string;
  externalLinks?: {
    url?: string;
  };
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
  views?: number;
  author?: string;
}

// Sample ads data
export const adsData: AdsDataItem[] = [
  {
    id: "ad001",
    title: "Premium Tech Solutions for Your Business",
    description:
      "Discover cutting-edge technology solutions that will transform your business operations. Our comprehensive suite of tools helps streamline workflows, increase productivity, and drive growth. Experience the future of business technology today.",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    targetUsers: "both",
    startDate: "2025-01-01T00:00:00.000Z",
    endDate: "2025-03-31T23:59:59.000Z",
    status: "active",
    tags: ["technology", "business", "productivity", "solutions"],
    keywords: [
      "tech",
      "business solutions",
      "productivity tools",
      "enterprise",
    ],
    category: "Technology",
    externalLinks: {
      url: "https://techsolutions.example.com",
    },
    createdAt: "2025-01-15T08:30:00.000Z",
    updatedAt: "2025-01-20T10:15:00.000Z",
    isActive: true,
    views: 15420,
    author: "Marketing Team",
  },
  {
    id: "ad002",
    title: "Exclusive Fashion Collection - Limited Time Offer",
    description:
      "Step into style with our exclusive fashion collection featuring the latest trends and timeless classics. From casual wear to formal attire, find your perfect look with premium quality materials and expert craftsmanship.",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    targetUsers: "new",
    startDate: "2025-01-10T00:00:00.000Z",
    endDate: "2025-02-28T23:59:59.000Z",
    status: "active",
    tags: ["fashion", "clothing", "style", "limited offer"],
    keywords: ["fashion", "clothing", "trendy", "exclusive", "style"],
    category: "Fashion",
    externalLinks: {
      url: "https://fashionstore.example.com",
    },
    createdAt: "2025-01-10T12:00:00.000Z",
    updatedAt: "2025-01-25T14:30:00.000Z",
    isActive: true,
    views: 8750,
    author: "Fashion Team",
  },
  {
    id: "ad003",
    title: "Healthy Living Made Simple - Wellness Program",
    description:
      "Transform your lifestyle with our comprehensive wellness program. Get personalized nutrition plans, fitness routines, and mental health support from certified professionals. Start your journey to a healthier, happier you today.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    targetUsers: "old",
    startDate: "2025-01-05T00:00:00.000Z",
    endDate: "2025-04-30T23:59:59.000Z",
    status: "active",
    tags: ["health", "wellness", "fitness", "nutrition"],
    keywords: ["wellness", "health", "fitness", "nutrition", "lifestyle"],
    category: "Health & Wellness",
    externalLinks: {
      url: "https://wellnessprogram.example.com",
    },
    createdAt: "2025-01-05T09:15:00.000Z",
    updatedAt: "2025-01-18T16:45:00.000Z",
    isActive: true,
    views: 12300,
    author: "Wellness Team",
  },
  {
    id: "ad004",
    title: "Smart Home Revolution - IoT Devices Sale",
    description:
      "Experience the future of living with our smart home devices. Control your entire home from your smartphone with intelligent lighting, security systems, climate control, and entertainment systems. Save up to 40% on selected items.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    targetUsers: "both",
    startDate: "2025-01-12T00:00:00.000Z",
    endDate: "2025-03-15T23:59:59.000Z",
    status: "scheduled",
    tags: ["smart home", "IoT", "technology", "automation"],
    keywords: ["smart home", "IoT devices", "home automation", "technology"],
    category: "Smart Home",
    externalLinks: {
      url: "https://smarthome.example.com",
    },
    createdAt: "2025-01-08T11:20:00.000Z",
    updatedAt: "2025-01-22T13:10:00.000Z",
    isActive: false,
    views: 6890,
    author: "Tech Team",
  },
];
