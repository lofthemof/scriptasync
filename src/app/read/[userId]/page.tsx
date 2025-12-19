import { auth } from "~/server/auth";
import { notFound } from "next/navigation";
import ReadClientPage from "./ReadClientPage";

export default async function ReadPage({
  params,
}: {
  params: { userId: string };
}) {
  const session = await auth();

  if (!session?.user) {
    notFound();
  }

  const sessionId = session.user.id;

  if (params.userId !== sessionId) {
    notFound();
  }

  return <ReadClientPage sessionId={sessionId} />;
}
