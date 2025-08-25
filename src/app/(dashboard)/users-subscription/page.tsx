// src\app\(dashboard)\users-subscription\page.tsx

import DashboardHeader from "../components/dashboard-header";
import UserSubscriptions from "../components/Subscription/UserSubscriptions";

export default function ManageUserPage() {
  return (
    <div>
      <DashboardHeader title="Welcome  Nayon" />
      <div className="p-2 md:p-6">
        <h1 className="text-2xl font-bold mb-4">Manage</h1>
        <UserSubscriptions
          itemsPerPage={15}
          title="All User Subscription"
          buttonText=""
          pageUrl=""
        />
      </div>
    </div>
  );
}
