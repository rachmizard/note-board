import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "../env";

// Bun automatically loads the DATABASE_URL from .env.local
// Refer to: https://bun.sh/docs/runtime/env for more information
const sql = neon(env.DATABASE_URL);

export const db = drizzle(sql);
