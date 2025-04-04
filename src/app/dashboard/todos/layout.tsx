import React from "react";
import DashboardLayout from "../components/dashboard-layout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <DashboardLayout
      breadcrumbs={[
        { href: "/dashboard", label: "Dashboard" },
        { href: "/dashboard/todos", label: "Todo List", isCurrent: true },
      ]}
    >
      {children}
    </DashboardLayout>
  );
};
export default Layout;
