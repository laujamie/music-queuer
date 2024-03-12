import {
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import { SessionId, SessionIdArg } from "convex-helpers/server/sessions";
import { DatabaseReader, mutation, query } from "../_generated/server";

async function getUser(db: DatabaseReader, sessionId: SessionId) {
  let user = await db
    .query("users")
    .withIndex("by_session_id", (q) => q.eq("sessionId", sessionId))
    .unique();
  return user;
}

export const mutationWithSession = customMutation(mutation, {
  args: SessionIdArg,
  async input(ctx, { sessionId }) {
    const user = await getUser(ctx.db, sessionId);
    return { ctx: { ...ctx, user, sessionId }, args: {} };
  },
});

export const queryWithSession = customQuery(query, {
  args: SessionIdArg,
  async input(ctx, { sessionId }) {
    const user = await getUser(ctx.db, sessionId);
    return { ctx: { ...ctx, user, sessionId }, args: {} };
  },
});
