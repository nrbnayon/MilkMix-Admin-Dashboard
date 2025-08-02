// src\app\(dashboard)\manage-post\page.tsx
import DashboardHeader from "../components/dashboard-header";
import ManagementPosts from "../components/Posts/ManagementPosts";

export default function ManagePostsPage() {
  return (
    <div>
      <DashboardHeader title="Welcome Nayon" />
      <div className="p-2 md:p-6">
        <ManagementPosts itemsPerPage={8} title="All Posts" />
      </div>
    </div>
  );
}
