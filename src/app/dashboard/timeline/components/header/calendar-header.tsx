"use client";

import {
  CalendarRange,
  Columns,
  Grid2X2,
  Grid3X3,
  GroupIcon,
  LayoutList,
  List,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/shared/components/ui/button";
import {
  buttonHover,
  slideFromLeft,
  slideFromRight,
  transition,
} from "@/app/dashboard/timeline/animations";

import { DateNavigator } from "@/app/dashboard/timeline/components/header/date-navigator";
import { AddEditEventDialog } from "@/app/dashboard/timeline/components/dialogs/add-edit-event-dialog";
import FilterEvents from "@/app/dashboard/timeline/components/header/filter";

import { ButtonGroup } from "@/shared/components/ui/button-group";
import { useCalendar } from "@/app/dashboard/timeline/contexts/calendar-context";
import { Toggle } from "@/shared/components/ui/toggle";
import { ModeToggle } from "@/shared/components/mode-toggle";
import { useFilteredEvents } from "@/app/dashboard/timeline/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

export const MotionButton = motion.create(Button);

export function CalendarHeader() {
  const {
    view,
    setView,
    isAgendaMode,
    toggleAgendaMode,
    agendaModeGroupBy,
    setAgendaModeGroupBy,
    use24HourFormat,
    toggleTimeFormat,
  } = useCalendar();

  const events = useFilteredEvents();

  return (
    <div className="relative flex flex-col gap-4 border-b bg-gradient-to-r from-background to-muted/30 p-4 lg:flex-row lg:items-center lg:justify-between">
      <motion.div
        className="flex items-center gap-3"
        variants={slideFromLeft}
        initial="initial"
        animate="animate"
        transition={transition}
      >
        <DateNavigator view={view} events={events} />
      </motion.div>

      <motion.div
        className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-1.5"
        variants={slideFromRight}
        initial="initial"
        animate="animate"
        transition={transition}
      >
        <div className="options flex flex-wrap items-center gap-2 rounded-lg bg-background/50 p-1.5 backdrop-blur-sm">
          <FilterEvents />
          <MotionButton
            variant="ghost"
            onClick={toggleTimeFormat}
            asChild
            className="rounded-md px-3 text-sm"
            variants={buttonHover}
            whileHover="hover"
            whileTap="tap"
          >
            <Toggle>{use24HourFormat ? "24h" : "12h"}</Toggle>
          </MotionButton>
          <MotionButton
            variant="ghost"
            onClick={() => toggleAgendaMode(!isAgendaMode)}
            asChild
            className="rounded-md px-3 relative text-sm"
            variants={buttonHover}
            whileHover="hover"
            whileTap="tap"
          >
            <Toggle>
              {isAgendaMode ? (
                <>
                  <CalendarRange className="h-4 w-4 mr-1" />
                  <span>Agenda</span>
                  <span className="absolute -top-1 -right-1 size-2 rounded-full bg-green-400"></span>
                </>
              ) : (
                <>
                  <LayoutList className="h-4 w-4 mr-1" />
                  <span>Calendar</span>
                </>
              )}
            </Toggle>
          </MotionButton>
          {isAgendaMode && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8">
                  <GroupIcon className="h-4 w-4 mr-1" />
                  <span>Group</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Group by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={agendaModeGroupBy}
                  onValueChange={(value) =>
                    setAgendaModeGroupBy(value as "date" | "color")
                  }
                >
                  <DropdownMenuRadioItem value="date">
                    Date
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="color">
                    Color
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <ButtonGroup className="bg-muted/50 rounded-md overflow-hidden">
            <MotionButton
              variant={view === "day" ? "default" : "ghost"}
              size="sm"
              aria-label="View by day"
              onClick={() => {
                setView("day");
              }}
              variants={buttonHover}
              whileHover="hover"
              whileTap="tap"
            >
              <List className="h-4 w-4" />
            </MotionButton>

            <MotionButton
              variant={view === "week" ? "default" : "ghost"}
              size="sm"
              aria-label="View by week"
              onClick={() => setView("week")}
              variants={buttonHover}
              whileHover="hover"
              whileTap="tap"
            >
              <Columns className="h-4 w-4" />
            </MotionButton>

            <MotionButton
              variant={view === "month" ? "default" : "ghost"}
              size="sm"
              aria-label="View by month"
              onClick={() => setView("month")}
              variants={buttonHover}
              whileHover="hover"
              whileTap="tap"
            >
              <Grid3X3 className="h-4 w-4" />
            </MotionButton>
            <MotionButton
              variant={view === "year" ? "default" : "ghost"}
              size="sm"
              aria-label="View by year"
              onClick={() => setView("year")}
              variants={buttonHover}
              whileHover="hover"
              whileTap="tap"
            >
              <Grid2X2 className="h-4 w-4" />
            </MotionButton>
          </ButtonGroup>

          {/* Disabled components */}
          {/* <ChangeBadgeVariantInput /> */}
          <ModeToggle />
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-1.5">
          {/* Disabled UserSelect */}
          {/* <UserSelect /> */}

          <AddEditEventDialog>
            <MotionButton
              variants={buttonHover}
              whileHover="hover"
              whileTap="tap"
              className="bg-primary/90 hover:bg-primary transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Event
            </MotionButton>
          </AddEditEventDialog>
        </div>
      </motion.div>
    </div>
  );
}
