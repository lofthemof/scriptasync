"use client";

import { useSearchParams } from "next/navigation";

enum Error {
  Configuration = "Configuration",
}

const errorMap = {
  [Error.Configuration]: (
    <p>
      There was a problem when trying to authenticate. Unique error code:{" "}
      <code className="bg-muted rounded-sm p-1 text-xs">Configuration</code>
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
        className="border-border bg-background hover:bg-muted block max-w-sm rounded-lg border p-6 text-center"
      >
        <h5 className="text-foreground mb-2 flex flex-row items-center justify-center gap-2 text-xl font-semibold tracking-tight">
          Something went wrong
        </h5>
        <div className="text-muted-foreground font-normal">
          {errorMap[error]}
        </div>
      </a>
    </div>
  );
}
