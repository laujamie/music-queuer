"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

const LinkInputFormSchema = z.object({
  url: z.string().url(),
});

type LinkInputProps = {
  skipVideo: () => void;
  queuedVideos: string[];
  addVideoToQueue: (newQueuedVideo: string) => void;
};

export default function LinkInput({
  addVideoToQueue,
  skipVideo,
  queuedVideos,
}: LinkInputProps) {
  const form = useForm<z.infer<typeof LinkInputFormSchema>>({
    resolver: zodResolver(LinkInputFormSchema),
    defaultValues: {
      url: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof LinkInputFormSchema>) => {
    addVideoToQueue(values.url);
    form.reset();
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
        <div className="flex gap-x-1">
          <Button type="submit">Submit</Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              skipVideo();
            }}
            disabled={queuedVideos.length <= 0}
            variant="secondary"
          >
            Skip current video
          </Button>
        </div>
      </form>
    </Form>
  );
}
