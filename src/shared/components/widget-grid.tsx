"use client";

import React from "react";
import { motion } from "framer-motion";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

export interface WidgetGridItem {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface WidgetGridProps<T extends WidgetGridItem> {
  items: T[];
  isDraggable?: boolean;
  isResizable?: boolean;
  onLayoutChange?: (layout: any) => void;
  cols?: number;
  rowHeight?: number;
  containerClassName?: string;
  renderItem: (item: T) => React.ReactNode;
}

export function WidgetGrid<T extends WidgetGridItem>({
  items,
  isDraggable = false,
  isResizable = false,
  onLayoutChange,
  cols = 12,
  rowHeight = 30,
  containerClassName = "h-full w-full border-1 border-dashed border-accent rounded-lg p-4",
  renderItem,
}: WidgetGridProps<T>) {
  const layout = items.map((item) => ({
    i: item.id,
    x: item.x,
    y: item.y,
    w: item.w,
    h: item.h,
  }));

  const handleLayoutChange = (newLayout: any) => {
    if (onLayoutChange) {
      onLayoutChange(newLayout);
    }
  };

  return (
    <motion.div className={containerClassName}>
      <GridLayout
        className="layout"
        layout={layout}
        cols={cols}
        rowHeight={rowHeight}
        width={1200}
        isDraggable={isDraggable}
        isResizable={isResizable}
        onLayoutChange={handleLayoutChange}
        margin={[16, 16]}
      >
        {items.map((item) => (
          <div key={item.id}>{renderItem(item)}</div>
        ))}
      </GridLayout>
    </motion.div>
  );
}
