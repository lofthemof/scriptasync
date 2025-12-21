"use client";

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
    </div>
  );
}
