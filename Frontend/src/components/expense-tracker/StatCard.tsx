import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { AnimatedNumber } from "./AnimatedNumber";
import { formatMoney } from "@/lib/expense-utils";

interface StatCardProps {
  label: string;
  value: number | string;
  hint?: string;
  icon: LucideIcon;
  numeric?: boolean;
  /** Format the numeric value as money in this currency code */
  currency?: string;
  prefix?: string;
  suffix?: string;
  accent?: "emerald" | "slate" | "amber" | "blue";
}

const accents: Record<NonNullable<StatCardProps["accent"]>, string> = {
  emerald: "from-primary/15 to-primary/0 text-primary",
  slate: "from-slate-500/15 to-slate-500/0 text-slate-600 dark:text-slate-300",
  amber: "from-amber-500/15 to-amber-500/0 text-amber-600 dark:text-amber-300",
  blue: "from-blue-500/15 to-blue-500/0 text-blue-600 dark:text-blue-300",
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  numeric,
  currency,
  prefix,
  suffix,
  accent = "emerald",
}: StatCardProps) {
  const renderValue = () => {
    if (numeric && typeof value === "number") {
      if (currency) {
        // Use formatted currency string for the static fallback while AnimatedNumber animates
        return <AnimatedNumber value={value} format={(n) => formatMoney(n, currency)} />;
      }
      return <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />;
    }
    return (
      <>
        {prefix}
        {value}
        {suffix}
      </>
    );
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${accents[accent]} opacity-70 blur-2xl`}
      />
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-3 truncate font-display text-2xl font-bold tracking-tight text-foreground sm:text-[26px]">
            {renderValue()}
          </p>
          {hint && <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-background ${accents[accent].split(" ").slice(-1)}`}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>
      <ArrowUpRight className="absolute bottom-4 right-4 h-4 w-4 text-muted-foreground/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
    </div>
  );
}
