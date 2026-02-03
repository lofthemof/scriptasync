"use client";

import { NoteBox } from "~/app/_components/NoteBox";
import { api } from "~/trpc/react";

interface UserClientPageProps {
  email: string | undefined | null;
  sessionId: string;
}

export default function UserClientPage({
  email,
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
    <div>
      <h1>Welcome, {email}</h1>
      <p>Your User ID: {sessionId}</p>
      <button onClick={handleDelete} disabled={deleteUser.isPending}>
        Delete account
      </button>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Your Notes</h2>
        {notesLoading && <p>Loading notes...</p>}
        {notes?.length === 0 && <p className="text-gray-500">No notes yet.</p>}
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
