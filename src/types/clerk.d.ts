import { auth } from "@clerk/nextjs/server";

export type Auth = Awaited<ReturnType<typeof auth>>;
