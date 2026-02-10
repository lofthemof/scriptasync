import { redirect } from "next/navigation";
import { signIn } from "~/server/auth";
import { providerMap } from "~/server/auth/config";
import { AuthError } from "next-auth";
import { auth } from "~/server/auth";

const SIGNIN_ERROR_URL = "/error";

export default async function SignInPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Sign in</h1>
      </div>
      {/* <form
        action={async (formData) => {
          "use server";
          try {
            await signIn("credentials", formData);
          } catch (error) {
            if (error instanceof AuthError) {
              return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
            }
            throw error;
          }
        }}
      >
        <label htmlFor="email">
          Email
          <input name="email" id="email" />
        </label>
        <label htmlFor="password">
          Password
          <input name="password" id="password" />
        </label>
        <input type="submit" value="Sign In" />
      </form> */}
      {Object.values(providerMap).map((provider) => (
        <form
          key={provider.id}
          action={async () => {
            "use server";
            try {
              await signIn(provider.id, { redirectTo: "/" });
            } catch (error) {
              // Signin can fail for a number of reasons, such as the user
              // not existing, or the user not having the correct role.
              // In some cases, you may want to redirect to a custom error
              if (error instanceof AuthError) {
                return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
              }

              // Otherwise if a redirects happens Next.js can handle it
              // so you can just re-thrown the error and let Next.js handle it.
              // Docs:
              // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
              throw error;
            }
          }}
        >
          <button
            type="submit"
            className="border-border bg-foreground text-background hover:bg-foreground/90 cursor-pointer rounded-md border px-4 py-2 text-sm"
          >
            <span>Sign in with {provider.name} OAuth</span>
          </button>
        </form>
      ))}
    </div>
  );
}
