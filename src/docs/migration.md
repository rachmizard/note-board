# Database Migration Guide

This guide provides instructions for managing your database schema and migrations using Drizzle ORM.

## Table of Contents
- [Project Setup](#project-setup)
- [Database Schema Files](#database-schema-files)
- [Development Environment](#development-environment)
- [Production Environment](#production-environment)
- [Common Workflows](#common-workflows)
- [Best Practices](#best-practices)

## Project Setup

The project uses Drizzle ORM with PostgreSQL. There are separate configurations for development and production environments:

- Development: `drizzle-dev.config.ts`
- Production: `drizzle-prod.config.ts`

## Database Schema Files

Schema files define your database structure and are located in:
```
src/shared/lib/database/drizzle/*.schema.ts
```

Example of an existing schema file: `todo.schema.ts`

## Development Environment

### Create or Modify Database Schema

1. Create or modify a `.schema.ts` file in `src/shared/lib/database/drizzle/`
   ```typescript
   // Example: user.schema.ts
   import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
   
   export const users = pgTable("users", {
     id: text("id").primaryKey(),
     name: text("name").notNull(),
     createdAt: timestamp("created_at").defaultNow(),
   });
   ```

2. Make sure to import and export your schema in `src/shared/lib/database/drizzle/index.ts`

### Generate Migrations

After modifying your schema, generate migration files:

```bash
# Generate migration files (follow semantic versioning for naming)
bun db:generate --name=1.0.1
```

This creates SQL migration files in `src/shared/lib/database/drizzle/migrations`.

### Apply Migrations

Apply the generated migrations to your development database:

```bash
bun db:migrate
```

### Other Development Commands

- **Push Schema Changes**: Apply schema changes directly (caution: may cause data loss)
  ```bash
  bun db:push
  ```

- **Database Studio**: Open Drizzle Studio to manage your database visually
  ```bash
  bun db:studio
  ```

- **Drop Schema**: Drop database schemas (caution: destructive operation)
  ```bash
  bun db:drop
  ```

## Production Environment

### Create or Modify Database Schema

Follow the same steps as in development to create or modify schema files.

### Generate Production Migrations

```bash
# Generate migration files for production (follow semantic versioning for naming)
bun db:generate:prod --name=1.0.1
```

### Apply Migrations to Production

```bash
bun db:migrate:prod
```

### Other Production Commands

- **Push Schema Changes**: Apply schema changes directly to production (use with extreme caution)
  ```bash
  bun db:push:prod
  ```

- **Database Studio**: Open Drizzle Studio for production database
  ```bash
  bun db:studio:prod
  ```

- **Drop Schema**: Drop production database schemas (extreme caution: destructive operation)
  ```bash
  bun db:drop:prod
  ```

## Common Workflows

### Adding a New Table

1. Create a new schema file in `src/shared/lib/database/drizzle/`:
   ```typescript
   // example.schema.ts
   import { pgTable, text, integer } from "drizzle-orm/pg-core";
   
   export const examples = pgTable("examples", {
     id: text("id").primaryKey(),
     value: integer("value").notNull(),
   });
   ```

2. Update `src/shared/lib/database/drizzle/index.ts` to export the new schema.

3. Generate and apply migrations:
   ```bash
   # For development
   bun db:generate --name=add-examples-table
   bun db:migrate
   
   # For production
   bun db:generate:prod --name=add-examples-table
   bun db:migrate:prod
   ```

### Modifying an Existing Table

1. Update the existing schema file with your changes.

2. Generate and apply migrations:
   ```bash
   # For development
   bun db:generate --name=update-examples-table
   bun db:migrate
   
   # For production
   bun db:generate:prod --name=update-examples-table
   bun db:migrate:prod
   ```

## Best Practices

1. **Version Your Migrations**: Always use descriptive and versioned names for migrations.

2. **Test in Development First**: Always test schema changes and migrations in development before applying to production.

3. **Back Up Production Data**: Always back up your production database before applying migrations.

4. **Avoid Direct Schema Pushes**: For production, prefer using migrations over direct schema pushes to prevent data loss.

5. **Commit Migration Files**: Always commit generated migration files to version control.

6. **Document Schema Changes**: Document significant schema changes for team reference.

7. **Check Migration SQL**: Review the generated SQL in migration files before applying them.
