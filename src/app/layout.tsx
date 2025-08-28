// src/app/layout.tsx
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryProvider } from "@/lib/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Milk-Mix Admin Dashboard",
  description:
    "Milk-Mix Admin Dashboard - Manage your App easily and efficiently.",
  keywords:
    "MilkMix Admin Dashboard, MilkMix, Admin Panel, Dashboard, User Management, Analytics, Reports",
  robots: "index, follow",
  authors: [{ name: "Nayon Kanti Halder" }],
  openGraph: {
    title: "Milk-Mix Admin Dashboard",
    description:
      "Milk-Mix Admin Dashboard - Manage your App easily and efficiently.",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    type: "website",
    images: [
      {
        url: "https://i.ibb.co/qYkh0JjW/logo.png",
        width: 1000,
        height: 600,
        alt: "MilkMix Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Milk-Mix Admin Dashboard",
    description:
      "Milk-Mix Admin Dashboard - Manage your App easily and efficiently.",
    images: ["https://i.ibb.co/qYkh0JjW/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Canonical URL */}
        <link rel="canonical" href={process.env.NEXT_PUBLIC_BASE_URL} />

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "MilkMix Admin Dashboard",
              description:
                "MilkMix Admin Dashboard - Manage your App easily and efficiently.",
              applicationCategory: "Admin Application",
              operatingSystem: "Web",
              url: process.env.NEXT_PUBLIC_BASE_URL,
              image: "https://i.ibb.co/qYkh0JjW/logo.png",
              author: {
                "@type": "Person",
                name: "Nayon Kanti Halder",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              {children}
              <Toaster richColors position="top-center" />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>

        {/* Load Lordicon script asynchronously */}
        <Script
          src="https://cdn.lordicon.com/lordicon.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
