import { TrendingUp, Receipt, Trophy, Clock } from "lucide-react";
import type { Expense } from "@/lib/expense-utils";
import { formatMoney, CATEGORIES, CATEGORY_META } from "@/lib/expense-utils";
import { useCurrency } from "@/lib/currency-context";

export function SummaryPanel({ expenses }: { expenses: Expense[] }) {
  const { base, toBase, formatInBase } = useCurrency();
  const converted = expenses.map((e) => ({ ...e, baseAmt: toBase(e.amount, e.currency) ?? 0 }));
  const total = converted.reduce((s, e) => s + e.baseAmt, 0);
  const txns = expenses.length;
  const top = CATEGORIES.map((c) => ({
    c,
    sum: converted.filter((e) => e.category === c).reduce((s, e) => s + e.baseAmt, 0),
  })).sort((a, b) => b.sum - a.sum)[0];
  const recent = expenses[0];

  const items = [
    {
      label: "Total spending",
      value: formatMoney(total, base),
      icon: TrendingUp,
      accent: "text-primary bg-primary-soft",
    },
    {
      label: "Transactions",
      value: String(txns),
      icon: Receipt,
      accent: "text-blue-600 bg-blue-500/10 dark:text-blue-300",
    },
    {
      label: "Top category",
      value: top && top.sum > 0 ? top.c : "—",
      sub: top && top.sum > 0 ? formatMoney(top.sum, base) : "",
      icon: Trophy,
      accent: "text-amber-600 bg-amber-500/10 dark:text-amber-300",
    },
    {
      label: "Most recent",
      value: recent ? recent.name : "—",
      sub: recent ? formatInBase(recent.amount, recent.currency) : "",
      icon: Clock,
      accent: "text-fuchsia-600 bg-fuchsia-500/10 dark:text-fuchsia-300",
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="mb-5">
        <h2 className="font-display text-lg font-bold text-foreground">Summary</h2>
        <p className="text-xs text-muted-foreground">Key insights at a glance.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map(({ label, value, sub, icon: Icon, accent }) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-background/60 p-3.5 transition hover:bg-background"
          >
            <div className={`grid h-8 w-8 place-items-center rounded-lg ${accent}`}>
              <Icon className="h-4 w-4" />
            </div>
            <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="mt-0.5 truncate font-display text-base font-bold text-foreground">
              {value}
            </p>
            {sub && <p className="text-xs text-muted-foreground tabular-nums">{sub}</p>}
          </div>
        ))}
      </div>
      {top && top.sum > 0 && (
        <div className="mt-4 rounded-xl border border-border bg-muted/40 p-3">
          <p className="text-xs text-muted-foreground">
            Your largest spending category is{" "}
            <span
              className="font-semibold text-foreground"
              style={{ color: CATEGORY_META[top.c].color }}
            >
              {top.c}
            </span>{" "}
            at{" "}
            <span className="font-semibold text-foreground tabular-nums">
              {formatMoney(top.sum, base)}
            </span>
            .
          </p>
        </div>
      )}
    </div>
  );
}
