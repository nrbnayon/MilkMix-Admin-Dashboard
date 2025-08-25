// src/app/(dashboard)/overview/page.tsx
import StatsCard from "@/components/common/StatsCard";
import DashboardHeader from "../components/dashboard-header";
import UserManagement from "../components/Overview/UserManagement";
export default function OverviewPage() {
  return (
    <div>
      <DashboardHeader title="Welcome  Nayon" />
      <div className="p-2 md:p-6 space-y-4 md:space-y-10">
        <StatsCard />
        <UserManagement />
      </div>
    </div>
  );
}
