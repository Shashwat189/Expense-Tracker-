\import {
  createFileRoute,
  Outlet,
} from "@tanstack/react-router";

import {
  Loader2,
} from "lucide-react";

import {
  useAuth,
} from "@/lib/auth-context";

export const Route =
  createFileRoute(
    "/_authenticated",
  )({
    component: AuthGate,
  });

function AuthGate() {
  const {
    user,
    hydrated,
  } = useAuth();

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    window.location.href =
      "/login";

    return null;
  }

  return <Outlet />;
}

export default AuthGate;