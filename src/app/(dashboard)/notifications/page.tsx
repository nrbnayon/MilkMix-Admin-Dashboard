import DashboardHeader from "../components/dashboard-header";
import Notifications from "../components/Settings/Notifications";

export default function NotificationsPage() {
  return (
    <div>
      <DashboardHeader title="Welcome" />
      <div className="p-2 md:px-6 ">
        <div className="py-2 border border-primary/30 rounded-2xl">
          <Notifications />
        </div>
      </div>
    </div>
  );
}
