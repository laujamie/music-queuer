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
    updatedTime: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_updated_time", ["updatedTime"]),
});
