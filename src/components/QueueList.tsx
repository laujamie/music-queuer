"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useAction, useMutation } from "convex/react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { api } from "@/convex/_generated/api";
import { ResultMap } from "@/convex/youtube";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { CircleX, DeleteIcon } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import VideoItem from "./VideoItem";

type QueueListProps = {
  queuedVideos: string[];
  queueId?: Id<"queues">;
};

export default function QueueList({ queuedVideos, queueId }: QueueListProps) {
  const [videoDetails, setVideoDetails] = useState<ResultMap | null>(null);
  const getVideoDetails = useAction(api.youtube.list);
  const removeSong = useMutation(api.queues.removeSong);

  const videoDetailsCallback = useCallback(async () => {
    const response = await getVideoDetails({ links: queuedVideos });
    setVideoDetails(response);
  }, [queuedVideos]);

  const videoIds = useMemo(() => {
    return queuedVideos.map((link) => {
      const url = new URL(link);
      return url.searchParams.get("v");
    });
  }, [queuedVideos]);

  useEffect(() => {
    if (queuedVideos != null && queuedVideos.length > 0) videoDetailsCallback();
  }, [queuedVideos, videoDetailsCallback]);

  const cardContent = useMemo(() => {
    if (videoIds.length <= 1) {
      return <p>No videos queued!</p>;
    } else if (videoDetails == null) {
      return Array(3)
        .fill({})
        .map((_, i) => (
          <div className="flex space-x-4" key={`video-placeholder-${i}`}>
            <Skeleton className="h-8 w-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-4" />
            </div>
          </div>
        ));
    }
    return (
      <ul>
        {videoIds.map((videoId, i) => {
          if (videoId == null || i === 0) return null;
          const details = videoDetails?.[videoId];
          if (details == null) return null;
          return (
            <li key={`video-details-${videoId}-${i}`}>
              {i > 1 && <Separator />}
              <VideoItem
                thumbnail={details.thumbnails.default}
                ActionButton={
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      if (queueId == null) return;
                      removeSong({ queueId, position: i });
                    }}
                  >
                    <CircleX className="h-4 w-4" />
                  </Button>
                }
                title={details.title}
                channelTitle={details.channelTitle}
              />
            </li>
          );
        })}
      </ul>
    );
  }, [videoDetails, videoIds]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Queued YouTube Videos</CardTitle>
      </CardHeader>
      <CardContent>{cardContent}</CardContent>
    </Card>
  );
}
