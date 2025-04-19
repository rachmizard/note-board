"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { LayoutDashboard, Plus, ChevronUp } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import { EmojiPicker } from "@/shared/components/emoji-picker";

interface Dashboard {
  id: string;
  name: string;
  emoji?: string;
}

interface DashboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dashboards: Dashboard[];
  selectedDashboard?: string;
  onSelect: (dashboardId: string) => void;
  onCreateNew: (title: string, emoji?: string) => void;
}

export function DashboardDialog({
  open,
  onOpenChange,
  dashboards,
  selectedDashboard,
  onSelect,
  onCreateNew,
}: DashboardDialogProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDashboardTitle, setNewDashboardTitle] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState<string>("📊");

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDashboardTitle.trim()) {
      onCreateNew(newDashboardTitle, selectedEmoji);
      setNewDashboardTitle("");
      setSelectedEmoji("📊");
      setShowCreateForm(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Dashboard</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-2">
            {dashboards.map((dashboard) => (
              <Button
                key={dashboard.id}
                variant={
                  selectedDashboard === dashboard.id ? "default" : "outline"
                }
                className="justify-start gap-2 px-4 py-6"
                onClick={() => {
                  onSelect(dashboard.id);
                  onOpenChange(false);
                }}
              >
                {dashboard.emoji ? (
                  <span className="text-lg mr-1">{dashboard.emoji}</span>
                ) : (
                  <LayoutDashboard className="h-5 w-5" />
                )}
                <span>{dashboard.name}</span>
              </Button>
            ))}
          </div>

          <Collapsible
            open={showCreateForm}
            onOpenChange={setShowCreateForm}
            className="w-full border rounded-md"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="secondary"
                className="w-full gap-2 justify-center"
              >
                {showCreateForm ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create New Dashboard
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4">
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="flex gap-2 items-center">
                  <EmojiPicker
                    onEmojiSelect={setSelectedEmoji}
                    selectedEmoji={selectedEmoji}
                    buttonClassName="h-10 w-10 text-lg"
                  />
                  <Input
                    placeholder="Dashboard Title"
                    value={newDashboardTitle}
                    onChange={(e) => setNewDashboardTitle(e.target.value)}
                    className="w-full"
                    autoFocus
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!newDashboardTitle.trim()}
                >
                  Create Dashboard
                </Button>
              </form>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </DialogContent>
    </Dialog>
  );
}
