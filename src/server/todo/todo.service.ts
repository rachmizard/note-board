import type {
  Database,
  TodoComment,
  TodoSubTask,
  TodoWithRelations,
} from "@/server/database";
import {
  type Todo,
  todoComments,
  todoSchema,
  todoTags,
  todoSubTasks,
} from "@/server/database/drizzle/todo.schema";
import type { PaginationResponse } from "@/server/types/response";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, SQL, sql } from "drizzle-orm";
import type { Context } from "../context";
import type {
  AddTodoCommentRequest,
  AddTodoTagRequest,
  CreateTodoRequest,
  DeleteTodoRequest,
  GetTodoCommentsRequest,
  GetTodoRequest,
  GetTodoSubTasksRequest,
  GetTodosRequest,
  RemoveTodoCommentRequest,
  RemoveTodoTagRequest,
  UpdateTodoRequest,
  AddTodoSubTaskRequest,
  UpdateTodoSubTaskRequest,
  RemoveTodoSubTaskRequest,
} from "./todo.validator";

// Enhanced Todo type with subtask counts
interface TodoWithSubTaskCounts extends Omit<TodoWithRelations, "subTasks"> {
  subTasks: {
    data: TodoSubTask[];
    total: number;
    completed: number;
  };
}

const createTodo = async (
  request: CreateTodoRequest,
  context: Context
): Promise<Todo> => {
  const { auth, db } = context;

  if (!auth || !auth.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  }

  const [todo] = await db
    .insert(todoSchema)
    .values({
      ...request,
      userId: auth.userId,
    })
    .returning();
  return todo;
};

/**
 * Get todos with pagination
 *
 * @param db Database instance
 * @param options Pagination options
 * @returns Paginated todos
 */
const getTodos = async (
  request: GetTodosRequest,
  context: Context
): Promise<PaginationResponse<TodoWithSubTaskCounts>> => {
  if (!context.auth || !context.auth.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  }

  const { page = 1, limit = 10 } = request;
  const offset = (page - 1) * limit;

  const whereClauses: SQL[] = [eq(todoSchema.userId, context.auth.userId)];

  if (request.status) {
    whereClauses.push(eq(todoSchema.status, request.status));
  }

  // Execute the main query with pagination
  const todos = await context.db.query.todoSchema.findMany({
    where: whereClauses.length > 0 ? and(...whereClauses) : undefined,
    with: {
      tags: true,
      comments: {
        orderBy: [desc(todoComments.createdAt)],
      },
      subTasks: true,
    },
    orderBy: [desc(todoSchema.createdAt)],
    offset,
    limit,
  });

  // Get total count for pagination
  const [{ count }] = await context.db
    .select({
      count: sql`count(*)`,
    })
    .from(todoSchema);

  // Process subtasks information for each todo
  const todosWithSubTaskCounts = todos.map((todo) => {
    const subTasksTotal = todo.subTasks?.length || 0;
    const subTasksCompleted =
      todo.subTasks?.filter((task) => task.completed).length || 0;

    return {
      ...todo,
      subTasks: {
        data: todo.subTasks || [],
        total: subTasksTotal,
        completed: subTasksCompleted,
      },
    };
  });

  return {
    data: todosWithSubTaskCounts,
    total: Number(count),
    page,
    limit,
  };
};

const deleteTodo = async (
  request: DeleteTodoRequest,
  db: Database
): Promise<void> => {
  await db.delete(todoSchema).where(eq(todoSchema.id, Number(request.id)));
};

const updateTodo = async (
  request: UpdateTodoRequest,
  db: Database
): Promise<void> => {
  const findTodo = await db
    .select()
    .from(todoSchema)
    .where(eq(todoSchema.id, Number(request.id)));

  if (!findTodo) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Todo not found",
    });
  }

  await db
    .update(todoSchema)
    .set(request)
    .where(eq(todoSchema.id, Number(request.id)));
};

const getTodo = async (
  request: GetTodoRequest,
  db: Database
): Promise<Todo> => {
  const [todo] = await db
    .select()
    .from(todoSchema)
    .where(eq(todoSchema.id, Number(request.id)));
  return todo;
};

const addTodoTag = async (
  request: AddTodoTagRequest,
  db: Database
): Promise<void> => {
  await db.insert(todoTags).values(request);
};

const removeTodoTag = async (
  request: RemoveTodoTagRequest,
  db: Database
): Promise<void> => {
  await db.delete(todoTags).where(eq(todoTags.id, Number(request.tagId)));
};

const addTodoComment = async (
  request: AddTodoCommentRequest,
  context: Context
): Promise<void> => {
  if (!context.auth || !context.auth.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  }

  await context.db.insert(todoComments).values({
    ...request,
    userId: context.auth.userId,
  });
};

