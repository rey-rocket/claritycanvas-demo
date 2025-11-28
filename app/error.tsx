"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-8 text-center">
        <h2 className="mb-2 text-xl font-semibold text-red-300">
          Something went wrong
        </h2>
        <p className="mb-4 text-sm text-slate-400">
          An error occurred while loading this page.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-400"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
