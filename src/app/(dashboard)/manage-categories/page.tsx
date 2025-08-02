// src\app\(dashboard)\manage-categories\page.tsx
import DashboardHeader from "../components/dashboard-header";
import ManagementCategories from "../components/Categories/ManagementCategories";

export default function ManageCategoriesPage() {
  return (
    <div>
      <DashboardHeader title="Welcome Nayon" />
      <div className="p-2 md:p-6">
        <ManagementCategories
          itemsPerPage={20}
          title="All Categories"
          buttonText="" // button not needed here
          pageUrl=""
        />
      </div>
    </div>
  );
}
