"use client";
import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import { Button } from "./ui/button";
import { navigate } from "@/app/actions";

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
        <div className="space-y-2 text-center">
          <h1>Sorry, there was an error</h1>
          <Button
            onClick={() => {
              navigate("/");
              this.resetErrorBoundary();
            }}
            variant="secondary"
          >
            Go Home
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
