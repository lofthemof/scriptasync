import { auth } from "~/server/auth";
import { notFound } from "next/navigation";
import NotesClientPage from "./NotesClientPage";

export default async function NotesPage() {
  const session = await auth();

  if (!session?.user) {
    notFound();
  }

  return <NotesClientPage />;
}
