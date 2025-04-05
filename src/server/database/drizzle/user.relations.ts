import { relations } from "drizzle-orm";
import { userSessionProvidersSchema, usersSchema } from "./user.schema";

export const userRelations = relations(usersSchema, ({ many }) => ({
  sessionProviders: many(userSessionProvidersSchema),
}));

export const userSessionProvidersRelations = relations(
  userSessionProvidersSchema,
  ({ one }) => ({
    user: one(usersSchema, {
      fields: [userSessionProvidersSchema.userId],
      references: [usersSchema.id],
    }),
  })
);
