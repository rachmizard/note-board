import { useState, useEffect, useMemo } from "react";
import { BaseBlock } from "../types";
import { mockTodos, mockPomodoros } from "../data/mock";
import { transformToEvents, filterBlocksByDateRange } from "../utils/transform";

/**
 * Custom hook to fetch and manage timeline data
 */
export const useTimelineData = (
  startDate: Date = new Date(),
  endDate: Date = new Date(),
) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [blocks, setBlocks] = useState<BaseBlock[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, use mock data with artificial delay to simulate network request
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Combine todo and pomodoro blocks
        const allBlocks = [...mockTodos, ...mockPomodoros];
        setBlocks(allBlocks);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter blocks by date range and transform to events
  const events = useMemo(() => {
    if (!blocks.length) return [];

    const filteredBlocks = filterBlocksByDateRange(blocks, startDate, endDate);
    return transformToEvents(filteredBlocks);
  }, [blocks, startDate, endDate]);

  // Function to create a new Todo block
  const createTodo = async (title: string, dueDate: Date) => {
    try {
      setLoading(true);

      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      const newTodo = {
        id: `todo_${Date.now()}`,
        type: "todo" as const,
        title,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "pending" as const,
        properties: {
          due_date: dueDate.toISOString(),
          priority: "medium" as const,
        },
        metadata: { user_id: "clerk_user_123" },
      };

      setBlocks((prev) => [...prev, newTodo]);
      return newTodo;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to create todo"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to update a block
  const updateBlock = async (updatedBlock: BaseBlock) => {
    try {
      setLoading(true);

      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      setBlocks((prev) =>
        prev.map((block) =>
          block.id === updatedBlock.id ? updatedBlock : block,
        ),
      );

      return updatedBlock;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to update block"),
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    events,
    blocks,
    loading,
    error,
    createTodo,
    updateBlock,
  };
};

