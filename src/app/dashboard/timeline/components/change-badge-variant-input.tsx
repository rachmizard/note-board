"use client";

import { useCalendar } from "@/app/dashboard/timeline/contexts/calendar-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { DotIcon, PaletteIcon } from "lucide-react";
import { MotionButton } from "@/app/dashboard/timeline/components/header/calendar-header";
import { buttonHover } from "@/app/dashboard/timeline/animations";

export function ChangeBadgeVariantInput() {
  const { badgeVariant, setBadgeVariant } = useCalendar();

  return (
    <div className="space-y-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <MotionButton
              variant="outline"
              size="icon"
              variants={buttonHover}
              whileHover="hover"
              whileTap="tap"
              onClick={() =>
                setBadgeVariant(badgeVariant === "dot" ? "colored" : "dot")
              }
            >
              {badgeVariant === "dot" ? (
                <DotIcon className="w-5 h-5" />
              ) : (
                <PaletteIcon className="w-5 h-5" />
              )}
            </MotionButton>
          </TooltipTrigger>
          <TooltipContent>Badge variant</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
