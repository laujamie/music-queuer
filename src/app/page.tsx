"use client";
import { useState } from "react";
import { useSessionMutation } from "convex-helpers/react/sessions";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [roomCode, setRoomCode] = useState("");
  const [createRoomLoading, setCreateRoomLoading] = useState(false);
  const [joinRoomLoading, setJoinRoomLoading] = useState(false);

  const createRoom = useSessionMutation(api.queues.create);
  const joinRoom = useSessionMutation(api.queues.join);

  const router = useRouter();

  return (
    <>
      <section className="flex flex-col gap-y-4 justify-center items-center">
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
      </section>
      <Separator className="my-16" />
      <section className="flex flex-col gap-y-4">
        <h2 className="text-xl font-semibold">What is this website?</h2>
        <p>
          The goal of this website is to let you easily play YouTube videos at
          home with the ability to queue up videos, similar to how a karaoke
          tablet would work. The videos play on the host, while everyone else
          can connect to the room to suggest songs.
        </p>
        <p>
          To get started, you can host a room, connect the screen to a TV, and
          then share the link with friends!
        </p>
      </section>
    </>
  );
}
