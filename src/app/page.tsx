"use client";
import { useState, useEffect } from "react";
import {
  useSessionMutation,
  useSessionQuery,
} from "convex-helpers/react/sessions";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [roomCode, setRoomCode] = useState("");
  const [queueId, setQueueId] = useState<Id<"queues"> | null>(null);

  const createRoom = useSessionMutation(api.queues.create);
  const joinRoom = useSessionMutation(api.queues.join);

  const queueDetails = useSessionQuery(api.queues.get, { queueId });

  useEffect(() => {
    if (queueDetails?.code != null) {
      redirect(`/${queueDetails.code}`);
    }
  }, [queueDetails?.code]);

  return (
    <div className="space-y-8 items-center p-24">
      <Button
        onClick={async () => {
          console.log("hi");
          const id = await createRoom();
          setQueueId(id);
        }}
      >
        Host Room
      </Button>
      <div className="space-y-4">
        <Input value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
        <Button
          onClick={async () => {
            const id = await joinRoom({ queueCode: roomCode });
            setQueueId(id);
          }}
        >
          Join Room
        </Button>
      </div>
    </div>
  );
}
