import { Wallet, Layers, Receipt, Globe2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/expense-tracker/Navbar";
import { StatCard } from "@/components/expense-tracker/StatCard";
import { ExpenseForm } from "@/components/expense-tracker/ExpenseForm";
import { ExpenseList } from "@/components/expense-tracker/ExpenseList";
import { SummaryPanel } from "@/components/expense-tracker/SummaryPanel";
import { CategoryBreakdown } from "@/components/expense-tracker/CategoryBreakdown";
import { CurrencyConverter } from "@/components/expense-tracker/CurrencyConverter";
import { EditExpenseDialog } from "@/components/expense-tracker/EditExpenseDialog";
import { useExpenses } from "@/hooks/useExpenses";
import { CATEGORIES, type Expense } from "@/lib/expense-utils";
import { useCurrency } from "@/hooks/useCurrency";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_authenticated/")({
  component: Dashboard,
});

function Dashboard() {
  const { expenses, addExpense, updateExpense, removeExpense } = useExpenses();
  const { base, toBase, formatInBase } = useCurrency();
  const { user } = useAuth();
  const [editing, setEditing] = useState<Expense | null>(null);

  // Render today's date only on client to avoid SSR hydration mismatch
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => {
    setToday(
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    );
  }, []);

  const total = expenses.reduce((s, e) => s + (toBase(e.amount, e.currency) ?? 0), 0);
  const usedCategories = new Set(expenses.map((e) => e.category)).size;
  const latest = expenses[0];

  const firstName = user?.name.split(/\s+/)[0] ?? "there";

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <section className="animate-fade-in">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                Dashboard
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Welcome back, {firstName}
              </h1>
              <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
                Here's a snapshot of your spending across categories and live currency conversions.
              </p>
            </div>
            <div
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-soft min-h-7"
              suppressHydrationWarning
            >
              {today ?? "\u00A0"}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total expenses"
              value={total}
              numeric
              currency={base}
              icon={Wallet}
              accent="emerald"
              hint={`${expenses.length} transactions`}
            />
            <StatCard
              label="Categories used"
              value={`${usedCategories}/${CATEGORIES.length}`}
              icon={Layers}
              accent="blue"
              hint="across active spend"
            />
            <StatCard
              label="Latest expense"
              value={latest ? latest.name : "—"}
              icon={Receipt}
              accent="amber"
              hint={latest ? formatInBase(latest.amount, latest.currency) : "No data yet"}
            />
            <StatCard
              label="Base currency"
              value={base}
              icon={Globe2}
              accent="slate"
              hint="Change in settings"
            />
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <ExpenseForm onAdd={addExpense} />

            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground">
                    Recent expenses
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {expenses.length} {expenses.length === 1 ? "entry" : "entries"} tracked.
                  </p>
                </div>
              </div>
              <ExpenseList expenses={expenses} onDelete={removeExpense} onEdit={setEditing} />
            </div>

            <CategoryBreakdown expenses={expenses} />
          </div>

          <div className="space-y-6">
            <CurrencyConverter />
            <SummaryPanel expenses={expenses} />
          </div>
        </section>

        <footer className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Expense Tracker. Crafted for clarity.</p>
          <p>Live FX powered by open.er-api.com</p>
        </footer>
      </main>

      <EditExpenseDialog
        expense={editing}
        onClose={() => setEditing(null)}
        onSave={updateExpense}
      />
    </div>
  );
}
