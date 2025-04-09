"use client";

import DashboardLayout from "@/app/dashboard/components/dashboard-layout";
import React from "react";
import WidgetList from "./widgets/components/widget-list";
import { WidgetProvider } from "@/app/dashboard/widgets/context/widget-context";

const Page = () => {
  return (
    <WidgetProvider>
      <DashboardLayout
        breadcrumbs={[
          { href: "/dashboard", label: "Dashboard" },
          { href: "/dashboard/notes", label: "home", isCurrent: true },
        ]}
      >
        <WidgetList />
      </DashboardLayout>
    </WidgetProvider>
  );
};

export default Page;
