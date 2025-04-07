"use client";
import { trpc } from "@/server/trpc";
export const TodoSidebarMenuBadge = () => {
  const [count] = trpc.todo.getTodosCount.useSuspenseQuery();
  if (!count) return null;

  return <p>{count}</p>;
};
