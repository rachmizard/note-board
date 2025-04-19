// TODO:  REMOVE THIS FILE AND ALL USAGES IF API APPROACH IMPLEMENTED

"use client";

import React, { createContext, useContext, useState } from "react";

export interface WidgetType {
  id: string;
  name: string;
  icon: React.ReactNode;
  type: string;
  category: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface WidgetContextType {
  widgets: WidgetType[];
  isEditing: boolean;
  addWidget: (widget: WidgetType) => void;
  setIsEditing: (isEditing: boolean) => void;
  updateWidgetOrder: (oldIndex: number, newIndex: number) => void;
  deleteWidget: (id: string) => void;
  updateWidgetLayout: (
    layouts: Array<{ i: string; x: number; y: number; w: number; h: number }>
  ) => void;
}

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

export const WidgetProvider = ({ children }: { children: React.ReactNode }) => {
  const [widgets, setWidgets] = useState<WidgetType[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const addWidget = (widget: Omit<WidgetType, "x" | "y" | "w" | "h">) => {
    const newWidget: WidgetType = {
      ...widget,
      x: (widgets.length % 2) * 6,
      y: Math.floor(widgets.length / 2),
      w: 6,
      h: 4,
    };
    setWidgets((prev) => [...prev, newWidget]);
  };
  const updateWidgetOrder = (oldIndex: number, newIndex: number) => {
    setWidgets((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, moved);
      return updated;
    });
  };

  const deleteWidget = (id: string) => {
    setWidgets((prev) => prev.filter((widget) => widget.id !== id));
  };

  const updateWidgetLayout = (
    layouts: Array<{ i: string; x: number; y: number; w: number; h: number }>
  ) => {
    setWidgets((prev) =>
      prev.map((widget) => {
        const layout = layouts.find((l) => l.i === widget.id);
        if (layout) {
          return {
            ...widget,
            x: layout.x,
            y: layout.y,
            w: layout.w,
            h: layout.h,
          };
        }
        return widget;
      })
    );
  };

  return (
    <WidgetContext.Provider
      value={{
        widgets,
        isEditing,
        addWidget,
        setIsEditing,
        updateWidgetOrder,
        deleteWidget,
        updateWidgetLayout,
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
