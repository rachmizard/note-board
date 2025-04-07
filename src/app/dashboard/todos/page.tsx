import React, { Suspense } from "react";
import { TodoList } from "./_components/todo-list";
import { TodoListSkeleton } from "./_components/todo-list-skeleton";
function Page() {
  return (
    <div className="container mx-auto pt-4 px-4">
      <Suspense fallback={<TodoListSkeleton />}>
        <TodoList />
      </Suspense>
    </div>
  );
}

export default Page;
