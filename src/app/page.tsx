"use client";
import { useState } from "react";
import { useSessionMutation } from "convex-helpers/react/sessions";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [roomCode, setRoomCode] = useState("");

  const createRoom = useSessionMutation(api.queues.create);
  const joinRoom = useSessionMutation(api.queues.join);

  const router = useRouter();

  return (
    <div className="flex gap-x-4 justify-center items-center">
      <Button
        onClick={async () => {
          try {
            const { code } = await createRoom();
            router.push(`/${code}`);
          } catch (e) {
            toast.error("Failed to create room");
          }
        }}
      >
        Host Room
      </Button>
      <Separator orientation="vertical" className="h-full" />
      <div className="space-y-4">
        <Input value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
        <Button
          onClick={async () => {
            try {
              await joinRoom({ queueCode: roomCode });
              router.push(`/${roomCode}`);
            } catch {
              toast.error(`Failed to join room with code ${roomCode}`);
            }
          }}
        >
          Join Room
        </Button>
      </div>
    </div>
  );
}
