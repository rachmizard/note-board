"use client";

import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./ui/button";

export interface WidgetItemProps {
  id: string;
  icon?: React.ReactNode;
  name: string;
  isEditing?: boolean;
  onDelete?: (id: string) => void;
  children?: React.ReactNode;
}

export function WidgetItem({
  id,
  icon,
  name,
  isEditing = false,
  onDelete,
  children,
}: WidgetItemProps) {
  return (
    <motion.div
      layout
      className="border rounded-lg p-4 flex flex-col items-center justify-center gap-2 relative group h-full w-full"
    >
      {isEditing && onDelete && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full z-10"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      )}

      {icon && <div className="text-muted-foreground">{icon}</div>}
      <span className="text-sm font-medium">{name}</span>

      {children}

      {isEditing && (
        <motion.div
          className="absolute inset-0 bg-background/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <span className="text-xs text-muted-foreground">Drag to move</span>
        </motion.div>
      )}
    </motion.div>
  );
}
