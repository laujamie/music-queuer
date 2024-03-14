import { v } from "convex/values";
import { action } from "./_generated/server";
import { list } from "./lib/youtube";

export const search = action({
  args: { query: v.string(), pageToken: v.optional(v.string()) },
  handler: async (_, args) => {
    return await list(args.query, args.pageToken);
  },
});
