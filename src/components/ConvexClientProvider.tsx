"use client";
import { useState } from "react";
import type { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "convex-helpers/react/sessions.js";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [queryClient] = useState<QueryClient>(() => new QueryClient());
  return (
    <ConvexProvider client={convex}>
      <SessionProvider storageKey="music-queuer-session-id">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </SessionProvider>
    </ConvexProvider>
  );
}
