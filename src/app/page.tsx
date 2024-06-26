"use client";
import { useState } from "react";
import { useSessionMutation } from "convex-helpers/react/sessions";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [roomCode, setRoomCode] = useState("");
  const [createRoomLoading, setCreateRoomLoading] = useState(false);
  const [joinRoomLoading, setJoinRoomLoading] = useState(false);

  const createRoom = useSessionMutation(api.queues.create);
  const joinRoom = useSessionMutation(api.queues.join);

  const router = useRouter();

  return (
    <div className="flex flex-col gap-y-4 justify-center items-center">
      <div className="flex gap-x-4">
        <Input
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          placeholder="ABCD"
        />
        <Button
          disabled={createRoomLoading || joinRoomLoading}
          onClick={async () => {
            setCreateRoomLoading(true);
            try {
              await joinRoom({ queueCode: roomCode });
              router.push(`/${roomCode}`);
            } catch {
              toast.error(`Failed to join room with code ${roomCode}`);
            } finally {
              setCreateRoomLoading(false);
            }
          }}
        >
          {createRoomLoading && (
            <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
          )}{" "}
          Join Room
        </Button>
      </div>
      <Button
        variant="secondary"
        disabled={joinRoomLoading || createRoomLoading}
        onClick={async () => {
          setJoinRoomLoading(true);
          try {
            const { code } = await createRoom();
            router.push(`/${code}`);
          } catch (e) {
            toast.error("Failed to create room");
          } finally {
            setJoinRoomLoading(false);
          }
        }}
      >
        {joinRoomLoading && (
          <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
        )}{" "}
        Host Room
      </Button>
    </div>
  );
}
