"use client";

import { AnimatedList } from "@/components/magicui/animated-list";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { cn } from "@/shared/lib/utils";
import React, { useState } from "react";
import { WIDGET_CATEGORIES } from "./widget-categories";
import { Layout, Plus } from "lucide-react";
import { useWidgets, WidgetType } from "../../context/widget-context";

interface WidgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WidgetDialog: React.FC<WidgetDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { addWidget, widgets } = useWidgets();

  const handleAddWidget = (widget: {
    id: string;
    name: string;
    icon: React.ReactNode;
    type: string;
    category: string;
  }) => {
    addWidget({
      ...widget,
      x: (widgets.length % 2) * 6,
      y: Math.floor(widgets.length / 2),
      w: 6,
      h: 4,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 h-[500px]">
          {/* Sidebar Categories */}
          <div className="w-48 space-y-1 border-r pr-2">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2",
                selectedCategory === "all" && "bg-accent"
              )}
              onClick={() => setSelectedCategory("all")}
            >
              <Layout />
              All Widgets
            </Button>
            {WIDGET_CATEGORIES.map((category) => (
              <Button
                key={category.title}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  selectedCategory === category.title.toLowerCase() &&
                    "bg-accent"
                )}
                onClick={() =>
                  setSelectedCategory(category.title.toLowerCase())
                }
              >
                {category.icon}
                {category.title}
              </Button>
            ))}
          </div>

          {/* Widget Grid */}
          <ScrollArea className="flex-1">
            <AnimatedList delay={100} className="space-y-6">
              {WIDGET_CATEGORIES.filter(
                (category) =>
                  selectedCategory === "all" ||
                  category.title.toLowerCase() === selectedCategory
              ).map((category) => (
                <div key={category.title} className="space-y-3">
                  <div className="flex items-center gap-2">
                    {category.icon}
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {category.title}
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {category.items.map((widget) => (
                      <Button
                        key={widget.id}
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center gap-2 hover:border-primary group relative overflow-hidden"
                        onClick={() =>
                          handleAddWidget({
                            ...widget,
                          })
                        }
                      >
                        <div className="text-muted-foreground group-hover:text-primary transition-colors">
                          {widget.icon}
                        </div>
                        <span className="text-sm font-medium">
                          {widget.name}
                        </span>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 backdrop-blur-sm bg-background/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-all duration-200">
                          <div className="bg-background rounded-full p-2">
                            <Plus className="h-6 w-6 text-primary" />
                          </div>
                          <span className="text-xs font-medium text-primary">
                            Add Widget
                          </span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </AnimatedList>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            size="sm"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
