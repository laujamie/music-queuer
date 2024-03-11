"use client";

import LinkInput from "@/components/LinkInput";
import VideoPlayer from "@/components/VideoPlayer";
import { useState } from "react";

export default function Home() {
  const [queuedVideos, setQueuedVideos] = useState<string[]>([]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <VideoPlayer
        queuedVideos={queuedVideos}
        setQueuedVideos={setQueuedVideos}
      />
      <LinkInput
        queuedVideos={queuedVideos}
        setQueuedVideos={setQueuedVideos}
      />
    </main>
  );
}
