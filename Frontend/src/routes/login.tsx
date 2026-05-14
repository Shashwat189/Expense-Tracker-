import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Wallet, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login, user, hydrated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (hydrated && user) navigate({ to: "/" });
  }, [hydrated, user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!email.trim() || !password) {
      setErr("Please enter your email and password");
      return;
    }
    setSubmitting(true);
    try {
      await login(email, password);
      navigate({ to: "/" });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to access your expense dashboard.">
      <form onSubmit={submit} className="space-y-4">
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="your@email.com"
          autoComplete="email"
        />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          autoComplete="current-password"
        />
        {err && <ErrBanner message={err} />}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground shadow-soft transition-all hover:bg-secondary/90 hover:shadow-lift active:scale-[0.99] disabled:opacity-70"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? "Signing in…" : "Sign in"}
        </button>
        <p className="pt-2 text-center text-xs text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold text-primary hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-secondary p-10 text-secondary-foreground lg:flex">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-emerald shadow-soft">
            <Wallet className="h-5 w-5 text-white" strokeWidth={2.4} />
          </div>
          <span className="font-display text-base font-bold">Expense Tracker</span>
        </div>
        <div className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
            Personal finance
          </p>
          <h2 className="font-display text-4xl font-bold leading-tight">
            Track every dollar.
            <br />
            Across every currency.
          </h2>
          <p className="max-w-md text-sm text-secondary-foreground/70">
            A premium dashboard with live FX rates, category analytics, and a workflow built for
            busy people.
          </p>
        </div>
        <p className="text-xs text-secondary-foreground/60">
          © {new Date().getFullYear()} Expense Tracker — crafted for clarity.
        </p>
      </div>
      <div className="flex items-center justify-center bg-background p-6 sm:p-10">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-emerald shadow-soft">
                <Wallet className="h-5 w-5 text-white" strokeWidth={2.4} />
              </div>
              <span className="font-display text-base font-bold text-foreground">
                Expense Tracker
              </span>
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-7">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground shadow-soft outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
      />
    </label>
  );
}

export function ErrBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-medium text-destructive">
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
