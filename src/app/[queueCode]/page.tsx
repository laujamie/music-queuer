"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useMutation, useAction } from "convex/react";
import {
  useSessionMutation,
  useSessionQuery,
} from "convex-helpers/react/sessions";
import { api } from "@/convex/_generated/api";
import VideoPlayer from "@/components/VideoPlayer";
import LinkInput from "@/components/LinkInput";
import QueueList from "@/components/QueueList";
import { useCallback, useState } from "react";
import Search from "@/components/Search";
import ClipboardCopy from "@/components/ClipboardCopy";
import { toast } from "sonner";
import { ResultMap } from "@/convex/youtube";

export default function QueuePage() {
  const params = useParams<{ queueCode: string }>();
  const queueDetails = useSessionQuery(api.queues.getByCode, {
    queueCode: params.queueCode,
  });
  const nextVideo = useMutation(api.queues.nextSong);
  const addVideo = useMutation(api.queues.addSong);
  const becomeHost = useSessionMutation(api.queues.becomeHost);
  const moveQueuedVideo = useMutation(api.queues.moveSong);
  const removeSong = useMutation(api.queues.removeSong);

  const getVideoDetails = useAction(api.youtube.list);

  const [moveLoading, setMoveLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [videoDetails, setVideoDetails] = useState<ResultMap | null>(null);
  const [videoDetailsLoading, setVideoDetailsLoading] = useState(false);
  const [videoDetailsError, setVideoDetailsError] = useState<
    string | undefined
  >(undefined);

  const videoDetailsCallback = useCallback(async () => {
    if (!queueDetails?.videoLinks) return;
    setVideoDetailsLoading(true);
    try {
      const response = await getVideoDetails({
        links: queueDetails?.videoLinks,
      });
      setVideoDetails(response);
      setVideoDetailsError(undefined);
    } catch {
      setVideoDetailsError("Failed to load video details");
    } finally {
      setVideoDetailsLoading(false);
    }
  }, [queueDetails?.videoLinks, getVideoDetails]);

  useEffect(() => {
    if (queueDetails?.videoLinks && queueDetails.videoLinks.length > 0) {
      videoDetailsCallback();
    }
  }, [queueDetails, videoDetailsCallback]);

  const skipVideo = useCallback(async () => {
    if (queueDetails != null) {
      await nextVideo({ queueId: queueDetails.id });
    }
  }, [queueDetails, nextVideo]);

  return (
    <div className="space-y-8">
      {
        /* Only show video player for host of page */
        queueDetails?.hosting && (
          <div className="flex-grow">
            <VideoPlayer
              queuedVideos={queueDetails?.videoLinks ?? []}
              handleVideoEnded={skipVideo}
            />
          </div>
        )
      }
      <QueueList
        moveLoading={moveLoading}
        moveQueuedVideo={async (currentIndex, newIndex) => {
          if (queueDetails != null) {
            await moveQueuedVideo({
              queueId: queueDetails.id,
              currentIndex,
              newIndex,
            });
          }
        }}
        queuedVideos={queueDetails?.videoLinks ?? []}
        queueId={queueDetails?.id}
        removeSong={async ({ queueId, position }) => {
          setRemoveLoading(true);
          try {
            await removeSong({ queueId, position });
          } catch {
            toast.error("Failed to remove song, please try again...");
          } finally {
            setRemoveLoading(false);
          }
        }}
        removeLoading={removeLoading}
        videoDetails={videoDetails}
        videoDetailsLoading={videoDetailsLoading}
        videoDetailsError={videoDetailsError}
      />

      <LinkInput
        queuedVideos={queueDetails?.videoLinks ?? []}
        skipVideo={skipVideo}
        addVideoToQueue={async (newQueuedVideo) => {
          setMoveLoading(true);
          if (queueDetails != null) {
            try {
              await addVideo({
                queueId: queueDetails.id,
                videoUrl: newQueuedVideo,
              });
            } catch {
              toast.error(
                "Failed to update order of queue, please try again..."
              );
            } finally {
              setMoveLoading(false);
            }
          }
        }}
        id={queueDetails?.id}
        becomeHost={async () => {
          if (queueDetails?.id) {
            await becomeHost({ id: queueDetails.id });
          }
        }}
      />

      {queueDetails?.hosting === false && (
        <Search
          addToQueue={async (link) =>
            await addVideo({ videoUrl: link, queueId: queueDetails?.id })
          }
        />
      )}
      <div className="space-y-1">
        <h2>Invite your friends!</h2>
        <ClipboardCopy
          copyText={typeof window !== "undefined" ? window.location.href : ""}
        />
      </div>
    </div>
  );
}
