import { neon } from "@neondatabase/serverless";
import { drizzle, NeonHttpQueryResultHKT } from "drizzle-orm/neon-http";
import { PgTransaction } from "drizzle-orm/pg-core";
import { ExtractTablesWithRelations } from "drizzle-orm";

import * as schema from "./drizzle";
import { appEnv } from "../../shared/lib/env";
export * from "./drizzle";

// Helper function to check if code is running on the server
const isServer = typeof window === "undefined";

// Only initialize the database connection on the server
let db: ReturnType<typeof drizzle>;

if (isServer) {
  // Bun automatically loads the DATABASE_URL from .env.local
  // Refer to: https://bun.sh/docs/runtime/env for more information
  const sql = neon(appEnv.DATABASE_URL);
  db = drizzle(sql);
} else {
  // This will be used on the client side, but it doesn't actually connect to the database
  // It's just a placeholder to prevent errors
  console.warn("Attempted to access database client from the browser");
  // Create a dummy implementation that does nothing when methods are called
  db = {} as unknown as ReturnType<typeof drizzle>;
}

export { db };

export type Database = typeof db;

export type Transaction = PgTransaction<
  NeonHttpQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;
