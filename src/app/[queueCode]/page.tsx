"use client";

import { useParams } from "next/navigation";
import {
  useSessionId,
  useSessionMutation,
  useSessionQuery,
} from "convex-helpers/react/sessions";
import { api } from "@/convex/_generated/api";
import VideoPlayer from "@/components/VideoPlayer";
import LinkInput from "@/components/LinkInput";
import QueueList from "@/components/QueueList";
import { useCallback } from "react";

export default function QueuePage() {
  const params = useParams<{ queueCode: string }>();
  const queueDetails = useSessionQuery(api.queues.getByCode, {
    queueCode: params.queueCode,
  });
  const nextVideo = useSessionMutation(api.queues.nextSong);
  const addVideo = useSessionMutation(api.queues.addSong);

  const [sessionId] = useSessionId();
  console.log(sessionId);

  const skipVideo = useCallback(() => {
    if (queueDetails != null) {
      nextVideo({ queueId: queueDetails.id });
    }
  }, [queueDetails, nextVideo]);

  return (
    <div className="space-y-8">
      {
        /* Only show video player for host of page */
        queueDetails?.hosting && (
          <VideoPlayer
            queuedVideos={queueDetails?.videoLinks ?? []}
            handleVideoEnded={skipVideo}
          />
        )
      }
      <LinkInput
        queuedVideos={queueDetails?.videoLinks ?? []}
        skipVideo={skipVideo}
        addVideoToQueue={(newQueuedVideo) => {
          if (queueDetails != null) {
            addVideo({ queueId: queueDetails.id, videoUrl: newQueuedVideo });
          }
        }}
        id={queueDetails?.id}
      />
      <QueueList
        queuedVideos={queueDetails?.videoLinks ?? []}
        queueId={queueDetails?.id}
      />
    </div>
  );
}
