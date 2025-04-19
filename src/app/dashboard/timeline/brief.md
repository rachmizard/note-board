# Calendar View Implementation

## Overview
The timeline calendar provides a comprehensive view of events with four viewing modes: Day, Week, Month, and Year. The implementation uses Shadcn components, TailwindCSS, and date-fns for date manipulation.

## Features

### Navigation
- Date navigation with previous/next buttons that adjust based on the current view:
  - Day view: Navigate day by day
  - Week view: Navigate week by week
  - Month view: Navigate month by month
  - Year view: Navigate year by year
- "Today" button to quickly jump to the current date
- View switcher with 4 view options (Day, Week, Month, Year)

### Day View
- Vertical timeline with 30-minute interval slots (00:00 to 23:30)
- All-day events section at the top, separated from time-based events
- Real-time current time indicator with clock display and time label
- Events displayed with accurate positioning based on start time and duration
- Events show title and time range
- Color-coded events based on event type
- Scrollable interface for viewing the entire day

### Week View
- Monday to Sunday layout with proper grid columns
- Day headers showing weekday abbreviation and date
- Current day highlighted in the header
- All-day events section at the top for each day
- Vertical timeline with 30-minute interval slots
- Real-time current time indicator shows on the current day
- Time indicator includes clock icon and current time display
- Events positioned in the correct time slot and day column
- Events show title and time range
- Events properly contained within day columns
- Scrollable interface for viewing all hours

### Month View
- Full calendar grid showing all days of the month
- Days from adjacent months shown but styled differently
- Weekday headers (Mon-Sun)
- Current day highlighted
- Events displayed as pills with truncation for long titles
- "More" indicator when a day has more than 3 events
- Color-coded events based on type
- Events properly contained within day cells
- Multi-day events display as continuous blocks spanning across days
- Events extend beyond cell boundaries to create a seamless appearance
- Only show event title on the first day to reduce clutter
- Different visual styling for multi-day vs. single-day events
- Rounded corners at the start and end of multi-day events
- Proper handling of events that span multiple days

### Year View
- Grid of all 12 months of the selected year
- Each month shows a mini calendar with days of the month
- Current month and day highlighted
- Weekday headers abbreviated (M-S)
- Responsive layout (adjusts columns based on screen size)
- Consistent styling with the rest of the views
- Interactive date selection - clicking on any date navigates to the day view
- Hover effects for better user interaction feedback

## Technical Implementation

### State Management
- React `useState` for managing current view and date
- React `useEffect` for side effects like time updates and calculations
- React `useCallback` for memoizing functions

### Time Management
- `date-fns` library for all date calculations and formatting
- Real-time updates with `setInterval` for the current time indicator
- Efficient date filtering for events based on the selected range

### Event Positioning
- Events positioned absolutely within the grid for precise placement
- Position calculated as a percentage of the container for fluid layouts
- Calculation based on minutes since midnight for accurate time placement
- Height calculated based on event duration

### Styling
- Tailwind CSS for responsive styling with dark mode support
- Conditional styling using the `cn` utility for combining class names
- Responsive grid layout for different screen sizes
- Proper z-index management for layering elements

### Responsiveness
- Adapts to different screen sizes
- Scrollable containers for overflow content
- Text truncation for long content
- Mobile-friendly touch targets

### Performance Optimizations
- Memoized functions with `useCallback` to prevent unnecessary recalculations
- Conditional rendering to only show what's needed
- Filtered event lists to minimize DOM elements
- Optimized real-time updates at 1-second intervals

## Event Data Structure
```typescript
interface Event {
  id: string;      // Unique identifier for the event
  title: string;   // Event title
  start: Date;     // Start date and time
  end: Date;       // End date and time
  color?: string;  // Optional color class for event styling
  allDay?: boolean; // Optional flag for all-day events
}
```

Multi-day events use the same interface but are detected by comparing start and end dates. When the dates differ, the event is treated as spanning across those days.

## Project Structure
- All calendar views are organized under the `src/app/dashboard/timeline/_components` directory
- Each view is implemented as a separate component for maintainability
- Shared event data and interfaces are in the parent `page.tsx` file
- Utility functions are leveraged from shared components