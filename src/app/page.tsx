import Link from "next/link";
import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <div className="flex min-h-[60vh] items-center justify-center text-center">
        <Link
          href={session?.user ? "/read" : "/api/auth/signin"}
          className="text-4xl font-semibold tracking-tight underline-offset-8 hover:underline sm:text-5xl"
        >
          Read Your Bible.
        </Link>
      </div>
    </HydrateClient>
  );
}
