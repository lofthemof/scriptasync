"use client";

import { useSearchParams } from "next/navigation";

enum Error {
  Configuration = "Configuration",
}

const errorMap = {
  [Error.Configuration]: (
    <p>
      There was a problem when trying to authenticate. Please contact us if this
      error persists. Unique error code:{" "}
      <code className="rounded-sm bg-muted p-1 text-xs">Configuration</code>
    </p>
  ),
};

export default function AuthErrorPage() {
  const search = useSearchParams();
  const error = search.get("error") as Error;

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <a
        href="#"
        className="block max-w-sm rounded-lg border border-border bg-background p-6 text-center hover:bg-muted"
      >
        <h5 className="mb-2 flex flex-row items-center justify-center gap-2 text-xl font-semibold tracking-tight text-foreground">
          Something went wrong
        </h5>
        <div className="font-normal text-muted-foreground">
          {errorMap[error] || "Please contact us if this error persists."}
        </div>
      </a>
    </div>
  );
}
