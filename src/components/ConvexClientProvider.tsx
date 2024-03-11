"use client";
import type { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { SessionProvider } from "convex-helpers/react/sessions.js";
import { useLocalStorage } from "usehooks-ts";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ConvexProvider client={convex}>
      <SessionProvider
        useStorage={useLocalStorage}
        storageKey="music-queuer-session-id"
      >
        {children}
      </SessionProvider>
    </ConvexProvider>
  );
}
