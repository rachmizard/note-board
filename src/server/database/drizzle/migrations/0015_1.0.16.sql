CREATE TABLE "boards" (
	"id" serial PRIMARY KEY NOT NULL,
	"board_parent_id" integer,
	"board_type" varchar(255) NOT NULL,
	"properties" jsonb,
	"content" jsonb,
	"user_id" text
);
--> statement-breakpoint
ALTER TABLE "boards" ADD CONSTRAINT "boards_board_parent_id_boards_id_fk" FOREIGN KEY ("board_parent_id") REFERENCES "public"."boards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boards" ADD CONSTRAINT "boards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;