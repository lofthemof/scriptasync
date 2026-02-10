import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import UserClientPage from "./UserClientPage";

export default async function UserPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const sessionId = session.user.id;
  const name = session.user.name;
  const email = session.user.email;

  const [stats, lastOpened] = await Promise.all([
    api.user.getStats(),
    api.user.getLastOpened(),
  ]);

  return (
    <UserClientPage
      name={name}
      sessionId={sessionId}
      email={email}
      createdAt={stats.createdAt.toISOString()}
      notesCount={stats.notesCount}
      lastOpenedBook={lastOpened.lastOpenedBook?.slug ?? null}
      lastOpenedChapter={lastOpened.lastOpenedChapter?.slug ?? null}
    />
  );
}
