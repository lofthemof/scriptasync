import { auth } from "~/server/auth";
import { notFound } from "next/navigation";
import UserClientPage from "./UserClientPage";

export default async function UserPage({
  params,
}: {
  params: { userId: string };
}) {
  const session = await auth();

  if (!session?.user) {
    notFound();
  }

  const sessionId = session.user.id;
  const email = session.user.email;

  if (params.userId !== sessionId) {
    notFound();
  }

  return <UserClientPage email={email} sessionId={sessionId} />;
}
