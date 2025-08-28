// src/lib/seo/metadata.ts
import type { Metadata } from "next";

export const siteConfig = {
  name: "MilkMix Admin Dashboard",
  shortName: "MMAD",
  description: "MilkMix Admin Dashboard",
  url: "https://milk-mix-admin-dashboard-bay.vercel.app",
  ogImage: "/logo1.png",
  logo: {
    default: "/logo1.png",
    dark: "/logo1.png",
    favicon: "/favicon.ico",
    apple: "/logo1.png",
    external: "https://i.postimg.cc/Hn4Mqm9p/logo1.png",
    altText: "MilkMix Admin Dashboard",
  },
  creator: "@nrbnayon",
  author: "nayon",
  company: "Nrb Nayon",
  type: "website",
  version: "1.0.0",

  // Contact Information
  contact: {
    email: "admin@your-domain.com",
    support: "support@your-domain.com",
  },

  // Social Media Links
  links: {
    twitter: "https://twitter.com/nrbnayon",
    github: "https://github.com/nrbnayon",
  },

  // Legal Pages
  legal: {
    privacy: "/privacy-policy",
    terms: "/terms-of-service",
    cookies: "/cookie-policy",
  },

  // Features for documentation/marketing
  features: ["MilkMix Admin Dashboard"],

  keywords: ["SaaS-Based CRM Platform"],

  locale: "en_US",
  languages: ["en"],
};

// Enhanced metadata for layout.tsx
export const layoutMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.author,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.creator,
  publisher: siteConfig.company || siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.logo.altText,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.creator,
    site: siteConfig.creator,
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
    apple: [{ url: "/logo1.png", sizes: "180x180" }],
    other: [{ rel: "mask-icon", url: "/logo.svg", color: "#000000" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "saas",
  classification: "SaaS-Based CRM Platform Management Software",
  referrer: "origin-when-cross-origin",
};
