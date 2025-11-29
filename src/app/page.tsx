import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <main>
        {session?.user ? (
          <p>Currently logged in as {session.user.name}</p>
        ) : (
          <p>Not logged in</p>
        )}
      </main>
    </HydrateClient>
  );
}
