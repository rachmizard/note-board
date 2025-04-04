import { BaseBlock, TodoBlock, PomodoroBlock, CalendarEvent } from "../types";

/**
 * Transforms a Todo block into a calendar event
 * Uses due_date as start and adds 1 hour as default duration
 */
export const transformTodoToEvent = (todo: TodoBlock): CalendarEvent => {
  const start = new Date(todo.properties.due_date);
  const end = new Date(start);
  end.setHours(end.getHours() + 1); // Default 1 hour duration for todos

  return {
    id: todo.id,
    title: todo.title,
    start,
    end,
    resource: {
      type: "todo",
      status: todo.status,
      original: todo,
    },
  };
};

/**
 * Transforms a Pomodoro block into a calendar event
 * Uses created_at as start and calculates end based on duration
 */
export const transformPomodoroToEvent = (
  pomodoro: PomodoroBlock,
): CalendarEvent => {
  const start = new Date(pomodoro.created_at);
  const end = new Date(start);

  // Calculate end based on duration (in minutes)
  end.setMinutes(end.getMinutes() + pomodoro.properties.duration);

  return {
    id: pomodoro.id,
    title: pomodoro.title,
    start,
    end,
    resource: {
      type: "pomodoro",
      status: pomodoro.status,
      original: pomodoro,
    },
  };
};

/**
 * Transforms all BaseBlocks into calendar events
 */
export const transformToEvents = (blocks: BaseBlock[]): CalendarEvent[] => {
  return blocks.map((block) => {
    if (block.type === "todo") {
      return transformTodoToEvent(block as TodoBlock);
    } else if (block.type === "pomodoro") {
      return transformPomodoroToEvent(block as PomodoroBlock);
    }

    // This shouldn't happen if types are properly checked
    throw new Error(`Unknown block type: ${block.type}`);
  });
};

/**
 * Filter blocks by date range
 */
export const filterBlocksByDateRange = (
  blocks: BaseBlock[],
  start: Date,
  end: Date,
): BaseBlock[] => {
  return blocks.filter((block) => {
    let blockDate: Date;

    if (block.type === "todo") {
      blockDate = new Date((block as TodoBlock).properties.due_date);
    } else if (block.type === "pomodoro") {
      blockDate = new Date(block.created_at);
    } else {
      return false;
    }

    return blockDate >= start && blockDate <= end;
  });
};

