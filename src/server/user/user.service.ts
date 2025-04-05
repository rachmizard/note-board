import { Database, users } from "../database";
import { CreateUserValidator } from "./user.validator";

export const createUser = async (input: CreateUserValidator, db: Database) => {
  const [user] = await db.insert(users).values(input).returning();
  return user;
};