const removeTodoComment = async (
  request: RemoveTodoCommentRequest,
  db: Database
): Promise<void> => {
  await db
    .delete(todoComments)
    .where(eq(todoComments.id, Number(request.commentId)));
};

const getTodoComments = async (
  request: GetTodoCommentsRequest,
  db: Database
): Promise<TodoComment[]> => {
  return await db.query.todoComments.findMany({
    where: eq(todoComments.todoId, Number(request.todoId)),
  });
};

/**
 * Get subtasks for a specific todo with pagination
 *
 * @param request GetTodoSubTasksRequest
 * @param context Context
 * @returns Paginated subtasks
 */
const getTodoSubTasks = async (
  request: GetTodoSubTasksRequest,
  context: Context
): Promise<PaginationResponse<TodoSubTask>> => {
  if (!context.auth || !context.auth.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  }

  const { todoId, page = 1, limit = 10 } = request;
  const offset = (page - 1) * limit;

  // Verify todo belongs to the authenticated user
  const [todo] = await context.db
    .select()
    .from(todoSchema)
    .where(
      and(
        eq(todoSchema.id, Number(todoId)),
        eq(todoSchema.userId, context.auth.userId)
      )
    );

  if (!todo) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Todo not found or access denied",
    });
  }

  // Get subtasks with pagination
  const subtasks = await context.db.query.todoSubTasks.findMany({
    where: eq(todoSubTasks.todoId, Number(todoId)),
    orderBy: [desc(todoSubTasks.createdAt)],
    offset,
    limit,
  });

  // Get total count for pagination
  const [{ count }] = await context.db
    .select({
      count: sql`count(*)`,
    })
    .from(todoSubTasks)
    .where(eq(todoSubTasks.todoId, Number(todoId)));

  return {
    data: subtasks,
    total: Number(count),
    page,
    limit,
  };
};

/**
 * Add a subtask to a todo
 */
const addTodoSubTask = async (
  request: AddTodoSubTaskRequest,
  context: Context
): Promise<TodoSubTask> => {
  if (!context.auth || !context.auth.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  }

  // Verify todo belongs to the authenticated user
  const [todo] = await context.db
    .select()
    .from(todoSchema)
    .where(
      and(
        eq(todoSchema.id, Number(request.todoId)),
        eq(todoSchema.userId, context.auth.userId)
      )
    );

  if (!todo) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Todo not found or access denied",
    });
  }

  const [subtask] = await context.db
    .insert(todoSubTasks)
    .values({
      todoId: request.todoId,
      title: request.title,
      completed: false,
    })
    .returning();

  return subtask;
};

/**
 * Update a subtask
 */
const updateTodoSubTask = async (
  request: UpdateTodoSubTaskRequest,
  context: Context
): Promise<void> => {
  if (!context.auth || !context.auth.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  }

  // Verify todo belongs to the authenticated user
  const [todo] = await context.db
    .select()
    .from(todoSchema)
    .where(
      and(
        eq(todoSchema.id, Number(request.todoId)),
        eq(todoSchema.userId, context.auth.userId)
      )
    );

  if (!todo) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Todo not found or access denied",
    });
  }

  // Verify subtask exists and belongs to the todo
  const [subtask] = await context.db
    .select()
    .from(todoSubTasks)
    .where(
      and(
        eq(todoSubTasks.id, Number(request.id)),
        eq(todoSubTasks.todoId, Number(request.todoId))
      )
    );

  if (!subtask) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Subtask not found",
    });
  }

  // Update the subtask
  await context.db
    .update(todoSubTasks)
    .set({
      title: request.title,
      completed: request.completed,
      updatedAt: new Date(),
    })
    .where(eq(todoSubTasks.id, Number(request.id)));
};

/**
 * Remove a subtask
 */
const removeTodoSubTask = async (
  request: RemoveTodoSubTaskRequest,
  context: Context
): Promise<void> => {
  if (!context.auth || !context.auth.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  }

  // Verify todo belongs to the authenticated user
  const [todo] = await context.db
    .select()
    .from(todoSchema)
    .where(
      and(
        eq(todoSchema.id, Number(request.todoId)),
        eq(todoSchema.userId, context.auth.userId)
      )
    );

  if (!todo) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Todo not found or access denied",
    });
  }

  // Delete the subtask
  await context.db
    .delete(todoSubTasks)
    .where(
      and(
        eq(todoSubTasks.id, Number(request.id)),
        eq(todoSubTasks.todoId, Number(request.todoId))
      )
    );
};

export {
  addTodoComment,
  addTodoSubTask,
  addTodoTag,
  createTodo,
  deleteTodo,
  getTodo,
  getTodoComments,
  getTodoSubTasks,
  getTodos,
  removeTodoComment,
  removeTodoSubTask,
  removeTodoTag,
  updateTodo,
  updateTodoSubTask,
};
