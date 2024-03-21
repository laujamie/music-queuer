"use client";

import { useParams } from "next/navigation";
import { useMutation } from "convex/react";
import { useSessionQuery } from "convex-helpers/react/sessions";
import { api } from "@/convex/_generated/api";
import VideoPlayer from "@/components/VideoPlayer";
import LinkInput from "@/components/LinkInput";
import QueueList from "@/components/QueueList";
import { useCallback } from "react";
import Search from "@/components/Search";
import ClipboardCopy from "@/components/ClipboardCopy";

export default function QueuePage() {
  const params = useParams<{ queueCode: string }>();
  const queueDetails = useSessionQuery(api.queues.getByCode, {
    queueCode: params.queueCode,
  });
  const nextVideo = useMutation(api.queues.nextSong);
  const addVideo = useMutation(api.queues.addSong);

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
      {queueDetails?.hosting === false && (
        <Search
          addToQueue={async (link) =>
            await addVideo({ videoUrl: link, queueId: queueDetails?.id })
          }
        />
      )}
      <div className="space-y-1">
        <h2>Invite your friends!</h2>
        <ClipboardCopy copyText={window.location.href} />
      </div>
    </div>
  );
}
