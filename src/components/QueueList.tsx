import { Separator } from "@radix-ui/react-separator";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type QueueListProps = {
  queuedVideos: string[];
};

export default function QueueList({ queuedVideos }: QueueListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Queued YouTube Videos</CardTitle>
      </CardHeader>
      <CardContent>
        {queuedVideos.length > 1 && (
          <>
            <ul className="flex flex-col">
              {queuedVideos.map((videoLink, index) => {
                if (index > 0)
                  return (
                    <li key={`video-item-${index}`} className="py-2">
                      {videoLink}
                    </li>
                  );
              })}
            </ul>
          </>
        )}
        {queuedVideos.length <= 1 && (
          <h1 className="font-bold">Nothing Queued!</h1>
        )}
      </CardContent>
    </Card>
  );
}
