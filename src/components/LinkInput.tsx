"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoaderCircleIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

const LinkInputFormSchema = z.object({
  url: z.string().url(),
});

type LinkInputProps = {
  skipVideo: () => Promise<void>;
  queuedVideos: string[];
  addVideoToQueue: (newQueuedVideo: string) => Promise<void>;
  becomeHost: () => Promise<void>;
  id?: Id<"queues">;
};

export default function LinkInput({
  addVideoToQueue,
  skipVideo,
  queuedVideos,
  id,
  becomeHost,
}: LinkInputProps) {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [skipLoading, setSkipLoading] = useState(false);
  const [hostLoading, setHostLoading] = useState(false);

  const form = useForm<z.infer<typeof LinkInputFormSchema>>({
    resolver: zodResolver(LinkInputFormSchema),
    defaultValues: {
      url: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof LinkInputFormSchema>) => {
    setSubmitLoading(true);
    addVideoToQueue(values.url)
      .then(() => form.reset())
      .catch(() =>
        toast.error("Failed to add video to queue, please try again...")
      )
      .finally(() => setSubmitLoading(false));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>YouTube URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-x-1.5 overflow-auto">
          <Button type="submit" disabled={submitLoading}>
            {submitLoading && (
              <LoaderCircleIcon className="h-4 w-4 animate-spin" />
            )}
            &nbsp;Submit
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setSkipLoading(true);
              skipVideo()
                .catch(() =>
                  toast.error("Failed to skip video, please try again...")
                )
                .finally(() => setSkipLoading(false));
            }}
            disabled={skipLoading || queuedVideos.length <= 0}
            variant="secondary"
          >
            {skipLoading && (
              <LoaderCircleIcon className="h-4 w-4 animate-spin" />
            )}
            &nbsp;Skip current video
          </Button>
          <Button
            variant="secondary"
            disabled={hostLoading || id == null}
            onClick={(e) => {
              e.preventDefault();
              setHostLoading(true);
              becomeHost()
                .then(() => toast.success("You are now the host of this room"))
                .catch(() =>
                  toast.error("Failed to become host, please try again...")
                )
                .finally(() => setHostLoading(false));
            }}
          >
            {hostLoading && (
              <LoaderCircleIcon className="h-4 w-4 animate-spin" />
            )}
            &nbsp;Become Host
          </Button>
        </div>
      </form>
    </Form>
  );
}
