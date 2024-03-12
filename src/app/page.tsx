"use client";
import { useState, useEffect } from "react";
import {
  useSessionMutation,
  useSessionQuery,
} from "convex-helpers/react/sessions";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { redirect } from "next/navigation";

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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button
        onClick={async () => {
          const id = await createRoom();
          setQueueId(id);
        }}
      >
        Host Room
      </button>
      <div className="flex flex-col gap-1">
        <input value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
        <button
          onClick={async () => {
            const id = await joinRoom({ queueCode: roomCode });
            setQueueId(id);
          }}
        >
          Join Room
        </button>
      </div>
    </main>
  );
}
