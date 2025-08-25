// src\app\(dashboard)\components\Settings\SettingsSidebar.tsx
import { User, Bell, Info, FileText, ChevronRight, Lock } from "lucide-react";
import { SettingsSection } from "./SettingsLayout";

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

const settingsItems = [
  {
    id: "profile" as SettingsSection,
    label: "Profile",
    icon: User,
    description: "Manage your profile information",
  },
  {
    id: "change-password" as SettingsSection,
    label: "Change Password",
    icon: Lock,
    description: "Password and security settings",
  },
  {
    id: "notifications" as SettingsSection,
    label: "Notifications",
    icon: Bell,
    description: "Email and push notifications",
  },
  {
    id: "terms" as SettingsSection,
    label: "Terms & Privacy",
    icon: FileText,
    description: "Legal information",
  },
  {
    id: "about" as SettingsSection,
    label: "About",
    icon: Info,
    description: "App information and version",
  },
];

export default function SettingsSidebar({
  activeSection,
  onSectionChange,
}: SettingsSidebarProps) {
  return (
    <div className='bg-background rounded-lg shadow-sm border border-primary/30'>
      <div className='p-4 border-b border-primary/30'>
        <h2 className='text-lg font-semibold text-foreground'>Settings</h2>
        <p className='text-sm text-foreground/80 mt-1'>
          Manage your account and preferences
        </p>
      </div>
      <nav className='p-2 space-y-3'>
        {settingsItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                isActive
                  ? "bg-primary/40 text-blue-700 dark:text-yellow-500 border border-primary/30"
                  : "text-foreground hover:bg-primary/30 hover:border-primary/80"
              }`}
            >
              <div className='flex items-center space-x-3'>
                <Icon
                  className={`w-5 h-5 ${
                    isActive
                      ? "text-blue-700 dark:text-yellow-500"
                      : "text-foreground"
                  }`}
                />
                <div>
                  <div className='font-medium'>{item.label}</div>
                  <div className='text-xs text-foreground/80 hidden sm:block'>
                    {item.description}
                  </div>
                </div>
              </div>
              <ChevronRight
                className={`w-4 h-4 ${
                  isActive
                    ? "text-blue-700 dark:text-yellow-500"
                    : "text-foreground"
                }`}
              />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
