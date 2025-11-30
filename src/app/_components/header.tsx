import { auth } from "~/server/auth";
import Link from "next/link";

export const Header = async () => {
  const session = await auth();

  return (
    <div className="flex gap-4 p-4">
      <Link href="/">ScriptAsync</Link>
      <Link href="/read">Read</Link>
      <Link href="/group">Groups</Link>
      {session?.user && <Link href="/me">Me</Link>}
      {session?.user && <Link href="/api/auth/signout">Sign Out</Link>}
      {!session?.user && <Link href={"/api/auth/signin"}>Sign In</Link>}
    </div>
  );
};
