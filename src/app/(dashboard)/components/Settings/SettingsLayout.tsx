// src\app\(dashboard)\components\Settings\SettingsLayout.tsx
"use client";
import { useState } from "react";
import SettingsSidebar from "./SettingsSidebar";
import ProfileSettings from "./ProfileSettings";
import Notifications from "./Notifications";
import AboutPage from "./AboutPage";
import TermsPage from "./TermsPage";
import ChangePassword from "./ChangePassword";

export type SettingsSection =
  | "profile"
  | "change-password"
  | "notifications"
  | "about"
  | "terms";

export default function SettingsLayout() {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("profile");

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSettings />;
      case "change-password":
        return <ChangePassword />;
      case "notifications":
        return <Notifications />;
      case "about":
        return <AboutPage />;
      case "terms":
        return <TermsPage />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-1/4">
        <SettingsSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>
      <div className="lg:w-3/4">
        <div className="bg-white rounded-lg shadow-sm border border-primary/30">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
