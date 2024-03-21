export type ThumbnailObj = {
  height: number;
  url: string;
  width: number;
};

export type ThumbnailParentObj = {
  default: ThumbnailObj;
  high: ThumbnailObj;
  medium: ThumbnailObj;
};

type IdObj = {
  kind: string;
  videoId: string;
};

export type SnippetObj = {
  channelId: string;
  channelTitle: string;
  description: string;
  liveBroadcastContent: string;
  publishTime: string;
  publishedAt: string;
  thumbnails: ThumbnailParentObj;
  title: string;
};

export type SearchObj = {
  etag: string;
  id?: IdObj;
  kind: string;
  snippet?: SnippetObj;
};

type ItemObj = {
  etag: string;
  id: string;
  kind: string;
  snippet?: SnippetObj;
};

type ListResponse<T> = {
  kind: string;
  etag: string;
  nextPageToken: string;
  prevPageToken: string;
  regionCode: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: T[];
};

export type SearchResponse = ListResponse<SearchObj>;
export type VideoResponse = ListResponse<ItemObj>;
export type ChannelResponse = ListResponse<ItemObj>;

const YOUTUBE_DATA_API_BASE_URL = "https://www.googleapis.com/youtube/v3";

/**
 * This function calls the list operation from the YouTube Data API. For more details on the different options
 * that are available, see here: https://developers.google.com/youtube/v3/docs/search/list
 * @param query - Query to search for
 * @param pageToken - Token to retrieve a specific page of results
 * @param parts - Parts to include from the search result (should be set to "snippet")
 * @param types - Types to include ("video", "channel", "playlist")
 * @param maxResults - Maximum number of results to return
 * @returns
 */
export async function search(
  query: string,
  pageToken?: string,
  parts: string[] = ["snippet"],
  types: string[] = ["video"],
  maxResults: number = 10
): Promise<SearchResponse> {
  const reqUrl = new URL(`${YOUTUBE_DATA_API_BASE_URL}/search`);
  const partsStr = parts.join(",");
  const typeStr = types.join(",");
  reqUrl.searchParams.append("part", partsStr);
  reqUrl.searchParams.append("type", typeStr);
  reqUrl.searchParams.append("q", query);
  reqUrl.searchParams.append("key", process.env.YOUTUBE_DATA_API_KEY!);
  reqUrl.searchParams.append("maxResults", String(maxResults));
  if (pageToken != null) {
    reqUrl.searchParams.append("pageToken", pageToken);
  }
  const res = await fetch(reqUrl, {
    method: "GET",
  });
  return res.json() as Promise<SearchResponse>;
}

export async function videoDetails(
  videoIds: string[],
  parts: string[] = ["snippet"],
  maxResults: number = 50
): Promise<VideoResponse> {
  const videoIdsStr = videoIds.join(",");
  const partsStr = parts.join(",");
  const reqUrl = new URL(`${YOUTUBE_DATA_API_BASE_URL}/videos`);
  reqUrl.searchParams.append("id", videoIdsStr);
  reqUrl.searchParams.append("key", process.env.YOUTUBE_DATA_API_KEY!);
  reqUrl.searchParams.append("part", partsStr);
  reqUrl.searchParams.append("maxResults", String(maxResults));
  const res = await fetch(reqUrl, { method: "GET" });
  return res.json() as Promise<VideoResponse>;
}

export async function channelDetails(
  channelIds: string[],
  parts: string[] = ["snippet"],
  maxResults: number = 50
): Promise<ChannelResponse> {
  const reqUrl = new URL(`${YOUTUBE_DATA_API_BASE_URL}/channels`);
  const partsStr = parts.join(",");
  const channelIdStr = channelIds.join(",");
  reqUrl.searchParams.append("id", channelIdStr);
  reqUrl.searchParams.append("part", partsStr);
  reqUrl.searchParams.append("key", process.env.YOUTUBE_DATA_API_KEY!);
  reqUrl.searchParams.append("maxResults", String(maxResults));
  const res = await fetch(reqUrl, { method: "GET" });
  return res.json() as Promise<ChannelResponse>;
}
