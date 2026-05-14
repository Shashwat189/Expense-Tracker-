import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-3xl">
      Signup Page Works
    </div>
  );
}