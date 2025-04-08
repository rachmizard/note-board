"use client";

import React from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";

const WidgetList = () => {
  return (
    <div className="h-[calc(100vh-12rem)] w-full">
      <DndContext>
        <SortableContext items={[]} strategy={rectSortingStrategy}>
          <motion.div
            className="h-full w-full border-1 border-dashed border-accent rounded-lg flex flex-col items-center justify-center gap-4 cursor-pointer"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <LayoutDashboard className="w-12 h-12 text-accent" />
            <p className="text-gray-500">No widgets added yet</p>
          </motion.div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default WidgetList;
