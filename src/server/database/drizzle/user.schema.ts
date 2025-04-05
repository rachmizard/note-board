import * as pgCore from "drizzle-orm/pg-core";

export const users = pgCore.pgTable("users", {
  id: pgCore.text("id").primaryKey(),
  username: pgCore.text("username").notNull(),
  profilePicture: pgCore.text("profile_picture"),
  firstName: pgCore.text("first_name"),
  lastName: pgCore.text("last_name"),
  bio: pgCore.text("bio"),
  email: pgCore.text("email").notNull(),
  gender: pgCore.text("gender"),
  lastActiveAt: pgCore.timestamp("last_active_at"),
  createdAt: pgCore.timestamp("created_at").defaultNow().notNull(),
  updatedAt: pgCore.timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
