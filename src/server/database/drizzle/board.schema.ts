import * as pgCore from "drizzle-orm/pg-core";
import { users } from "./user.schema";

export const boards = pgCore.pgTable("boards", {
  id: pgCore.serial("id").primaryKey(),
  boardParentId: pgCore
    .integer("board_parent_id")
    .references((): pgCore.AnyPgColumn => boards.id),
  boardType: pgCore.varchar("board_type", { length: 255 }).notNull(),
  properties: pgCore.jsonb("properties").$defaultFn(() => ({})),
  content: pgCore.jsonb("content").$defaultFn(() => ({})),
  userId: pgCore.text("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
});

export type Board = typeof boards.$inferSelect;
export type NewBoard = typeof boards.$inferInsert;
