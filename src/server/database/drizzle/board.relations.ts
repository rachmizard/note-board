import { relations } from "drizzle-orm";
import { boards } from "./board.schema";
import { users } from "./user.schema";

export const boardRelations = relations(boards, ({ one, many }) => ({
  boardParent: one(boards, {
    fields: [boards.boardParentId],
    references: [boards.id],
  }),
  boardChildren: many(boards, {
    relationName: "boardChildren",
  }),
  boardUser: one(users, {
    fields: [boards.userId],
    references: [users.id],
  }),
}));
