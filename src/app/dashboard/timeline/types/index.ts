export type BaseBlockType = "todo" | "pomodoro";

export interface BaseBlock {
  id: string;
  type: BaseBlockType;
  title: string;
  created_at: string;
  updated_at: string;
  status: "pending" | "completed";
  properties: Record<string, any>;
  metadata: {
    user_id: string;
  };
}

export interface TodoBlock extends BaseBlock {
  type: "todo";
  properties: {
    due_date: string;
    priority?: "low" | "medium" | "high";
  };
}

export interface PomodoroBlock extends BaseBlock {
  type: "pomodoro";
  properties: {
    duration: number;
    unit: "minutes";
  };
}

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: {
    type: BaseBlockType;
    status: "pending" | "completed";
    original: BaseBlock;
  };
};

