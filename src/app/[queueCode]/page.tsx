"use client";

import { useParams } from "next/navigation";
import {
  useSessionMutation,
  useSessionQuery,
} from "convex-helpers/react/sessions";
import { api } from "@/convex/_generated/api";
import VideoPlayer from "@/components/VideoPlayer";
import LinkInput from "@/components/LinkInput";
import QueueList from "@/components/QueueList";

export default function QueuePage() {
  const params = useParams<{ queueCode: string }>();
  const queueDetails = useSessionQuery(api.queues.getByCode, {
    queueCode: params.queueCode,
  });
  const nextVideo = useSessionMutation(api.queues.nextSong);
  const addVideo = useSessionMutation(api.queues.addSong);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <VideoPlayer
        queuedVideos={queueDetails?.videoLinks ?? []}
        handleVideoEnded={() => {
          if (queueDetails != null) {
            nextVideo({ queueId: queueDetails.id });
          }
        }}
      />
      <LinkInput
        addVideoToQueue={(newQueuedVideo) => {
          if (queueDetails != null) {
            addVideo({ queueId: queueDetails.id, videoUrl: newQueuedVideo });
          }
        }}
      />
      <QueueList queuedVideos={queueDetails?.videoLinks ?? []} />
    </main>
  );
}
