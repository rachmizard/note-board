"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, ChevronDown, Plus, PencilRuler } from "lucide-react";
import { useWidgets, WidgetType } from "../context/widget-context";
import { Button } from "@/shared/components/ui/button";
import { WidgetDialog } from "./dialogs/widget-dialog";
import { DashboardDialog } from "./dialogs/dashboard-dialog";
import "../styles/react-grid.css";
import { WidgetGrid } from "@/shared/components/widget-grid";
import { WidgetItem } from "@/shared/components/widget-item";

interface Dashboard {
  id: string;
  name: string;
  emoji?: string;
}

// Sample dashboards data - in a real app, this would come from your backend or context
const WidgetList: React.FC = () => {
  const { widgets, isEditing, setIsEditing, updateWidgetLayout, deleteWidget } =
    useWidgets();
  const [widgetDialogOpen, setWidgetDialogOpen] = useState(false);
  const [dashboardDialogOpen, setDashboardDialogOpen] = useState(false);
  const [selectedDashboard, setSelectedDashboard] = useState("dashboard-1");
  const [currentDashboardName, setCurrentDashboardName] =
    useState("Main Dashboard");
  const [currentDashboardEmoji, setCurrentDashboardEmoji] = useState<
    string | undefined
  >("📊");
  const [dashboards, setDashboards] = useState<Dashboard[]>([
    { id: "dashboard-1", name: "Main Dashboard", emoji: "📊" },
    { id: "dashboard-2", name: "Project Timeline", emoji: "📅" },
    { id: "dashboard-3", name: "Analytics Overview", emoji: "📈" },
  ]);

  const handleLayoutChange = (newLayout: any) => {
    updateWidgetLayout(newLayout);
  };

  const renderWidget = (widget: WidgetType) => {
    return (
      <WidgetItem
        id={widget.id}
        name={widget.name}
        icon={widget.icon}
        isEditing={isEditing}
        onDelete={deleteWidget}
      />
    );
  };

  const handleDashboardSelect = (dashboardId: string) => {
    setSelectedDashboard(dashboardId);
    const selectedDash = dashboards.find((d) => d.id === dashboardId);
    if (selectedDash) {
      setCurrentDashboardName(selectedDash.name);
      setCurrentDashboardEmoji(selectedDash.emoji);
    }
    // In a real app, you would fetch widgets for the selected dashboard here
  };

  const handleCreateNewDashboard = (title: string, emoji?: string) => {
    // Generate a new ID for the dashboard
    const newId = `dashboard-${Date.now()}`;

    // Create a new dashboard object
    const newDashboard: Dashboard = {
      id: newId,
      name: title,
      emoji: emoji,
    };

    // Update dashboards list
    setDashboards([...dashboards, newDashboard]);

    // Select the new dashboard
    setSelectedDashboard(newId);
    setCurrentDashboardName(title);
    setCurrentDashboardEmoji(emoji);

    // In a real app, you would save this to your backend
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          className="text-xl font-bold px-2 gap-2"
          onClick={() => setDashboardDialogOpen(true)}
        >
          {currentDashboardEmoji && (
            <span className="text-xl mr-1">{currentDashboardEmoji}</span>
          )}
          {currentDashboardName}
          <ChevronDown className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant={isEditing ? "destructive" : "outline"}
            onClick={() => setIsEditing(!isEditing)}
            size="icon"
          >
            <PencilRuler className="h-4 w-4" />
          </Button>
          <Button onClick={() => setWidgetDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Widget
          </Button>
        </div>
      </div>

      {widgets.length === 0 ? (
        <div className="h-[calc(100vh-12rem)] w-full">
          <motion.div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <LayoutDashboard className="w-12 h-12 text-accent" />
            <p className="text-gray-500">No widgets added yet</p>
          </motion.div>
        </div>
      ) : (
        <div className="h-[calc(100vh-12rem)] w-full">
          <WidgetGrid
            items={widgets}
            isDraggable={isEditing}
            isResizable={isEditing}
            onLayoutChange={handleLayoutChange}
            renderItem={renderWidget}
          />
        </div>
      )}

      <WidgetDialog
        open={widgetDialogOpen}
        onOpenChange={setWidgetDialogOpen}
      />

      <DashboardDialog
        open={dashboardDialogOpen}
        onOpenChange={setDashboardDialogOpen}
        dashboards={dashboards}
        selectedDashboard={selectedDashboard}
        onSelect={handleDashboardSelect}
        onCreateNew={handleCreateNewDashboard}
      />
    </div>
  );
};

export default WidgetList;
