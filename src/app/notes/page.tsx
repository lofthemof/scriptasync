import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import NotesClientPage from "./NotesClientPage";

export default async function NotesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return <NotesClientPage />;
}
