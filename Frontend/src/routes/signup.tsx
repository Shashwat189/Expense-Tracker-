import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { AuthShell, Field, ErrBanner } from "./login";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const { signup, user, hydrated } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (hydrated && user) navigate({ to: "/" });
  }, [hydrated, user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!name.trim()) return setErr("Name is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErr("Enter a valid email");
    if (pw.length < 6) return setErr("Password must be at least 6 characters");
    if (pw !== pw2) return setErr("Passwords don't match");
    setSubmitting(true);
    try {
      await signup(name, email, pw);
      navigate({ to: "/" });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Sign-up failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Get started with your premium expense dashboard."
    >
      <form onSubmit={submit} className="space-y-4">
        <Field
          label="Name"
          value={name}
          onChange={setName}
          placeholder="Alex Kim"
          autoComplete="name"
        />
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="alex@example.com"
          autoComplete="email"
        />
        <Field
          label="Create password"
          type="password"
          value={pw}
          onChange={setPw}
          placeholder="At least 6 characters"
          autoComplete="new-password"
        />
        <Field
          label="Confirm password"
          type="password"
          value={pw2}
          onChange={setPw2}
          placeholder="Repeat password"
          autoComplete="new-password"
        />
        {err && <ErrBanner message={err} />}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground shadow-soft transition-all hover:bg-secondary/90 hover:shadow-lift active:scale-[0.99] disabled:opacity-70"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? "Creating account…" : "Create account"}
        </button>
        <p className="pt-2 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
