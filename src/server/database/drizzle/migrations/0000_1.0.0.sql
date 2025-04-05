CREATE TYPE "public"."todo_priority" AS ENUM('low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "public"."todo_status" AS ENUM('inprogress', 'completed', 'backlog', 'archived');--> statement-breakpoint
CREATE TABLE "todo_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"comment" text NOT NULL,
	"todo_id" integer
);
--> statement-breakpoint
CREATE TABLE "todos" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"due_date" timestamp,
	"description" text,
	"priority" "todo_priority" DEFAULT 'medium' NOT NULL,
	"status" "todo_status" DEFAULT 'backlog' NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "todo_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"todo_id" integer
);
--> statement-breakpoint
ALTER TABLE "todo_comments" ADD CONSTRAINT "todo_comments_todo_id_todos_id_fk" FOREIGN KEY ("todo_id") REFERENCES "public"."todos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todo_tags" ADD CONSTRAINT "todo_tags_todo_id_todos_id_fk" FOREIGN KEY ("todo_id") REFERENCES "public"."todos"("id") ON DELETE cascade ON UPDATE no action;