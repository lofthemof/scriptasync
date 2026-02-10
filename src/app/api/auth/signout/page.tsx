import { signOut, auth } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function SignOutPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h5 className="text-lg font-semibold">
        Are you sure you want to sign out?
      </h5>
      <form
        action={async (_formData) => {
          "use server";
          await signOut();
        }}
      >
        <button className="cursor-pointer" type="submit">
          Sign out
        </button>
      </form>
    </div>
  );
}
