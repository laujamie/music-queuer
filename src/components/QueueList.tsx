"use client";
import { useCallback, useMemo } from "react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
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
import { ResultMap } from "@/convex/youtube";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { CircleX, LoaderCircleIcon } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import VideoItem from "./VideoItem";
import SortableListItem from "./SortableListItem";
import { MouseSensor, TouchSensor } from "@/lib/dnd";

type QueueListProps = {
  queuedVideos: string[];
  queueId?: Id<"queues">;
  moveQueuedVideo: (currentIndex: number, newIndex: number) => Promise<void>;
  moveLoading: boolean;
  removeSong: (props: {
    queueId: Id<"queues">;
    position: number;
  }) => Promise<void>;
  videoDetails: ResultMap | null;
  removeLoading: boolean;
  videoDetailsLoading: boolean;
  videoDetailsError?: string;
};

export default function QueueList({
  queuedVideos,
  queueId,
  moveQueuedVideo,
  moveLoading,
  removeSong,
  removeLoading,
  videoDetails,
  videoDetailsLoading,
  videoDetailsError,
}: QueueListProps) {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const videoIds = useMemo(() => {
    return queuedVideos
      .map((link) => {
        const url = new URL(link);
        return url.searchParams.get("v") ?? "";
      })
      .filter((id) => id.length > 0);
  }, [queuedVideos]);

  const videoDraggableIds = useMemo(() => {
    return videoIds.map((videoId, i) => `${videoId}-${i}`);
  }, [videoIds]);

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
          items={videoDraggableIds}
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
                <>
                  {i > 1 && <Separator />}
                  <SortableListItem
                    key={`video-details-${videoId}-${i}`}
                    id={`${videoId}-${i}`}
                    disabled={moveLoading}
                  >
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
                          data-no-dnd="true"
                          disabled={removeLoading}
                        >
                          <CircleX className="h-4 w-4" />
                        </Button>
                      }
                      title={details.title}
                      channelTitle={details.channelTitle}
                    />
                  </SortableListItem>
                </>
              );
            })}
          </ul>
        </SortableContext>
      </DndContext>
    );
  }, [
    videoDetails,
    videoIds,
    sensors,
    videoDetailsLoading,
    handleDragEnd,
    moveLoading,
    queueId,
    removeLoading,
    removeSong,
    videoDetailsError,
    videoDraggableIds,
  ]);

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-bold">Up Next</h3>
      {cardContent}
    </div>
  );
}
