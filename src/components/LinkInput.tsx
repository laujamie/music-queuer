"use client";

import React, { Dispatch, FC, SetStateAction, useState } from "react";

type LinkInputProps = {
  addVideoToQueue: (newQueuedVideo: string) => void;
};

export default function LinkInput({ addVideoToQueue }: LinkInputProps) {
  const [inputLink, setInputLink] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addVideoToQueue(inputLink);
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
          className="text-black"
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
