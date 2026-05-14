import type { Expense } from "@/lib/expense-utils";
import { CATEGORIES, CATEGORY_META, formatMoney } from "@/lib/expense-utils";
import { useCurrency } from "@/hooks/useCurrency";
import { useEffect, useState } from "react";

export function CategoryBreakdown({ expenses }: { expenses: Expense[] }) {
  const { base, toBase } = useCurrency();

  const converted = expenses.map((e) => ({ ...e, baseAmt: toBase(e.amount, e.currency) ?? 0 }));
  const total = converted.reduce((s, e) => s + e.baseAmt, 0);
  const byCat = CATEGORIES.map((c) => {
    const sum = converted.filter((e) => e.category === c).reduce((s, e) => s + e.baseAmt, 0);
    return { category: c, sum, pct: total > 0 ? (sum / total) * 100 : 0 };
  }).sort((a, b) => b.sum - a.sum);

  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShown(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">Category breakdown</h2>
          <p className="text-xs text-muted-foreground">
            Spending distribution across all categories.
          </p>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {formatMoney(total, base)} total
        </span>
      </div>

      <div className="space-y-4">
        {byCat.map(({ category, sum, pct }) => {
          const meta = CATEGORY_META[category];
          return (
            <div key={category}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: meta.color }} />
                  <span className="font-medium text-foreground">{category}</span>
                </div>
                <div className="flex items-center gap-3 tabular-nums">
                  <span className="text-xs text-muted-foreground">{pct.toFixed(1)}%</span>
                  <span className="font-semibold text-foreground">{formatMoney(sum, base)}</span>
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-[width] duration-1000 ease-out"
                  style={{
                    width: shown ? `${Math.max(pct, sum > 0 ? 2 : 0)}%` : "0%",
                    background: meta.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
