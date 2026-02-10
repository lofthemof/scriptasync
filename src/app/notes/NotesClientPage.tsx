"use client";

import { NoteBox } from "~/app/_components/NoteBox";
import { api } from "~/trpc/react";

export default function NotesClientPage() {
  const { data: notes, isLoading: notesLoading } = api.user.getNotes.useQuery();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Your Notes</h1>
        <p className="text-sm text-muted-foreground">
          All notes you have saved.
        </p>
      </div>
      {notesLoading && <p className="text-sm text-muted-foreground">Loading notes...</p>}
      {notes?.length === 0 && (
        <p className="text-sm text-muted-foreground">No notes yet.</p>
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
  );
}
