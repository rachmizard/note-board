import * as pgCore from "drizzle-orm/pg-core";

export const usersSchema = pgCore.pgTable("users", {
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

export const userSessionProvidersSchema = pgCore.pgTable(
  "user_session_providers",
  {
    id: pgCore.text("id").primaryKey(),
    userId: pgCore.text("user_id").references(() => usersSchema.id, {
      onDelete: "cascade",
    }),
    provider: pgCore.text("provider"),
    providerId: pgCore.text("provider_id"),
    createdAt: pgCore.timestamp("created_at").defaultNow().notNull(),
    updatedAt: pgCore.timestamp("updated_at").defaultNow().notNull(),
  }
);

export type User = typeof usersSchema.$inferSelect;
export type NewUser = typeof usersSchema.$inferInsert;

export type UserSessionProvider =
  typeof userSessionProvidersSchema.$inferSelect;
export type NewUserSessionProvider =
  typeof userSessionProvidersSchema.$inferInsert;
