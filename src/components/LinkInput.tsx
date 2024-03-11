"use client";

import React, { Dispatch, FC, SetStateAction, useState } from "react";

type LinkInputProps = {
  queuedVideos: string[];
  setQueuedVideos: Dispatch<SetStateAction<string[]>>;
};

export default function LinkInput({
  queuedVideos,
  setQueuedVideos,
}: LinkInputProps) {
  const [inputLink, setInputLink] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newQueuedVideos = [...queuedVideos];
    newQueuedVideos.push(inputLink);
    setQueuedVideos(newQueuedVideos);
    setInputLink("");
  };

  return (
    <>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <label htmlFor="url">Enter a Youtube https:// URL:</label>
        <input
          type="url"
          name="url"
          id="url"
          placeholder={inputLink}
          pattern="https://.*"
          size={30}
          required
          onChange={(e) => setInputLink(e.target.value)}
          value={inputLink}
        />
      </form>
    </>
  );
}
