import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import ReadClientPage from "./ReadClientPage";

export default async function ReadPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return <ReadClientPage />;
}
