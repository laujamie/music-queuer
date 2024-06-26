"use client";

import { useParams } from "next/navigation";
import { useMutation } from "convex/react";
import {
  useSessionMutation,
  useSessionQuery,
} from "convex-helpers/react/sessions";
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
  const becomeHost = useSessionMutation(api.queues.becomeHost);

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
        queuedVideos={queueDetails?.videoLinks ?? []}
        queueId={queueDetails?.id}
      />

      <LinkInput
        queuedVideos={queueDetails?.videoLinks ?? []}
        skipVideo={skipVideo}
        addVideoToQueue={async (newQueuedVideo) => {
          if (queueDetails != null) {
            await addVideo({
              queueId: queueDetails.id,
              videoUrl: newQueuedVideo,
            });
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
        <ClipboardCopy copyText={window.location.href} />
      </div>
    </div>
  );
}
