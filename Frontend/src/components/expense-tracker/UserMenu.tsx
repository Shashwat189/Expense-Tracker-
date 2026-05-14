import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Settings as SettingsIcon, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "U"
  );
}

export function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((x) => !x)}
        className="flex h-9 items-center gap-2 rounded-full border border-border bg-card pl-1 pr-2.5 text-foreground transition hover:shadow-soft"
      >
        {user.avatar ? (
          <img src={user.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <span className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-[11px] font-semibold text-secondary-foreground">
            {initials(user.name)}
          </span>
        )}
        <span className="hidden text-xs font-medium sm:inline">{user.name}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-60 origin-top-right animate-scale-in rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-lift">
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                {initials(user.name)}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="mt-1.5 space-y-0.5">
            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition hover:bg-muted"
            >
              <SettingsIcon className="h-4 w-4 text-muted-foreground" /> Settings
            </Link>
            <button
              onClick={() => {
                setOpen(false);
                logout();
                navigate({ to: "/login" });
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-destructive transition hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>
          <div className="mt-1 border-t border-border px-2.5 py-2 text-[10px] uppercase tracking-wider text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <UserIcon className="h-3 w-3" /> Signed in
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
