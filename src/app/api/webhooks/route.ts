import { UserJSON, WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

import { db, NewUser, users } from "@/server/database";
import { appEnv } from "@/shared/lib/env";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const SIGNING_SECRET = appEnv.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Narrowing the user.created event
  if (evt.type === "user.created") {
    try {
      await createUserFromWebHook(evt.data);
      return new Response("User created", { status: 200 });
    } catch (err) {
      console.error("Error: Could not create user:", err);
      return new Response("Error: Could not create user", {
        status: 500,
      });
    }
  }

  if (evt.type === "user.updated") {
    try {
      await updateUserFromWebHook(evt.data);
      return new Response("User updated", { status: 200 });
    } catch (error) {
      console.error("Error: Could not update user:", error);
      return new Response("Error: Could not update user", {
        status: 500,
      });
    }
  }

  if (evt.type === "user.deleted") {
    try {
      if (!evt.data.id) {
        throw new Error("User ID is required");
      }
      await db.delete(users).where(eq(users.id, evt.data.id));

      return new Response("User deleted", { status: 200 });
    } catch (error) {
      console.error("Error: Could not delete user:", error);
      return new Response("Error: Could not delete user", {
        status: 500,
      });
    }
  }

  if (evt.type === "session.created") {
    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, evt.data.user_id));

      if (user.length === 0) return new Response("User not found", { status: 404 });
      await db
        .update(users)
        .set({
          lastActiveAt: evt.data.last_active_at
            ? new Date(evt.data.last_active_at)
            : undefined,
        })
        .where(eq(users.id, evt.data.user_id));

      return new Response("Session created", { status: 200 });
    } catch (error) {
      console.error("Error: Could not create user session provider:", error);
      return new Response("Error: Could not create user session provider", {
        status: 500,
      });
    }
  }

  if (evt.type === "session.removed" || evt.type === "session.ended") {
    try {
      await db
        .update(users)
        .set({
          lastActiveAt: evt.data.last_active_at
            ? new Date(evt.data.last_active_at)
            : undefined,
        })
        .where(eq(users.id, evt.data.user_id));

      return new Response("Session ended", { status: 200 });
    } catch (error) {
      console.error("Error: Could not update user session provider:", error);
      return new Response("Error: Could not update user session provider", {
        status: 500,
      });
    }
  }

  return new Response("Webhook received", { status: 200 });
}

const createUserFromWebHook = async (json: UserJSON) => {
  const user = await db.insert(users).values(mapUserFromJson(json));

  return { user };
};

const updateUserFromWebHook = async (json: UserJSON) => {
  // Check if user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.id, json.id));
  if (!existingUser) return;

  const user = await db
    .update(users)
    .set(mapUserFromJson(json))
    .where(eq(users.id, json.id));

  return { user };
};
const mapUserFromJson = (json: UserJSON): NewUser => {
  const [mainEmail] = json.email_addresses;

  const userPayload = {
    email: mainEmail.email_address,
    id: json.id,
    firstName: json.first_name ?? "",
    lastName: json.last_name ?? "",
    gender: "",
    profilePicture: json.image_url,
    username: json.username ?? "",
    lastActiveAt: json.last_active_at
      ? new Date(json.last_active_at)
      : undefined,
  };

  return userPayload;
};
