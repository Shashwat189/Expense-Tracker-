import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { CATEGORIES, type Category, type Expense } from "@/lib/expense-utils";
import { useCurrency } from "@/lib/currency-context";

interface Props {
  expense: Expense | null;
  onClose: () => void;
  onSave: (
    id: string,
    patch: Partial<Pick<Expense, "name" | "amount" | "category" | "currency">>,
  ) => void;
}

export function EditExpenseDialog({ expense, onClose, onSave }: Props) {
  const { base } = useCurrency();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!expense) return;
    setName(expense.name);
    setAmount(String(expense.amount));
    setCategory(expense.category);
  }, [expense]);

  if (!expense) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(amount);
    if (!name.trim() || Number.isNaN(num) || num <= 0) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 250));
    onSave(expense.id, { name: name.trim(), amount: num, category });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md animate-scale-in rounded-2xl border border-border bg-card p-6 shadow-lift">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">Edit expense</h2>
            <p className="text-xs text-muted-foreground">Update details for this transaction.</p>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-3.5">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-foreground">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm shadow-soft outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-foreground">
                Amount ({expense.currency})
              </span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm shadow-soft outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-foreground">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full appearance-none rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm shadow-soft outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="rounded-lg border border-dashed border-border bg-muted/40 p-2.5 text-[11px] text-muted-foreground">
            Original currency:{" "}
            <span className="font-semibold text-foreground">{expense.currency}</span>. Display
            values are auto-converted to your base currency ({base}).
          </p>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground shadow-soft transition hover:bg-secondary/90 disabled:opacity-70"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
