# Timeline Feature Documentation

## Overview

The Timeline feature is a sophisticated calendar implementation built with React and TypeScript. It provides multiple calendar views and real-time event management capabilities.

## Architecture

### Component Structure

- `TimelinePage`: Root component that wraps the Calendar with Suspense for loading states
- `Calendar`: Main container component
- `CalendarBody`: Core component handling different view renders

### Views

1. Month View (`CalendarMonthView`)
2. Week View (`CalendarWeekView`)
3. Day View (`CalendarDayView`)
4. Year View (`CalendarYearView`)
5. Agenda View (`AgendaEvents`)

### State Management

- Uses React Context API through `calendar-context.tsx`
- Drag and drop functionality managed by `drag-drop-context.tsx`

### Data Flow

1. Events are filtered into two categories:
   - Single-day events: Events that start and end on the same day
   - Multi-day events: Events spanning multiple days
2. View state determines which calendar view component to render
3. Events are passed down to specific view components

### Event Data Structure

```typescript
interface IEvent {
  id: number; // Unique identifier for the event
  startDate: string; // ISO date string for event start
  endDate: string; // ISO date string for event end
  title: string; // Event title/name
  color: TEventColor; // Color coding for visual distinction
  description: string; // Detailed event description
  user: IUser; // Associated user information
}

interface IUser {
  id: string; // Unique user identifier
  name: string; // User's display name
  picturePath: string | null; // Optional user avatar
}
```

#### Event Handling Examples

1. **Creating an Event**

   ```typescript
   const newEvent: IEvent = {
     id: 1,
     startDate: "2024-01-01T09:00:00Z",
     endDate: "2024-01-01T10:00:00Z",
     title: "Team Meeting",
     color: "blue",
     description: "Weekly sync meeting",
     user: {
       id: "user123",
       name: "John Doe",
       picturePath: "/avatars/john.jpg",
     },
   };
   ```

2. **Event Display**
   - Events are rendered differently based on their duration and view type
   - Color coding helps distinguish between different event types
   - User information is displayed for event ownership

### Key Features

1. **View Switching**

   - Seamless transitions between different calendar views
   - Animated transitions using Framer Motion

2. **Event Handling**

   - Custom hooks for event filtering (`useFilteredEvents`)
   - Date parsing and comparison using `date-fns`

3. **Loading States**
   - Skeleton loaders for better UX
   - React Suspense integration

### Code Patterns

1. **Client-Side Components**

   ```typescript
   "use client";
   ```

   - Used to mark components that require client-side interactivity

2. **Custom Hooks**

   ```typescript
   const { view, isAgendaMode } = useCalendar();
   const filteredEvents = useFilteredEvents();
   ```

   - Encapsulates complex logic and state management
   - Promotes code reusability

3. **Conditional Rendering**

   ```typescript
   {
     view === "month" && <CalendarMonthView />;
   }
   ```

   - View-specific components are rendered based on current view state

4. **Animation Integration**
   ```typescript
   <motion.div
     initial="initial"
     animate="animate"
     exit="exit"
     variants={fadeIn}
     transition={transition}
   >
   ```
   - Framer Motion for smooth transitions between views

### Best Practices

1. **Type Safety**

   - Extensive use of TypeScript interfaces and types
   - Defined in `interfaces.ts` and `types.ts`

2. **Code Organization**

   - Clear separation of concerns
   - Modular component structure
   - Shared utilities and constants

3. **Performance Optimization**
   - Event filtering optimization
   - Lazy loading through Suspense
   - Efficient state management

### Directory Structure

```
timeline/
├── components/         # UI Components
│   ├── agenda-view/    # Agenda view components
│   ├── month-view/     # Month view components
│   ├── week-and-day-view/  # Week and day view components
│   └── year-view/      # Year view components
├── contexts/          # React Context providers
├── hooks/             # Custom hooks
├── animations.ts      # Animation configurations
├── interfaces.ts      # TypeScript interfaces
└── types.ts           # TypeScript types
```

## For Junior Developers

### Key Concepts to Understand

1. **React Patterns**

   - Client Components vs Server Components
   - Context API for state management
   - Custom Hooks for logic reuse

2. **TypeScript**

   - Interface definitions
   - Type safety
   - Generic types

3. **Date Handling**
   - Working with `date-fns` library
   - Date parsing and formatting
   - Date comparisons

### Common Gotchas

1. Always use `"use client"` directive when component needs client-side interactivity
2. Ensure proper type definitions when working with event data
3. Be mindful of date-time zones when handling events

### Development Workflow

1. Understand the component hierarchy
2. Use TypeScript for better development experience
3. Test changes in different view modes
4. Ensure animations work smoothly
5. Maintain consistent code style

## Maintenance and Updates

1. Follow existing patterns when adding new features
2. Update types when modifying data structures
3. Keep animations consistent across views
4. Maintain proper documentation for new additions
