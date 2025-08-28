// src\app\(dashboard)\manage-ads\page.tsx
import DashboardHeader from "../components/dashboard-header";
import ManagementAds from "../components/Advertisements/ManagementAds";

export default function ManageAdsPage() {
  return (
    <div>
      <DashboardHeader title="Welcome" />
      <div className="p-2 md:p-6">
        <ManagementAds itemsPerPage={4} showAds={4  } title="Advertisements" />
      </div>
    </div>
  );
}
