import * as pgCore from "drizzle-orm/pg-core";
import { users } from "./user.schema";

export const tags = pgCore.pgTable("tags", {
  id: pgCore.serial("id").primaryKey(),
  name: pgCore.text("name").notNull(),
  type: pgCore.text("type").notNull(),
  userId: pgCore
    .text("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .$default(() => ""),
  createdAt: pgCore.timestamp("created_at").defaultNow().notNull(),
  updatedAt: pgCore.timestamp("updated_at").defaultNow().notNull(),
});

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
