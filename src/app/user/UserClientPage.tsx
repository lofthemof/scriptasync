"use client";

import { NoteBox } from "~/app/_components/NoteBox";
import { api } from "~/trpc/react";

interface UserClientPageProps {
  name: string | undefined | null;
  sessionId: string;
}

export default function UserClientPage({
  name,
  sessionId,
}: UserClientPageProps) {
  const deleteUser = api.user.delete.useMutation();
  const { data: notes, isLoading: notesLoading } = api.user.getNotes.useQuery();

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
          <h1 className="text-2xl font-semibold">Hi, {name ?? "there"}</h1>
          <p className="text-muted-foreground text-sm">User ID: {sessionId}</p>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleteUser.isPending}
          className="cursor-pointer rounded-md border border-red-600 bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Delete account
        </button>
      </div>
      <div>
        <h2 className="mb-4 text-xl font-semibold">Your Notes</h2>
        {notesLoading && (
          <p className="text-muted-foreground text-sm">Loading notes...</p>
        )}
        {notes?.length === 0 && (
          <p className="text-muted-foreground text-sm">No notes yet.</p>
        )}
        <div className="flex flex-col gap-4">
          {notes?.map((note) => (
            <NoteBox
              key={note.id}
              content={note.content}
              verses={note.verses}
              createdAt={note.createdAt}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
