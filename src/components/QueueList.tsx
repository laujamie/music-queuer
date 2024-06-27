"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useAction, useMutation } from "convex/react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { ResultMap } from "@/convex/youtube";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { CircleX, LoaderCircleIcon } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import VideoItem from "./VideoItem";
import SortableListItem from "./SortableListItem";

type QueueListProps = {
  queuedVideos: string[];
  queueId?: Id<"queues">;
  moveQueuedVideo: (currentIndex: number, newIndex: number) => Promise<void>;
  moveLoading: boolean;
};

export default function QueueList({
  queuedVideos,
  queueId,
  moveQueuedVideo,
  moveLoading,
}: QueueListProps) {
  const [videoDetails, setVideoDetails] = useState<ResultMap | null>(null);
  const getVideoDetails = useAction(api.youtube.list);
  const removeSong = useMutation(api.queues.removeSong);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const [videoDetailsError, setVideoDetailsError] = useState<
    string | undefined
  >(undefined);
  const [videoDetailsLoading, setVideoDetailsLoading] = useState(false);

  const videoDetailsCallback = useCallback(async () => {
    setVideoDetailsLoading(true);
    try {
      const response = await getVideoDetails({
        links: queuedVideos,
      });
      setVideoDetails(response);
      setVideoDetailsError(undefined);
    } catch {
      setVideoDetailsError("Failed to load video details");
    } finally {
      setVideoDetailsLoading(false);
    }
  }, [queuedVideos]);

  const videoIds = useMemo(() => {
    return queuedVideos
      .map((link) => {
        const url = new URL(link);
        return url.searchParams.get("v") ?? "";
      })
      .filter((id) => id.length > 0);
  }, [queuedVideos]);

  const handleDragEnd = useCallback(
    (e: DragEndEvent) => {
      const { active, over } = e;

      if (over && active.id !== over.id) {
        const oldIdx = videoIds.indexOf(active.id as string);
        const newIdx = videoIds.indexOf(over.id as string);

        moveQueuedVideo(oldIdx, newIdx);
      }
    },
    [moveQueuedVideo, videoIds]
  );

  useEffect(() => {
    if (queuedVideos != null && queuedVideos.length > 0) videoDetailsCallback();
  }, [queuedVideos, videoDetailsCallback]);

  const cardContent = useMemo(() => {
    if (videoIds.length <= 1) {
      return <p>No videos queued!</p>;
    } else if (videoDetailsError) {
      return <p className="text-red-500">Failed to load video details...</p>;
    } else if (videoDetails == null && videoDetailsLoading) {
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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={videoIds}
          strategy={verticalListSortingStrategy}
        >
          {moveLoading && (
            <p>
              <LoaderCircleIcon className="h-4 w-4 animate-spin" />
              Updating queue...
            </p>
          )}
          <ul>
            {videoIds.map((videoId, i) => {
              if (i === 0) return null;
              const details = videoDetails?.[videoId];
              if (details == null) return null;
              return (
                <SortableListItem
                  key={`video-details-${videoId}-${i}`}
                  id={videoId}
                  disabled={moveLoading}
                >
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
                </SortableListItem>
              );
            })}
          </ul>
        </SortableContext>
      </DndContext>
    );
  }, [videoDetails, videoIds, sensors, videoDetailsLoading, handleDragEnd]);

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-bold">Up Next</h3>
      {cardContent}
    </div>
  );
}
