import { useCallback, useState } from "react";
import { useAction } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Search as SearchIcon, LoaderCircleIcon } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Input } from "./ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Button } from "./ui/button";
import type { SearchObj } from "@/convex/lib/youtube";
import VideoItem from "./VideoItem";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const formSchema = z.object({
  query: z
    .string()
    .min(2, { message: "Search query must be at least 2 characters" }),
});

type SearchProps = {
  addToQueue: (link: string) => Promise<null>;
};

export default function Search({ addToQueue }: SearchProps) {
  const [searchLoading, setSearchLoading] = useState(false);
  const [addQueueLoading, setAddQueueLoading] = useState(false);

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
    setSearchLoading(true);
    try {
      const results = await search({ query: values.query });
      setSearchResults({
        items: results.items,
        pageToken: results.nextPageToken,
        query: values.query,
      });
    } catch {
      toast.error("Search failed, please try again...");
    } finally {
      setSearchLoading(false);
    }
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
  }, [searchResults, search]);

  return (
    <Card className="space-y-2">
      <CardHeader>
        <CardTitle>Find a Video</CardTitle>
      </CardHeader>
      <CardContent>
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
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              disabled={searchLoading}
            >
              {searchLoading ? (
                <LoaderCircleIcon className="h-4 w-4 animate-spin" />
              ) : (
                <SearchIcon className="h-4 w-4" />
              )}
            </Button>
          </form>
        </Form>
        {searchResults?.items && (
          <div>
            {searchResults.items.map((item, i) => {
              if (item.id == null || item.snippet == null) return null;
              // TODO: Clean up search results into new component
              return (
                <VideoItem
                  key={`search-result-${item.id?.videoId}-${i}`}
                  thumbnail={item.snippet.thumbnails.default}
                  title={item.snippet.title}
                  channelTitle={item.snippet.channelTitle}
                  ActionButton={
                    <Button
                      onClick={() => {
                        setAddQueueLoading(true);
                        addToQueue(
                          `https://youtube.com/watch?v=${item.id!.videoId}`
                        )
                          .catch(() =>
                            toast.error(
                              "Failed to add video to queue, please try again..."
                            )
                          )
                          .finally(() => setAddQueueLoading(false));
                      }}
                      variant="ghost"
                      disabled={addQueueLoading}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  }
                />
              );
            })}
          </div>
        )}
        {searchResults?.pageToken && (
          <Button onClick={loadMoreSearch}>Load More</Button>
        )}
      </CardContent>
    </Card>
  );
}
