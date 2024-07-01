import type { ThumbnailObj } from "@/convex/lib/youtube";
import Image from "next/image";
import type { ReactNode } from "react";

type VideoItemProps = {
  thumbnail: ThumbnailObj;
  title: string;
  channelTitle: string;
  ActionButton?: ReactNode;
};

export default function VideoItem({
  thumbnail,
  title,
  channelTitle,
  ActionButton,
}: VideoItemProps) {
  return (
    <div className="flex space-x-4 items-center py-4">
      <Image
        src={thumbnail.url}
        height={thumbnail.height}
        width={thumbnail.width}
        alt={`Thumbnail for ${title}`}
      />
      <div className="space-y-2">
        <p>{title}</p>
        <p className="font-bold">{channelTitle}</p>
      </div>
      {ActionButton != null && (
        <div className="grow text-right">{ActionButton}</div>
      )}
    </div>
  );
}
