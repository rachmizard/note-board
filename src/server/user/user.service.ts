import { Database, userSessionProvidersSchema, usersSchema } from "../database";
import {
  CreateUserValidator,
  CreateUserSessionProviderValidator,
} from "./user.validator";

export const createUser = async (input: CreateUserValidator, db: Database) => {
  const [user] = await db.insert(usersSchema).values(input).returning();
  return user;
};

export const createUserSessionProvider = async (
  input: CreateUserSessionProviderValidator,
  db: Database
) => {
  const sessionProviders = await db
    .insert(userSessionProvidersSchema)
    .values(input.providers)
    .returning();

  return sessionProviders;
};
