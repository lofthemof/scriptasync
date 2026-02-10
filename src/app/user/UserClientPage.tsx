"use client";

import Link from "next/link";
import { formatPassageReference } from "~/app/_components/TextSelectors/bookData";
import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";

interface UserClientPageProps {
  name: string | undefined | null;
  sessionId: string;
  email: string | undefined | null;
  createdAt: string;
  notesCount: number;
  lastOpenedBook: string | null;
  lastOpenedChapter: string | null;
}

function StatCard({
  label,
  value,
  valueClassName,
  className,
}: {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
  className?: string;
}) {
  return (
    <div className={cn("border-border rounded-md border p-4", className)}>
      <div className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
        {label}
      </div>
      <div className={cn("mt-2 text-lg font-semibold", valueClassName)}>
        {value}
      </div>
    </div>
  );
}

export default function UserClientPage({
  name,
  sessionId,
  email,
  createdAt,
  notesCount,
  lastOpenedBook,
  lastOpenedChapter,
}: UserClientPageProps) {
  const deleteUser = api.user.delete.useMutation();

  const handleDelete = () => {
    const confirmed = window.confirm("Are you sure?");
    if (confirmed) {
      deleteUser.mutate();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">
            {name ? `Hi, ${name}!` : "Hi!"}
          </h1>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleteUser.isPending}
          className="cursor-pointer rounded-md border border-red-600 bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Delete account
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="User ID"
          value={sessionId}
          valueClassName="font-mono"
        />
        <StatCard label="Email" value={email ?? "—"} />
        <StatCard
          label="Account Created"
          value={new Date(createdAt).toLocaleDateString()}
        />
        <Link href="/notes" className="block">
          <StatCard label="Notes Made" value={notesCount} className="hover:bg-muted transition-colors" />
        </Link>
        <StatCard
          label="Last Opened"
          value={
            lastOpenedBook && lastOpenedChapter
              ? formatPassageReference(lastOpenedBook, lastOpenedChapter, [])
              : "—"
          }
          className="sm:col-span-2"
        />
      </div>
    </div>
  );
}
