import { relations } from "drizzle-orm";
import { tags } from "./tag.schema";
import { users } from "./user.schema";

export const tagRelations = relations(tags, ({ one }) => ({
  user: one(users, {
    fields: [tags.userId],
    references: [users.id],
  }),
}));
