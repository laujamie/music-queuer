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
  const handleVideoEnded = () => {
    setQueuedVideos(queuedVideos.slice(1));
  };

  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  const currVideoURL = queuedVideos[0];

  return (
    <>
      {domLoaded && (
        <ReactPlayer
          url={currVideoURL}
          controls
          onEnded={handleVideoEnded}
          playing
        />
      )}
    </>
  );
}
