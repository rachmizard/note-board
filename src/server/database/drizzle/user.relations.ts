import { relations } from "drizzle-orm";
import { userSessionProviders, users } from "./user.schema";

export const userRelations = relations(users, ({ many }) => ({
  sessionProviders: many(userSessionProviders),
}));

export const userSessionProvidersRelations = relations(
  userSessionProviders,
  ({ one }) => ({
    user: one(users, {
      fields: [userSessionProviders.userId],
      references: [users.id],
    }),
  })
);
