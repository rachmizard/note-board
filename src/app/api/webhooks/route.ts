import { UserJSON, WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

import {
  db,
  NewUser,
  NewUserSessionProvider,
  userSessionProviders,
  users,
} from "@/server/database";
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
  // Narrate the user.created event
  if (evt.type === "user.created") {
    try {
      await createUserFromWebHook(evt.data);
      if (evt.data.external_accounts) {
        await createUserSessionProvider(evt.data);
      }
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

      if (evt.data.external_accounts) {
        await updateUserSessionProviderFromWebHook(evt.data);
      }
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
    } catch (error) {
      console.error("Error: Could not delete user:", error);
      return new Response("Error: Could not delete user", {
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

const createUserSessionProvider = async (json: UserJSON) => {
  if (!json.external_accounts) return;

  const sessionProvider = await db
    .insert(userSessionProviders)
    .values(mapUserSessionProviderFromJson(json));

  return sessionProvider;
};

const updateUserFromWebHook = async (json: UserJSON) => {
  const user = await db
    .update(users)
    .set(mapUserFromJson(json))
    .where(eq(users.id, json.id));

  return { user };
};

const updateUserSessionProviderFromWebHook = async (json: UserJSON) => {
  const sessionProvider = await db
    .update(userSessionProviders)
    .set({
      id: json.id,
      ...mapUserSessionProviderFromJson(json),
    })
    .where(eq(userSessionProviders.userId, json.id));

  return { sessionProvider };
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

const mapUserSessionProviderFromJson = (
  json: UserJSON
): NewUserSessionProvider[] => {
  return json.external_accounts.map((account) => ({
    userId: json.id,
    id: account.id,
    provider: account.provider,
    providerId: account.provider_user_id,
  }));
};
