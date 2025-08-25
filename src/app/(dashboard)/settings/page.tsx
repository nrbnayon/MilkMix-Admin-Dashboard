// src\app\(dashboard) \settings\page.tsx
import DashboardHeader from "../components/dashboard-header";
import SettingsLayout from "../components/Settings/SettingsLayout";

export default function SettingsPage() {
  return (
    <div>
      <DashboardHeader title="Settings" />
      <div className="p-2 md:px-6 py-2">
        <SettingsLayout />
      </div>
    </div>
  );
}
