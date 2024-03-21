"use client";
import { useCallback, useState } from "react";
import { useAction } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Search as SearchIcon } from "lucide-react";
import { z } from "zod";
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { Input } from "./ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Button } from "./ui/button";
import type { SearchObj } from "@/convex/lib/youtube";

const formSchema = z.object({
  query: z
    .string()
    .min(2, { message: "Search query must be at least 2 characters" }),
});

type SearchProps = {
  addToQueue: (link: string) => Promise<null>;
};

export default function Search({ addToQueue }: SearchProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  const [searchResults, setSearchResults] = useState<{
    items: SearchObj[];
    pageToken?: string;
    query: string;
  } | null>(null);

  const search = useAction(api.youtube.search);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const results = await search({ query: values.query });
    setSearchResults({
      items: results.items,
      pageToken: results.nextPageToken,
      query: values.query,
    });
  }

  const loadMoreSearch = useCallback(async () => {
    if (searchResults?.pageToken == null || searchResults?.query == null)
      return;
    const results = await search({
      query: searchResults.query,
      pageToken: searchResults.pageToken,
    });
    setSearchResults({
      ...searchResults,
      items: [...searchResults.items, ...results.items],
      pageToken: results.nextPageToken,
    });
  }, [searchResults?.pageToken, searchResults?.query]);

  return (
    <section className="space-y-2">
      <h2 className="text-lg font-bold">Find a Video</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-x-4">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative grow">
                    <SearchIcon className="absolute left-0 top-0 m-2.5 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9" placeholder="Search" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="ghost" size="icon">
            <SearchIcon className="h-4 w-4" />
          </Button>
        </form>
      </Form>
      {searchResults?.items && (
        <div>
          {searchResults.items.map((item, i) => {
            if (item.id == null || item.snippet == null) return null;
            // TODO: Clean up search results into new component
            return (
              <div
                key={`search-result-${item.id?.videoId}-${i}`}
                className="flex space-x-4"
              >
                <Image
                  src={item.snippet.thumbnails.default.url}
                  height={item.snippet.thumbnails.default.height}
                  width={item.snippet.thumbnails.default.width}
                  alt={item.snippet.title}
                />
                <div className="space-y-2">
                  <p>{item.snippet.title}</p>
                  <p className="font-bold">{item.snippet.channelTitle}</p>
                </div>
                <div className="grow text-right">
                  <Button
                    onClick={() =>
                      addToQueue(
                        `https://youtube.com/watch?v=${item.id!.videoId}`
                      )
                    }
                    variant="ghost"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {searchResults?.pageToken && (
        <Button onClick={loadMoreSearch}>Load More</Button>
      )}
    </section>
  );
}
