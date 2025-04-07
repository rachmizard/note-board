ALTER TABLE "todo_tags" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "todo_tags" ADD COLUMN "tag_id" integer;--> statement-breakpoint
ALTER TABLE "todo_tags" ADD CONSTRAINT "todo_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;