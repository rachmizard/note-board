CREATE TYPE "public"."todo_priority" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."todo_status" AS ENUM('active', 'completed', 'paused');--> statement-breakpoint
CREATE TABLE "todo" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"due_date" timestamp,
	"priority" "todo_priority" DEFAULT 'medium' NOT NULL,
	"status" "todo_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
