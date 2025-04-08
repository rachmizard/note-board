'use client';

import { cn } from "@/shared/lib/utils";
import React from "react";
import { format, getMonth, getYear, getDay, isSameDay, isToday } from "date-fns";

interface YearViewProps {
  currentDate: Date;
  onDateSelect?: (date: Date) => void;
}

export const YearView: React.FC<YearViewProps> = ({ 
  currentDate,
  onDateSelect = () => {} // default empty function 
}) => {
  const currentYear = getYear(currentDate);

  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderMonth = (monthIndex: number) => {
    const today = new Date();
    const daysInMonth = getDaysInMonth(currentYear, monthIndex);
    // Adjust for Monday as first day of week (0 is Sunday in JS Date)
    let firstDayOfMonth = getFirstDayOfMonth(currentYear, monthIndex) - 1;
    if (firstDayOfMonth < 0) firstDayOfMonth = 6; // Sunday becomes the last day
    
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="text-center text-xs text-muted-foreground"></div>);
    }

    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, monthIndex, day);
      const isCurrentDay = isToday(date);
      const isCurrentMonth = getMonth(today) === monthIndex && getYear(today) === currentYear;

      days.push(
        <div
          key={day}
          className={cn(
            "text-center text-xs p-1 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors",
            isCurrentDay && "bg-red-100 text-red-500 font-bold rounded-full dark:bg-red-900",
            !isCurrentDay && isCurrentMonth && "text-foreground",
            !isCurrentMonth && "text-muted-foreground"
          )}
          onClick={() => onDateSelect(date)}
        >
          {day}
        </div>
      );
    }

    const monthName = months[monthIndex];
    const isCurrentMonth = getMonth(today) === monthIndex && getYear(today) === currentYear;

    return (
      <div key={monthIndex} className="p-2 border rounded-lg bg-background">
        <div className={cn(
          "text-sm font-medium mb-2 text-center",
          isCurrentMonth ? "text-red-500" : "text-foreground"
        )}>
          {monthName}
        </div>
        <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground mb-1">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <div key={i} className="text-center">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {months.map((_, index) => renderMonth(index))}
      </div>
    </div>
  );
};