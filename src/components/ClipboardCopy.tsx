"use client";

import { copyTextToClipboard } from "@/lib/copy";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type ClipboardCopyProps = {
  copyText: string;
};

export default function ClipboardCopy({ copyText }: ClipboardCopyProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = () => {
    copyTextToClipboard(copyText)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1500);
      })
      .catch(() => toast.error("Failed to copy text"));
  };

  return (
    <div className="flex gap-x-1.5 items-center">
      <Input type="text" value={copyText} readOnly />
      <Button onClick={handleCopyClick}>
        <span>{isCopied ? "Copied!" : "Copy"}</span>
      </Button>
    </div>
  );
}
