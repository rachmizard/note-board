// TODO:  REMOVE THIS FILE AND ALL USAGES IF API APPROACH IMPLEMENTED

"use client";

import React, { createContext, useContext, useState } from "react";

export interface WidgetType {
  id: string;
  name: string;
  icon: React.ReactNode;
  type: string;
  category: string;
}

interface WidgetContextType {
  widgets: WidgetType[];
  isEditing: boolean;
  addWidget: (widget: WidgetType) => void;
  setIsEditing: (isEditing: boolean) => void;
  updateWidgetOrder: (oldIndex: number, newIndex: number) => void;
}

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

export const WidgetProvider = ({ children }: { children: React.ReactNode }) => {
  const [widgets, setWidgets] = useState<WidgetType[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const addWidget = (widget: WidgetType) => {
    setWidgets((prev) => [...prev, widget]);
  };

  const updateWidgetOrder = (oldIndex: number, newIndex: number) => {
    setWidgets((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, moved);
      return updated;
    });
  };

  return (
    <WidgetContext.Provider
      value={{
        widgets,
        isEditing,
        addWidget,
        setIsEditing,
        updateWidgetOrder,
      }}
    >
      {children}
    </WidgetContext.Provider>
  );
};

export const useWidgets = () => {
  const context = useContext(WidgetContext);
  if (!context)
    throw new Error("useWidgets must be used within WidgetProvider");
  return context;
};
