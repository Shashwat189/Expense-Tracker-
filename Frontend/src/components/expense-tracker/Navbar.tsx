import { Wallet, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { UserMenu } from "./UserMenu";
import { useCurrency } from "@/hooks/useCurrency";

export function Navbar() {
  const [dark, setDark] = useState(false);
  const { base } = useCurrency();

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefers = stored
      ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(prefers);
    document.documentElement.classList.toggle("dark", prefers);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-40 glass border-b border-border">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-emerald shadow-soft">
            <Wallet className="h-5 w-5 text-white" strokeWidth={2.4} />
          </div>
          <div className="leading-tight">
            <h1 className="font-display text-[15px] font-bold tracking-tight text-foreground">
              Expense Tracker
            </h1>
            <p className="text-[11px] text-muted-foreground">
              Personal finance, beautifully measured.
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-2.5">
          <span className="hidden rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-muted-foreground sm:inline">
            Base · <span className="text-foreground">{base}</span>
          </span>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition hover:text-foreground hover:shadow-soft"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
