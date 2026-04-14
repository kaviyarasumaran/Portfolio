import { redirect } from "next/navigation";

export default function ChallengePage() {
  // Back-compat route: redirect to the new registration page.
  // Using a server component redirect keeps it instant and avoids hydration issues.
  redirect("/game");
}
