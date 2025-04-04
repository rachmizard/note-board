import DashboardLayout from "@/app/dashboard/components/dashboard-layout";
import React from "react";

const Page = () => {
  return (
    <DashboardLayout
      breadcrumbs={[
        { href: "/dashboard", label: "Dashboard" },
        { href: "/dashboard/notes", label: "home", isCurrent: true },
      ]}
    >
      Page
    </DashboardLayout>
  );
};

export default Page;
