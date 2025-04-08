"use client";

import DashboardLayout from "@/app/dashboard/components/dashboard-layout";
import React, { useState } from "react";
import WidgetList from "./widgets/components/widget-list";
import { Button } from "@/shared/components/ui/button";
import { ChevronDown } from "lucide-react";
import { WidgetDialog } from "./widgets/components/dialogs/widget-dialog";

const Page = () => {
  const [widgetDialogOpen, setWidgetDialogOpen] = useState(false);

  return (
    <DashboardLayout
      breadcrumbs={[
        { href: "/dashboard", label: "Dashboard" },
        { href: "/dashboard/notes", label: "home", isCurrent: true },
      ]}
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Button variant="ghost" className="text-xl font-bold px-2 gap-2">
            Main Dashboard
            <ChevronDown className="h-5 w-5" />
          </Button>
          <Button onClick={() => setWidgetDialogOpen(true)}>Add Widget</Button>
        </div>
        <WidgetList />
      </div>
      <WidgetDialog
        open={widgetDialogOpen}
        onOpenChange={setWidgetDialogOpen}
      />
    </DashboardLayout>
  );
};

export default Page;
