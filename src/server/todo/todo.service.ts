import type {
  Database,
  TodoComment,
  TodoWithRelations,
} from "@/server/database";
import {
  type Todo,
  todoComments,
  todoSchema,
  todoTags,
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
  GetTodosRequest,
  RemoveTodoCommentRequest,
  RemoveTodoTagRequest,
  UpdateTodoRequest,
} from "./todo.validator";

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
): Promise<PaginationResponse<TodoWithRelations>> => {
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

  return {
    data: todos,
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
  db: Database
): Promise<void> => {
  await db.insert(todoComments).values(request);
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

export {
  addTodoComment,
  addTodoTag,
  createTodo,
  deleteTodo,
  getTodo,
  getTodoComments,
  getTodos,
  removeTodoComment,
  removeTodoTag,
  updateTodo,
};
