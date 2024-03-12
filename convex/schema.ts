import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { vSessionId } from "convex-helpers/server/sessions";

export default defineSchema({
  users: defineTable({
    sessionId: vSessionId,
  }).index("by_session_id", ["sessionId"]),
  queues: defineTable({
    slug: v.string(),
    links: v.array(v.string()),
    hostId: v.id("users"),
  }).index("by_slug", ["slug"]),
});
