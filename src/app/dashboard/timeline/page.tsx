'use client';

import { Suspense } from 'react';
import { useTheme } from 'next-themes';
import { TimelineCalendar } from './components/TimelineCalendar';
import './styles/calendar.css';

export default function TimelinePage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className={`h-full w-full p-4 ${isDark ? 'text-white' : ''}`}>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Timeline</h1>
        <p className={`${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
          View and manage your todo items and pomodoros in a calendar view
        </p>
      </div>
      
      <Suspense fallback={
        <div className={`flex items-center justify-center h-[calc(100vh-200px)] ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
          Loading calendar...
        </div>
      }>
        <TimelineCalendar />
      </Suspense>
    </div>
  );
}