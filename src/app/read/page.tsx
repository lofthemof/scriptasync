import { auth } from "~/server/auth";
import { notFound } from "next/navigation";
import ReadClientPage from "./ReadClientPage";

export default async function ReadPage() {
  const session = await auth();

  if (!session?.user) {
    notFound();
  }

  const sessionId = session.user.id;

  return <ReadClientPage sessionId={sessionId} />;
}
