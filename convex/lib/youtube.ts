type ThumbnailObj = {
  height: number;
  url: string;
  width: number;
};

type IdObj = {
  kind: string;
  videoId: string;
};

type SnippetObj = {
  channelId: string;
  channelTitle: string;
  description: string;
  liveBroadcastContent: string;
  publishTime: string;
  publishedAt: string;
  thumbnails: {
    default: ThumbnailObj;
    high: ThumbnailObj;
    medium: ThumbnailObj;
  };
  title: string;
};

type ItemObj = {
  etag: string;
  id?: IdObj;
  kind: string;
  snippet?: SnippetObj;
};

type ListResponse = {
  kind: string;
  etag: string;
  nextPageToken: string;
  prevPageToken: string;
  regionCode: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: ItemObj[];
};

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
export async function list(
  query: string,
  pageToken?: string,
  parts: string[] = ["snippet"],
  types: string[] = ["video"],
  maxResults: number = 10
): Promise<ListResponse> {
  const reqUrl = new URL(`${YOUTUBE_DATA_API_BASE_URL}/search`);
  parts.forEach((part) => reqUrl.searchParams.append("part", part));
  types.forEach((type) => reqUrl.searchParams.append("type", type));
  reqUrl.searchParams.append("q", query);
  reqUrl.searchParams.append("key", process.env.YOUTUBE_DATA_API_KEY!);
  reqUrl.searchParams.append("maxResults", String(maxResults));
  if (pageToken != null) {
    reqUrl.searchParams.append("pageToken", pageToken);
  }
  const res = await fetch(reqUrl, {
    method: "GET",
  });
  return res.json() as Promise<ListResponse>;
}
