import type { GenericDataItem } from "../types/dynamicTableTypes";

export interface NewsDataItem extends GenericDataItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  targetUsers: "new" | "old" | "both";
  startDate: string;
  endDate: string;
  status: "active" | "inactive" | "draft" | "scheduled" | "expired";
  tags?: string[];
  keywords?: string[];
  category: string;
  socialLinks?: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    tiktok?: string;
    website?: string;
  };
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
  author?: string;
  views?: number;
  priority?: "low" | "medium" | "high";
}

// Sample news data
export const newsData: NewsDataItem[] = [
  {
    id: "news1",
    title: "New Product Launch Announcement",
    subtitle: "Revolutionary features that will change everything",
    description:
      "We are excited to announce the launch of our latest product with cutting-edge technology and innovative features that will revolutionize the industry.",
    image:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
    targetUsers: "both",
    startDate: "2024-01-15T00:00:00Z",
    endDate: "2024-02-15T23:59:59Z",
    status: "active",
    tags: ["product", "launch", "technology", "innovation"],
    keywords: ["new product", "launch", "technology", "features"],
    category: "Technology",
    socialLinks: {
      facebook: "https://facebook.com/company/product-launch",
      linkedin: "https://linkedin.com/company/news/product-launch",
      twitter: "https://twitter.com/company/status/product-launch",
      instagram: "https://instagram.com/company/product-launch",
    },
    createdAt: "2024-01-10T00:00:00Z",
    isActive: true,
    author: "Marketing Team",
    views: 1250,
    priority: "high",
  },
  {
    id: "news2",
    title: "Company Expansion to New Markets",
    subtitle: "Growing our presence globally",
    description:
      "Our company is expanding operations to three new international markets, bringing our services to millions of new customers worldwide.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
    targetUsers: "old",
    startDate: "2024-01-20T00:00:00Z",
    endDate: "2024-03-20T23:59:59Z",
    status: "active",
    tags: ["expansion", "global", "markets", "growth"],
    keywords: ["expansion", "international", "markets", "growth"],
    category: "Business",
    socialLinks: {
      linkedin: "https://linkedin.com/company/expansion-news",
      twitter: "https://twitter.com/company/expansion",
    },
    createdAt: "2024-01-18T00:00:00Z",
    isActive: true,
    author: "CEO Office",
    views: 890,
    priority: "medium",
  },
  {
    id: "news3",
    title: "Sustainability Initiative Launch",
    description:
      "We're committed to reducing our carbon footprint by 50% over the next two years through various sustainability initiatives and green technology adoption.",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    targetUsers: "new",
    startDate: "2024-02-01T00:00:00Z",
    endDate: "2024-04-01T23:59:59Z",
    status: "scheduled",
    tags: ["sustainability", "environment", "green", "initiative"],
    keywords: ["sustainability", "carbon footprint", "green technology"],
    category: "Environment",
    socialLinks: {
      facebook: "https://facebook.com/company/sustainability",
      instagram: "https://instagram.com/company/green-initiative",
      website: "https://company.com/sustainability",
    },
    createdAt: "2024-01-25T00:00:00Z",
    isActive: false,
    author: "Sustainability Team",
    views: 0,
    priority: "high",
  },
  {
    id: "news4",
    title: "Q4 Financial Results",
    subtitle: "Record-breaking performance",
    description:
      "Our Q4 financial results show unprecedented growth with revenue increasing by 35% compared to the previous quarter.",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
    targetUsers: "old",
    startDate: "2024-01-05T00:00:00Z",
    endDate: "2024-01-31T23:59:59Z",
    status: "expired",
    tags: ["financial", "results", "Q4", "growth"],
    keywords: ["financial results", "revenue", "growth", "Q4"],
    category: "Finance",
    socialLinks: {
      linkedin: "https://linkedin.com/company/q4-results",
      twitter: "https://twitter.com/company/financial-results",
    },
    createdAt: "2024-01-03T00:00:00Z",
    isActive: false,
    author: "Finance Team",
    views: 2100,
    priority: "medium",
  },
  {
    id: "news5",
    title: "New Partnership Announcement",
    description:
      "We're excited to announce our strategic partnership with leading industry players to enhance our service offerings and customer experience.",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop",
    targetUsers: "both",
    startDate: "2024-02-10T00:00:00Z",
    endDate: "2024-03-10T23:59:59Z",
    status: "draft",
    tags: ["partnership", "collaboration", "strategy"],
    keywords: ["partnership", "strategic", "collaboration"],
    category: "Business",
    createdAt: "2024-02-05T00:00:00Z",
    isActive: false,
    author: "Business Development",
    views: 0,
    priority: "low",
  },
  {
    id: "news6",
    title: "Employee Recognition Program",
    subtitle: "Celebrating our amazing team",
    description:
      "Introducing our new employee recognition program to celebrate outstanding contributions and achievements of our team members.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
    targetUsers: "old",
    startDate: "2024-01-25T00:00:00Z",
    endDate: "2024-12-31T23:59:59Z",
    status: "active",
    tags: ["employees", "recognition", "team", "culture"],
    keywords: ["employee recognition", "team", "achievements"],
    category: "HR",
    socialLinks: {
      linkedin: "https://linkedin.com/company/employee-recognition",
      facebook: "https://facebook.com/company/team-recognition",
    },
    createdAt: "2024-01-20T00:00:00Z",
    isActive: true,
    author: "HR Team",
    views: 650,
    priority: "medium",
  },
  {
    id: "news7",
    title: "Technology Innovation Summit",
    subtitle: "Join us for the future of tech",
    description:
      "Don't miss our annual technology innovation summit featuring keynote speakers, workshops, and networking opportunities with industry leaders.",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
    targetUsers: "new",
    startDate: "2024-03-01T00:00:00Z",
    endDate: "2024-03-03T23:59:59Z",
    status: "scheduled",
    tags: ["summit", "technology", "innovation", "event"],
    keywords: ["tech summit", "innovation", "networking", "event"],
    category: "Events",
    socialLinks: {
      facebook: "https://facebook.com/events/tech-summit-2024",
      linkedin: "https://linkedin.com/events/tech-innovation-summit",
      twitter: "https://twitter.com/company/tech-summit",
      instagram: "https://instagram.com/company/tech-summit-2024",
      website: "https://company.com/tech-summit-2024",
    },
    createdAt: "2024-02-01T00:00:00Z",
    isActive: false,
    author: "Events Team",
    views: 0,
    priority: "high",
  },
  {
    id: "news8",
    title: "Customer Success Stories",
    description:
      "Discover how our clients are achieving remarkable results using our platform and services in various industries.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop",
    targetUsers: "both",
    startDate: "2024-01-30T00:00:00Z",
    endDate: "2024-02-29T23:59:59Z",
    status: "active",
    tags: ["customers", "success", "stories", "testimonials"],
    keywords: ["customer success", "testimonials", "case studies"],
    category: "Customer Success",
    socialLinks: {
      linkedin: "https://linkedin.com/company/customer-stories",
      website: "https://company.com/success-stories",
    },
    createdAt: "2024-01-28T00:00:00Z",
    isActive: true,
    author: "Customer Success Team",
    views: 420,
    priority: "medium",
  },
];
