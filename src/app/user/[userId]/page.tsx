import { auth } from "~/server/auth";
import { notFound } from "next/navigation";

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

  return (
    <div>
      <h1>Welcome, {email}</h1>
      <p>Your User ID: {sessionId}</p>
    </div>
  );
}
