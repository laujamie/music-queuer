import type { Metadata } from "next";
import Link from "next/link";
import { GithubIcon } from "lucide-react";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";
import ModePicker from "@/components/ModePicker";
import { Toaster } from "@/components/ui/sonner";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Music Queuer",
  description:
    "Queue up music with friends to sing along to, powered by YouTube.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="flex h-full flex-col pt-4 gap-y-8">
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ConvexClientProvider>
              <header>
                <nav className="container py-2 flex items-center justify-between">
                  <div>
                    <Link href="/">
                      <p className="font-bold text-lg">YouTube Queuer</p>
                    </Link>
                  </div>
                  <ModePicker />
                </nav>
              </header>
              <main className="container grow">{children}</main>
              <footer className="py-4 bg-muted">
                <div className="flex container">
                  <div className="grow" />
                  <a
                    href="https://github.com/laujamie/music-queuer"
                    className="hover:text-primary"
                    aria-label="Github repository link"
                  >
                    <GithubIcon />
                  </a>
                </div>
              </footer>
              <Toaster />
            </ConvexClientProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
