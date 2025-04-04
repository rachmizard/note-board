import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { env } from "../env";

// This file can be run to apply migrations programmatically
// e.g., in deployment scripts or initialization logic

async function runMigrations() {
  const sql = neon(env.DATABASE_URL);
  const db = drizzle(sql);

  // This will run all migrations in the migrationFolder
  console.log("Running migrations...");
  await migrate(db, {
    migrationsFolder: "src/lib/database/drizzle/migrations",
  });
  console.log("Migrations completed successfully");
}

// Run migrations directly if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Error running migrations:", error);
      process.exit(1);
    });
}

export { runMigrations };
