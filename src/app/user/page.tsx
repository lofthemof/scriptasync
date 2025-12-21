import { auth } from "~/server/auth";
import { notFound } from "next/navigation";
import UserClientPage from "./UserClientPage";

export default async function UserPage() {
  const session = await auth();

  if (!session?.user) {
    notFound();
  }

  const sessionId = session.user.id;
  const email = session.user.email;

  return <UserClientPage email={email} sessionId={sessionId} />;
}
