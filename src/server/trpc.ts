import { createTRPCReact } from "@trpc/react-query";

// Import the type only, not the actual implementation
import type { AppRouter } from "@/server/router";

export const trpc = createTRPCReact<AppRouter>();
