"use client";
import { navigate } from "@/app/actions";
import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";
import { Button } from "./ui/button";
import Link from "next/link";

type ErrorBoundaryProps = {
  children?: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error({ error, errorInfo });
  }

  resetErrorBoundary() {
    this.setState({ hasError: false });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col gap-y-4 items-center justify-center h-full">
          <h1>Sorry, there was an error</h1>
          <Link passHref href="/">
            <Button
              onClick={() => {
                this.resetErrorBoundary();
              }}
              variant="secondary"
            >
              Go Home
            </Button>
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}
