import Link from "next/link";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="flex min-h-[60vh] items-center justify-center text-center">
        <Link
          href="/read"
          className="text-4xl font-semibold tracking-tight underline-offset-8 hover:underline sm:text-5xl"
        >
          Read Your Bible.
        </Link>
      </div>
    </HydrateClient>
  );
}
