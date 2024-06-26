"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type ClipboardCopyProps = {
  copyText: string;
};

export default function ClipboardCopy({ copyText }: ClipboardCopyProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyTextToClipboard = async (text: string) => {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    }
    return document.execCommand("copy", true, text);
  };

  const handleCopyClick = () => {
    copyTextToClipboard(copyText)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1500);
      })
      .catch(() => toast.error("Failed to copy text"));
  };

  return (
    <div className="flex">
      <Input type="text" value={copyText} readOnly />
      <Button onClick={handleCopyClick}>
        <span>{isCopied ? "Copied!" : "Copy"}</span>
      </Button>
    </div>
  );
}
