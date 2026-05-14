import { useState } from "react";
import { Plus, Loader2, Lock } from "lucide-react";
import { CATEGORIES, type Category } from "@/lib/expense-utils";
import { useCurrency } from "@/lib/currency-context";

interface Props {
  onAdd: (e: { name: string; amount: number; category: Category; currency: string }) => void;
}

export function ExpenseForm({ onAdd }: Props) {
  const { base } = useCurrency();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; amount?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Name is required";
    else if (name.trim().length > 60) e.name = "Keep it under 60 characters";
    const num = Number(amount);
    if (!amount) e.amount = "Amount is required";
    else if (Number.isNaN(num) || num <= 0) e.amount = "Enter a valid amount";
    else if (num > 1_000_000) e.amount = "Amount too large";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 300));
    onAdd({ name: name.trim(), amount: Number(amount), category, currency: base });
    setName("");
    setAmount("");
    setCategory("Food");
    setSubmitting(false);
  };

  const inputBase =
    "peer w-full rounded-xl border bg-background px-3.5 pt-5 pb-2 text-sm text-foreground placeholder-transparent shadow-soft outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 shadow-soft animate-fade-in"
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">Add expense</h2>
          <p className="text-xs text-muted-foreground">
            Log a new transaction in your base currency.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
          <Lock className="h-3 w-3" /> {base}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="relative sm:col-span-2">
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Expense name"
            className={`${inputBase} ${errors.name ? "border-destructive focus:border-destructive focus:ring-destructive/15" : "border-input"}`}
          />
          <label
            htmlFor="name"
            className="pointer-events-none absolute left-3.5 top-2 text-[11px] font-medium text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[11px]"
          >
            Expense name
          </label>
          {errors.name && <p className="mt-1.5 text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="relative">
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className={`${inputBase} ${errors.amount ? "border-destructive focus:border-destructive focus:ring-destructive/15" : "border-input"}`}
          />
          <label
            htmlFor="amount"
            className="pointer-events-none absolute left-3.5 top-2 text-[11px] font-medium text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[11px]"
          >
            Amount in {base}
          </label>
          {errors.amount && <p className="mt-1.5 text-xs text-destructive">{errors.amount}</p>}
        </div>

        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full appearance-none rounded-xl border border-input bg-background px-3.5 pt-5 pb-2 text-sm text-foreground shadow-soft outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <label className="pointer-events-none absolute left-3.5 top-2 text-[11px] font-medium text-muted-foreground">
            Category
          </label>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-dashed border-border bg-muted/40 p-2.5 text-[11px] text-muted-foreground">
        Want to enter expenses in another currency? Change your base currency in{" "}
        <span className="font-semibold text-foreground">Settings</span>.
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground shadow-soft transition-all hover:bg-secondary/90 hover:shadow-lift active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-6"
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        {submitting ? "Adding…" : "Add expense"}
      </button>
    </form>
  );
}
