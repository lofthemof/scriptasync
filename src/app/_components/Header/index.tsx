import { auth } from "~/server/auth";
import Link from "next/link";
import Image from "next/image";

export async function Header() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="border-border bg-background/80 border-b backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            ScriptAsync
          </Link>
          <Link
            href="/read"
            className="text-muted-foreground hover:text-foreground"
          >
            Read
          </Link>
          <Link
            href="/notes"
            className="text-muted-foreground hover:text-foreground"
          >
            Notes
          </Link>
        </div>
        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link
                href="/user"
                className="text-muted-foreground hover:text-foreground flex items-center"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? "User profile"}
                    width={32}
                    height={32}
                    className="border-border rounded-full border"
                  />
                ) : (
                  <span className="border-border flex h-8 w-8 items-center justify-center rounded-full border text-xs">
                    {user.name?.slice(0, 2).toUpperCase() ?? "ME"}
                  </span>
                )}
              </Link>
              <Link
                href="/api/auth/signout"
                className="text-muted-foreground hover:text-foreground"
              >
                Sign Out
              </Link>
            </>
          ) : (
            <Link
              href="/api/auth/signin"
              className="text-muted-foreground hover:text-foreground"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
