"use client";
import DashboardHeader from "../components/dashboard-header";
import ProfileSettings from "../components/Settings/ProfileSettings";

export default function Profile() {
  return (
    <div>
      <DashboardHeader title="Welcome  Nayon" />
      <div className="p-2 md:p-6 border border-primary/30 rounded-2xl">
        <ProfileSettings />
      </div>
    </div>
  );
}
