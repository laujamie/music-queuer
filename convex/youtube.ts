import { v } from "convex/values";
import { action } from "./_generated/server";
import {
  search as ytSearch,
  videoDetails,
  channelDetails,
  SnippetObj,
  ThumbnailParentObj,
} from "./lib/youtube";

export const search = action({
  args: { query: v.string(), pageToken: v.optional(v.string()) },
  handler: async (_, args) => {
    return ytSearch(args.query, args.pageToken);
  },
});

type ThumbnailMap = {
  [id: string]: ThumbnailParentObj;
};

type SnippetWithChanThumbnail = SnippetObj & {
  channelThumbnail?: ThumbnailParentObj;
  id: string;
};

export type ResultMap = {
  [id: string]: SnippetWithChanThumbnail;
};

export const list = action({
  args: { links: v.union(v.null(), v.array(v.string())) },
  handler: async (_, args) => {
    if (!args.links || args.links.length === 0) return null;
    const videoIds = args.links.map(
      (link) => new URL(link).searchParams.get("v")!
    );
    const videos = await videoDetails(videoIds);
    const channelIds = videos.items.reduce((acc: string[], item) => {
      if (item.snippet != null) {
        return [...acc, item.snippet.channelId];
      }
      return acc;
    }, []);
    const channels = await channelDetails(channelIds);
    const chanThumbnailMap: ThumbnailMap = channels.items.reduce(
      (acc, item) => {
        if (item.snippet != null) {
          return { ...acc, [item.id]: item.snippet.thumbnails };
        }
        return acc;
      },
      {}
    );
    return videos.items
      .reduce((acc: SnippetWithChanThumbnail[], item) => {
        if (item.snippet != null) {
          return [
            ...acc,
            {
              ...item.snippet,
              id: item.id,
              channelThumbnail: chanThumbnailMap?.[item.snippet.channelId],
            },
          ];
        }
        return acc;
      }, [])
      .reduce((acc: ResultMap, item) => {
        return {
          ...acc,
          [item.id]: item,
        };
      }, {});
  },
});
