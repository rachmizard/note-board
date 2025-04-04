import { db } from "@/shared/lib/database";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
/**
 * Defines your inner context shape.
 * Add fields here that the inner context brings.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface CreateInnerContextOptions extends Partial<CreateNextContextOptions> {}
/**
 * Inner context. Will always be available in your procedures, in contrast to the outer context.
 *
 * Also useful for:
 * - testing, so you don't have to mock Next.js' `req`/`res`
 * - tRPC's `createServerSideHelpers` where we don't have `req`/`res`
 *
 * @see https://trpc.io/docs/v11/context#inner-and-outer-context
 */
export async function createContextInner(opts?: CreateInnerContextOptions) {
  return {
    db,
    ...opts,
  };
}
/**
 * Outer context. Used in the routers and will e.g. bring `req` & `res` to the context as "not `undefined`".
 *
 * @see https://trpc.io/docs/v11/context#inner-and-outer-context
 */
export async function createContext(opts: CreateNextContextOptions) {
  const contextInner = await createContextInner({ ...opts });
  return {
    ...contextInner,
    req: opts.req,
    res: opts.res,
  };
}
export type Context = Awaited<ReturnType<typeof createContextInner>>;
// The usage in your router is the same as the example above.
