### Timeline

**Goal**: Provide a chronological visualization of a user’s todos and Pomodoro sessions, leveraging existing data without a dedicated structure, and allow seamless interaction via a calendar interface.

#### Requirements

- **Core Features**:

  - **Data Aggregation**:
    - Fetch all `Todo` and `Pomodoro` LifeBlocks for the authenticated user (via `metadata.user_id`).
    - Filter by a selected date range (e.g., current day, week) based on `properties.due_date` (for todos) and `history.timestamp` or `created_at` (for Pomodoros).
    - Transform data into `react-big-calendar`-compatible events:
      - **Event Format**: `{ id, title, start, end, resource }`
      - **Todos**: Use `properties.due_date` as `start` (assume a default duration, e.g., 1 hour, unless specified).
      - **Pomodoros**: Use `history.timestamp` or `created_at` as `start`, and `properties.duration` to calculate `end`.
  - **Rendering**:
    - Display aggregated events as time slots in `react-big-calendar` (e.g., daily view by default).
    - Todos appear as blocks with titles and durations (e.g., "Finish Report" from 09:00–10:00).
    - Pomodoros appear as shorter blocks (e.g., "Work on Report" from 09:00–09:25).
  - **Navigation**:
    - Switch between day, week, or month views using `react-big-calendar` controls.
    - Include prev/next buttons and a date picker for quick jumps.

- **Editing Time Slots**:

  - **Adjust Existing Slots**:
    - Drag-and-drop or resize events in the calendar to update the corresponding `Todo` or `Pomodoro` LifeBlock.
      - the dragging is to move the event to a new time slot
      - the resizing is to change the duration of the event
    - For `Todo`: Update `properties.due_date` or add `properties.time` (e.g., "09:00-10:00").
    - For `Pomodoro`: Update `history.timestamp` or `created_at` and adjust `properties.duration` if resized.
  - **Save Changes**:
    - Persist updates to the backend via API calls to modify the original LifeBlocks.
    - Reflect changes immediately in the UI.

- **Creating New Time Slots**:

  - **Prompt on Click**:
    - Clicking an empty slot opens a modal or dropdown asking: "Create a Todo or Goal?"
    - Options: "Todo" or "Goal" (placeholder for future expansion, e.g., habits, hydration).
  - **Todo Creation**:
    - Input: Title, optional due date/time, priority.
    - Creates a new `Todo` LifeBlock with the selected time slot as `properties.due_date`.
  - **Goal Creation**:
    - For now, placeholder functionality (e.g., "Coming soon: Habits, Hydration, etc.").
    - Future: Create a new LifeBlock (e.g., `type: "habit"`) with relevant `properties`.
  - **Post-Creation**:
    - New LifeBlock is saved to the backend and immediately added to the timeline.

- **UI**:

  - Use `react-big-calendar` with a custom theme to match Benji’s design.
  - Color-code events: e.g., blue for todos, orange for Pomodoros.
  - Hover tooltips showing event details (e.g., title, status, duration).
  - Visual indicators: Green border for completed, red for overdue todos.

- **Analytics** (Optional)\*\*:

  - Highlight completed vs. pending items (e.g., opacity or checkmark).
  - No dedicated analytics storage; derive from `Todo` and `Pomodoro` LifeBlocks.

- **Data Handling** (No Dedicated LifeBlock)\*\*:

  - **Source**: Relies entirely on existing `Todo` and `Pomodoro` LifeBlocks.
  - **Example Todo**:
    ```json
    {
      "id": "todo_001",
      "type": "todo",
      "title": "Finish Report",
      "created_at": "2025-04-04T09:00:00Z",
      "updated_at": "2025-04-04T09:00:00Z",
      "status": "pending",
      "properties": {
        "due_date": "2025-04-04T09:00:00Z",
        "priority": "high"
      },
      "metadata": { "user_id": "clerk_user_123" }
    }
    ```
    - Transforms to: `{ id: "todo_001", title: "Finish Report", start: "2025-04-04T09:00:00Z", end: "2025-04-04T10:00:00Z" }`
  - **Example Pomodoro**:
    ```json
    {
      "id": "pomo_002",
      "type": "pomodoro",
      "title": "Work on Report",
      "created_at": "2025-04-04T09:00:00Z",
      "updated_at": "2025-04-04T09:25:00Z",
      "status": "completed",
      "properties": {
        "duration": 25,
        "unit": "minutes"
      },
      "metadata": { "user_id": "clerk_user_123" }
    }
    ```
    - Transforms to: `{ id: "pomo_002", title: "Work on Report", start: "2025-04-04T09:00:00Z", end: "2025-04-04T09:25:00Z" }`

