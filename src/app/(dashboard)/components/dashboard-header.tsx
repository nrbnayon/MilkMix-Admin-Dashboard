// src/components/dashboard/dashboard-header.tsx
"use client";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { cn } from "@/lib/utils";
import Lordicon from "@/components/lordicon/lordicon-wrapper";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

type UserProfile = {
  name?: string;
  // add other fields if needed
};

type User = {
  user_profile?: UserProfile;
  // add other fields if needed
};

export default function DashboardHeader({
  title = "Welcome",
  subtitle = "",
}: {
  title?: string;
  subtitle?: string;
}) {
  const { user } = useAuth() as { user?: User };

  console.log("DashboardHeader user:", user);

  return (
    <header
      className={cn(
        "md:sticky top-0 z-50 p-2 md:p-4 w-full transition-all duration-200bg-white/10 dark:bg-background/10 backdrop-blur-3xl"
      )}
    >
      <div className=" mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">
              {user ? `Welcome ${user.user_profile?.name}` : title}
            </h1>
            {subtitle && (
              <h3 className="text-sm md:text-base font-medium">{subtitle}</h3>
            )}
          </div>
          {/* Mobile Navigation */}
          <div className="flex items-center cursor-pointer space-x-2">
            <ModeToggle />
            {/* <Bell className='hover:ring-1 cursor-pointer hover:ring-success w-8 h-8 font-bold p-1 rounded-full' /> */}
            <Link
              href="/notifications"
              className="hover:ring-1 cursor-pointer hover:ring-success w-8 h-8 font-bold p-1 rounded-full"
            >
              <Lordicon
                src="https://cdn.lordicon.com/ndydpcaq.json"
                trigger="loop-on-hover"
                colors={{ primary: "#3b82f6" }}
                stroke={3}
                size={26}
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
