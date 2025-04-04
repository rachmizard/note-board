import { createContext } from "@/server/context";
import { appRouter } from "@/server/router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

const handler = async (req: NextRequest) => {
  return fetchRequestHandler({
    createContext,
    endpoint: "/api/trpc",
    req,
    router: appRouter,
  });
};

export { handler as GET, handler as POST };
