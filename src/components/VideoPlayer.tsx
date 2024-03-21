"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Button } from "./ui/button";

type VideoPlayerProps = {
  queuedVideos: string[];
  handleVideoEnded: () => void;
};

export default function VideoPlayer({
  queuedVideos,
  handleVideoEnded,
}: VideoPlayerProps) {
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  if (queuedVideos.length === 0) {
    return <p>No video loaded.</p>;
  }

  return (
    domLoaded && (
      <div className="relative pt-[56.25%]">
        <ReactPlayer
          url={queuedVideos[0]}
          controls
          onEnded={handleVideoEnded}
          playing
          width="100%"
          height="100%"
          className="absolute top-0 left-0"
          config={{
            youtube: {
              onUnstarted: () => {
                handleVideoEnded();
              },
            },
          }}
        />
      </div>
    )
  );
}