- **Performance**:

  - Fetch and render 50 events in <1 second.
  - Real-time updates for edits via WebSocket or polling.

- **Error Handling**:

  - Fallback UI (e.g., "No events today") if no data is fetched.
  - Handle invalid time slots (e.g., negative duration) by resetting to defaults.
  - Notify users if backend updates fail (e.g., "Failed to save changes").

- **Technical Integration**:
  - **Library**: Use `react-big-calendar` with `moment` or `date-fns` for date handling.
  - **API**: Fetch LifeBlocks via a single endpoint (e.g., `/user/{user_id}/lifeblocks?types=todo,pomodoro`).
  - **Events**: Map LifeBlock fields to calendar events in the frontend:
    - `id`: LifeBlock `id`.
    - `title`: LifeBlock `title`.
    - `start`: `properties.due_date` (Todo) or `history.timestamp`/`created_at` (Pomodoro).
    - `end`: Calculated from `start` + default duration (Todo: 1 hour; Pomodoro: `properties.duration`).
  - **DnD**: Use `react-big-calendar`’s built-in drag-and-drop to update `start`/`end`, syncing back to LifeBlocks.

---

### Why This Works

- **No Dedicated Structure**: By relying on `Todo` and `Pomodoro` LifeBlocks, you avoid redundancy and keep the data model lean.
- **Flexibility**: Aggregating data in the frontend allows easy expansion to "goals" (e.g., habits) by including more LifeBlock types later.
- **User Experience**: `react-big-calendar` provides a polished, interactive interface, and editing existing data keeps the workflow intuitive.
- **Future-Proof**: The "Goal" placeholder sets the stage for adding habits, hydration, etc., without changing the Timeline’s core logic.

---

### Example Workflow

1. **User Opens Timeline**:

   - Fetches `Todo` and `Pomodoro` LifeBlocks for April 4, 2025.
   - Aggregates into events:
     - "Finish Report" (09:00–10:00).
     - "Work on Report" (09:00–09:25).
   - Renders in `react-big-calendar`.

2. **User Adjusts a Slot**:

   - Drags "Finish Report" to 10:00–11:00.
   - Updates `todo_001.properties.due_date` to "2025-04-04T10:00:00Z" via API.

3. **User Creates a Slot**:
   - Clicks 11:00 slot, selects "Todo".
   - Inputs "Review Notes", sets 11:00–11:30.
   - Creates new `Todo` LifeBlock and refreshes Timeline.

---

### Final Notes

make sure to utilize available deps before even adding new ones

```json

  "dependencies": {
    "@neondatabase/serverless": "^1.0.0",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slot": "^1.1.2",
    "@radix-ui/react-tooltip": "^1.1.8",
    "@tanstack/react-query": "^5.71.5",
    "@trpc/client": "^11.0.2",
    "@trpc/react-query": "^11.0.2",
    "@trpc/server": "^11.0.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "drizzle-orm": "^0.41.0",
    "lucide-react": "^0.487.0",
    "next": "15.2.4",
    "react": "^19.0.0",
    "react-big-calendar": "^1.18.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^3.1.0",
    "tw-animate-css": "^1.2.5",
    "zod": "^3.24.2"
  },
```

especially use shadcn, tailwind

also provide sample or mock data since API is not ready yet
