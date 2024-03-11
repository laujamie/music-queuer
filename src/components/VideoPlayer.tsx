"use client";

import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";

export default function VideoPlayer() {
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    <>
      {domLoaded && (
        <ReactPlayer
          url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          controls
        />
      )}
    </>
  );
}
