import { v } from "convex/values";
import { subDays } from "date-fns";
import { mutationWithSession, queryWithSession } from "./lib/auth";
import { generateSlug } from "./lib/slug";
import { QueueState } from "./shared";
import { internalMutation, mutation } from "./_generated/server";

export const removeOldQueues = internalMutation({
  handler: async (ctx) => {
    const now = new Date();
    const queuesToDelete = await ctx.db
      .query("queues")
      .withIndex("by_updated_time", (q) =>
        q.lt("updatedTime", subDays(now, 1).getMilliseconds())
      )
      .collect();
    const usersToDelete = await ctx.db
      .query("users")
      .withIndex("by_creation_time", (q) =>
        q.lt("_creationTime", subDays(now, 14).getMilliseconds())
      )
      .collect();
    const queueDeleteJobs = queuesToDelete.map((queue) =>
      ctx.db.delete(queue._id)
    );
    const userDeleteJobs = usersToDelete.map((user) => ctx.db.delete(user._id));
    return await Promise.all(queueDeleteJobs.concat(userDeleteJobs));
  },
});

export const create = mutationWithSession({
  args: {},
  handler: async (ctx) => {
    let userId = ctx.user?._id;
    if (!userId) {
      const { sessionId } = ctx;
      userId = await ctx.db.insert("users", { sessionId });
    }
    const slug = generateSlug();
    const queueId = await ctx.db.insert("queues", {
      hostId: userId,
      slug,
      links: [],
      updatedTime: new Date().getTime(),
    });
    return { queueId, code: slug };
  },
});

export const get = queryWithSession({
  args: { queueId: v.union(v.null(), v.id("queues")) },
  handler: async (ctx, { queueId }): Promise<QueueState | null> => {
    // TODO: fix this so we don't need this hack to get types to work
    if (!queueId) return null;
    const queue = await ctx.db.get(queueId);
    if (!queue) throw new Error("Queue not found");
    return {
      id: queue._id,
      code: queue.slug,
      hosting: queue.hostId === ctx.user?._id,
      videoLinks: queue.links,
    };
  },
});

export const getByCode = queryWithSession({
  args: { queueCode: v.string() },
  handler: async (ctx, { queueCode }): Promise<QueueState> => {
    const queue = await ctx.db
      .query("queues")
      .withIndex("by_slug", (q) => q.eq("slug", queueCode))
      .order("desc")
      .first();
    if (!queue) throw new Error("Queue not found");
    return {
      id: queue._id,
      code: queue.slug,
      hosting: queue.hostId === ctx.user?._id,
      videoLinks: queue.links,
    };
  },
});

export const join = mutationWithSession({
  args: { queueCode: v.string() },
  handler: async (ctx, { queueCode }) => {
    const queue = await ctx.db
      .query("queues")
      .withIndex("by_slug", (q) => q.eq("slug", queueCode))
      .order("desc")
      .first();
    if (queue) {
      await ctx.db.patch(queue?._id, { updatedTime: new Date().getTime() });
    }
    return queue?._id;
  },
});

export const becomeHost = mutationWithSession({
  args: { id: v.id("queues") },
  handler: async (ctx, { id }) => {
    if (ctx.user == null) throw new Error("User could not be found");
    await ctx.db.patch(id, {
      hostId: ctx.user._id,
      updatedTime: new Date().getTime(),
    });
  },
});

export const addSong = mutation({
  args: { queueId: v.id("queues"), videoUrl: v.string() },
  handler: async (ctx, { queueId, videoUrl }) => {
    const queue = await ctx.db.get(queueId);
    if (queue == null) throw new Error("Queue does not exist");
    await ctx.db.patch(queueId, {
      links: [...queue.links, videoUrl],
      updatedTime: new Date().getTime(),
    });
  },
});

export const nextSong = mutation({
  args: { queueId: v.id("queues") },
  handler: async (ctx, { queueId }) => {
    const queue = await ctx.db.get(queueId);
    if (queue == null) throw new Error("Queue does not exist");
    await ctx.db.patch(queueId, {
      links: queue.links.slice(1),
      updatedTime: new Date().getTime(),
    });
  },
});

export const removeSong = mutation({
  args: { queueId: v.id("queues"), position: v.number() },
  handler: async (ctx, { queueId, position }) => {
    const queue = await ctx.db.get(queueId);
    if (queue == null) throw new Error("Queue does not exist");
    if (position < 0 || position >= queue.links.length)
      throw new Error("Invalid index provided");
    await ctx.db.patch(queueId, {
      links: queue.links.filter((_, i) => i !== position),
      updatedTime: new Date().getTime(),
    });
  },
});

export const moveSong = mutation({
  args: {
    queueId: v.id("queues"),
    currentIndex: v.number(),
    newIndex: v.number(),
  },
  handler: async (ctx, { queueId, currentIndex, newIndex }) => {
    const queue = await ctx.db.get(queueId);
    if (queue == null) {
      throw new Error("Queue does not exist");
    }
    if (currentIndex < 0 || currentIndex >= queue.links.length) {
      throw new Error("Invalid currentIndex");
    }
    if (newIndex < 0 || newIndex >= queue.links.length) {
      throw new Error("Invalid newIndex");
    }
    if (currentIndex === newIndex) {
      return;
    }
    const newLinks: string[] = [...queue.links];
    const temp = newLinks[currentIndex];
    newLinks[currentIndex] = newLinks[newIndex];
    newLinks[newIndex] = temp;
    await ctx.db.patch(queueId, {
      links: newLinks,
      updatedTime: new Date().getTime(),
    });
  },
});
