"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  GripHorizontal,
  ChevronDown,
  Plus,
  PencilRuler,
} from "lucide-react";
import { useWidgets, WidgetType } from "../context/widget-context";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/shared/components/ui/button";
import { WidgetDialog } from "./dialogs/widget-dialog";

const SortableWidget: React.FC<WidgetType> = (widget) => {
  const { isEditing } = useWidgets();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      className="h-48 border rounded-lg p-4 flex flex-col items-center justify-center gap-2 relative group"
    >
      <div className="text-muted-foreground">{widget.icon}</div>
      <span className="text-sm font-medium">{widget.name}</span>

      {isEditing && (
        <div
          className="absolute inset-0 bg-background/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-move"
          {...attributes}
          {...listeners}
        >
          <GripHorizontal className="h-6 w-6 text-primary" />
        </div>
      )}
    </motion.div>
  );
};

const WidgetList: React.FC = () => {
  const { widgets, isEditing, setIsEditing, updateWidgetOrder } = useWidgets();
  const [widgetDialogOpen, setWidgetDialogOpen] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = widgets.findIndex((w) => w.id === active.id);
      const newIndex = widgets.findIndex((w) => w.id === over.id);
      updateWidgetOrder(oldIndex, newIndex);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <Button variant="ghost" className="text-xl font-bold px-2 gap-2">
          Main Dashboard
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
          <motion.div
            className="h-full w-full border-1 border-dashed border-accent rounded-lg flex flex-col items-center justify-center gap-4"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <LayoutDashboard className="w-12 h-12 text-accent" />
            <p className="text-gray-500">No widgets added yet</p>
          </motion.div>
        </div>
      ) : (
        <DndContext
          onDragEnd={handleDragEnd}
          collisionDetection={closestCenter}
        >
          <SortableContext
            items={widgets.map((w) => w.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 gap-4">
              {widgets.map((widget) => (
                <SortableWidget key={widget.id} {...widget} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <WidgetDialog
        open={widgetDialogOpen}
        onOpenChange={setWidgetDialogOpen}
      />
    </div>
  );
};

export default WidgetList;
