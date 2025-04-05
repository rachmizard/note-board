import React, { Suspense } from "react";
import { TodoList } from "./_components/todo-list";

function Page() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Suspense>
        <TodoList />
      </Suspense>
    </div>
  );
}

export default Page;
