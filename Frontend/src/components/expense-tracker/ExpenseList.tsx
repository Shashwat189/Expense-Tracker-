import { Trash2, Pencil, Utensils, Plane, Megaphone, Zap, Package, Inbox } from "lucide-react";
import type { Expense } from "@/lib/expense-utils";
import { CATEGORY_META, formatDate, formatMoney } from "@/lib/expense-utils";
import { useCurrency } from "@/hooks/useCurrency";

const ICONS = {
  Food: Utensils,
  Travel: Plane,
  Marketing: Megaphone,
  Utilities: Zap,
  Other: Package,
} as const;

interface Props {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

export function ExpenseList({ expenses, onDelete, onEdit }: Props) {
  const { base, formatInBase } = useCurrency();

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center animate-fade-in">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary">
          <Inbox className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-display text-base font-semibold text-foreground">
          No expenses added yet
        </h3>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          Start tracking your spending — your first expense will appear here.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2.5">
      {expenses.map((e, i) => {
        const meta = CATEGORY_META[e.category];
        const Icon = ICONS[e.category];
        const showOriginal = e.currency !== base;
        return (
          <li
            key={e.id}
            style={{ animationDelay: `${i * 35}ms` }}
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-3.5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift animate-slide-up"
          >
            <div
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${meta.bg} ${meta.text}`}
            >
              <Icon className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-foreground">{e.name}</p>
                <span
                  className={`hidden rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.bg} ${meta.text} sm:inline`}
                >
                  {e.category}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatDate(e.date)}
                {showOriginal ? ` · originally ${formatMoney(e.amount, e.currency)}` : ""}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-sm font-bold text-foreground tabular-nums">
                {formatInBase(e.amount, e.currency)}
              </p>
              {showOriginal && <p className="text-[10px] text-muted-foreground">in {base}</p>}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(e)}
                aria-label={`Edit ${e.name}`}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-transparent text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary-soft hover:text-primary active:scale-90"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(e.id)}
                aria-label={`Delete ${e.name}`}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-transparent text-muted-foreground transition-all hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive active:scale-90"
              >
                <Trash2 className="h-4 w-4 transition-transform group-hover:rotate-6" />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
