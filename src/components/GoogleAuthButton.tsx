import { signIn } from "../lib/auth";


export default function LoginPage() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: '/dashboard' });
      }}
    >
      <button type="submit">Sign in with Google</button>
    </form>
  );
}