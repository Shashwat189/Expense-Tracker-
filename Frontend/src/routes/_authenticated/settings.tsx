import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  Check,
  Globe2,
  Loader2,
  Lock,
  User as UserIcon,
  Mail,
  Trash2,
} from "lucide-react";
import { Navbar } from "@/components/expense-tracker/Navbar";
import { useAuth } from "@/lib/auth-context";
import { useCurrency } from "@/hooks/useCurrency";
import { CURRENCIES, CURRENCY_NAMES } from "@/lib/expense-utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const { base, setBase, updatedAt, loading } = useCurrency();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const initials = (user?.name ?? "U")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  const onAvatar = (file: File) => {
    if (file.size > 1.5 * 1024 * 1024) {
      toast.error("Image must be under 1.5 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast.error("Enter a valid email");
    setSavingProfile(true);
    await new Promise((r) => setTimeout(r, 350));
    updateProfile({ name, email, avatar });
    setSavingProfile(false);
    toast.success("Profile updated");
  };

  const savePw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 6) return toast.error("Password must be at least 6 characters");
    if (pw !== pw2) return toast.error("Passwords don't match");
    setSavingPw(true);
    await new Promise((r) => setTimeout(r, 350));
    updateProfile({ password: pw });
    setSavingPw(false);
    setPw("");
    setPw2("");
    toast.success("Password updated");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
        </Link>
        <header className="mt-3 animate-fade-in">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Account</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Settings
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Manage your profile, base currency, and security.
          </p>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile */}
          <form
            onSubmit={saveProfile}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:col-span-2"
          >
            <SectionHeader
              icon={UserIcon}
              title="Profile"
              subtitle="Your public information shown across the app."
            />
            <div className="mt-5 flex items-center gap-5">
              <div className="relative">
                {avatar ? (
                  <img
                    src={avatar}
                    alt=""
                    className="h-20 w-20 rounded-2xl object-cover shadow-soft"
                  />
                ) : (
                  <div className="grid h-20 w-20 place-items-center rounded-2xl bg-secondary text-2xl font-bold text-secondary-foreground shadow-soft">
                    {initials}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  aria-label="Change photo"
                  className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow-soft transition hover:scale-105"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onAvatar(f);
                  }}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">Profile photo</p>
                <p>PNG, JPG or GIF — up to 1.5 MB.</p>
                {avatar && (
                  <button
                    type="button"
                    onClick={() => setAvatar(undefined)}
                    className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-destructive hover:underline"
                  >
                    <Trash2 className="h-3 w-3" /> Remove
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <LabeledInput label="Display name" icon={UserIcon} value={name} onChange={setName} />
              <LabeledInput
                label="Email address"
                icon={Mail}
                type="email"
                value={email}
                onChange={setEmail}
              />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground shadow-soft transition hover:bg-secondary/90 disabled:opacity-70"
              >
                {savingProfile ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Save profile
              </button>
            </div>
          </form>

          {/* Base currency */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <SectionHeader
              icon={Globe2}
              title="Base currency"
              subtitle="All amounts on the dashboard convert to this currency in real time."
            />
            <div className="mt-5">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-foreground">
                  Display & entry currency
                </span>
                <select
                  value={base}
                  onChange={(e) => {
                    setBase(e.target.value);
                    toast.success(`Base currency set to ${e.target.value}`);
                  }}
                  className="w-full appearance-none rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground shadow-soft outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c} · {CURRENCY_NAMES[c] ?? c}
                    </option>
                  ))}
                </select>
              </label>
              <div className="mt-4 rounded-xl border border-primary/20 bg-primary-soft/60 p-3.5 text-xs text-foreground">
                <p className="font-semibold">Live FX rates {loading ? "syncing…" : "active"}</p>
                <p className="mt-1 text-muted-foreground">
                  Powered by open.er-api.com
                  {updatedAt ? `. Last updated ${new Date(updatedAt).toLocaleString()}.` : "."}
                </p>
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">
                Switching currency converts all totals, category breakdowns, and stored expenses
                instantly using the latest rates.
              </p>
            </div>
          </div>

          {/* Password */}
          <form
            onSubmit={savePw}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:col-span-2"
          >
            <SectionHeader
              icon={Lock}
              title="Change password"
              subtitle="Update the password used to sign in."
            />
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <LabeledInput label="New password" type="password" value={pw} onChange={setPw} />
              <LabeledInput
                label="Confirm new password"
                type="password"
                value={pw2}
                onChange={setPw2}
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={savingPw || !pw}
                className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground shadow-soft transition hover:bg-secondary/90 disabled:opacity-70"
              >
                {savingPw ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Update password
              </button>
            </div>
          </form>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <SectionHeader
              icon={UserIcon}
              title="Account"
              subtitle="Local-only demo account stored in your browser."
            />
            <div className="mt-5 space-y-2 text-xs">
              <Row k="User ID" v={user?.id ?? "—"} />
              <Row k="Display name" v={user?.name ?? "—"} />
              <Row k="Email" v={user?.email ?? "—"} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Globe2;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div>
        <h2 className="font-display text-base font-bold text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  type = "text",
  icon: Icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  icon?: typeof Globe2;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-foreground">{label}</span>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl border border-input bg-background py-2.5 text-sm text-foreground shadow-soft outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 ${Icon ? "pl-9 pr-3.5" : "px-3.5"}`}
        />
      </div>
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-background/60 px-3 py-2">
      <span className="text-muted-foreground">{k}</span>
      <span className="max-w-[60%] truncate font-mono text-foreground">{v}</span>
    </div>
  );
}
