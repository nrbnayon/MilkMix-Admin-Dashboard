// src\app\(dashboard)\manage-users\page.tsx
import DashboardHeader from "../components/dashboard-header";
import UserManagement from "../components/Overview/UserManagement";

export default function ManageUserPage() {
  return (
    <div>
      <DashboardHeader title="Welcome  Nayon" />
      <div className="p-2 md:p-6">
        <h1 className="text-2xl font-bold mb-4">Manage</h1>
        <UserManagement
          itemsPerPage={20}
          title="All users"
          buttonText="" // button not need to show here
          pageUrl=""
        />
      </div>
    </div>
  );
}
