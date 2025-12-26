import { auth } from "~/server/auth";
import { notFound } from "next/navigation";
import ReadClientPage from "./ReadClientPage";

export default async function ReadPage() {
  const session = await auth();

  if (!session?.user) {
    notFound();
  }

  return <ReadClientPage />;
}
