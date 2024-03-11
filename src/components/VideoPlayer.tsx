"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import ReactPlayer from "react-player";

type VideoPlayerProps = {
  queuedVideos: string[];
  setQueuedVideos: Dispatch<SetStateAction<string[]>>;
};

export default function VideoPlayer({
  queuedVideos,
  setQueuedVideos,
}: VideoPlayerProps) {
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  const handleVideoEnded = () => {
    setQueuedVideos(queuedVideos.slice(1));
  };

  return (
    <>
      {domLoaded && (
        <>
          <ReactPlayer
            url={queuedVideos[0]}
            controls
            onEnded={handleVideoEnded}
            playing
          />
          <button
            type="button"
            className="rounded-full bg-yellow-600	p-3.5 disabled:opacity-50"
            onClick={handleVideoEnded}
            disabled={queuedVideos.length <= 0}
          >
            Skip current video
          </button>
        </>
      )}
    </>
  );
}
