import React from "react";
import { ModeToggle } from "@/shared/components/mode-toggle";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";

interface DashboardLayoutProps {
  children: React.ReactNode;
  breadcrumbs: Array<{
    href?: string;
    label: string;
    isCurrent?: boolean;
  }>;
}

export default function DashboardLayout({
  children,
  breadcrumbs,
}: DashboardLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <header className="flex justify-between items-center p-4 h-14 border-b">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {item.isCurrent ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={item.href}>
                        {item.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>

                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
        <ModeToggle />
      </header>
      <main className="flex-1 p-2">{children}</main>
    </div>
  );
}
