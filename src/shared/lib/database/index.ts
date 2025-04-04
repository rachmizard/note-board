import { neon } from "@neondatabase/serverless";
import { drizzle, NeonHttpQueryResultHKT } from "drizzle-orm/neon-http";
import { env } from "../env";
import { PgTransaction } from "drizzle-orm/pg-core";
import { ExtractTablesWithRelations } from "drizzle-orm";

import * as schema from "./drizzle";
export * from "./drizzle";

// Bun automatically loads the DATABASE_URL from .env.local
// Refer to: https://bun.sh/docs/runtime/env for more information
const sql = neon(env.DATABASE_URL);

export const db = drizzle(sql);

export type Database = typeof db;

export type Transaction = PgTransaction<
  NeonHttpQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;
