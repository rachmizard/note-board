import { UserJSON, WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

import {
  db,
  NewUser,
  NewUserSessionProvider,
  userSessionProvidersSchema,
  usersSchema,
} from "@/server/database";
import { appEnv } from "@/shared/lib/env";

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

  return new Response("Webhook received", { status: 200 });
}

const createUserFromWebHook = async (json: UserJSON) => {
  const user = await db.insert(usersSchema).values(mapCreateUserFromJson(json));

  return { user };
};

const createUserSessionProvider = async (json: UserJSON) => {
  if (!json.external_accounts) return;

  const sessionProvider = await db
    .insert(userSessionProvidersSchema)
    .values(mapCreateUserSessionProviderFromJson(json));

  return sessionProvider;
};

const mapCreateUserFromJson = (json: UserJSON): NewUser => {
  const [mainEmail] = json.email_addresses;
  return {
    email: mainEmail.email_address,
    id: json.id,
    firstName: json.first_name ?? "",
    lastName: json.last_name ?? "",
    gender: "",
    profilePicture: json.image_url,
    username: json.username ?? "",
  };
};

const mapCreateUserSessionProviderFromJson = (
  json: UserJSON
): NewUserSessionProvider[] => {
  return json.external_accounts.map((account) => ({
    userId: json.id,
    id: account.id,
    provider: account.provider,
    providerId: account.provider_user_id,
  }));
};
