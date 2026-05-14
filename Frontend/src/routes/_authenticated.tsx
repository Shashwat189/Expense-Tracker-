import {
  createFileRoute,
  Outlet,
  redirect,
} from "@tanstack/react-router";

import { useAuth } from "@/lib/auth-context";

import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    try {
      const stored = localStorage.getItem("et:session");

      if (!stored) {
        throw redirect({
          to: "/login",
        });
      }
    } catch {
      throw redirect({
        to: "/login",
      });
    }
  },

  component: AuthGate,
});

function AuthGate() {
  const { user, hydrated } = useAuth();

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <Outlet />;
}

export default AuthGate;