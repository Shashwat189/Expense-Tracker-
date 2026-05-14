import { useMemo, useState } from "react";
import { Loader2, RefreshCw, AlertCircle, ArrowRightLeft, Sparkles, ArrowDown } from "lucide-react";
import { CURRENCIES, CURRENCY_NAMES, formatMoney } from "@/lib/expense-utils";
import { useCurrency } from "@/hooks/useCurrency";

export function CurrencyConverter() {
  const { base, rates, loading, error, updatedAt, refresh, convertBetween } = useCurrency();
  const [from, setFrom] = useState<string>(base);
  const [to, setTo] = useState<string>(base === "USD" ? "EUR" : "USD");
  const [amount, setAmount] = useState<string>("100");

  const num = Number(amount);
  const valid = !Number.isNaN(num) && num >= 0;

  const converted = useMemo(() => {
    if (!valid) return null;
    return convertBetween(num, from, to);
  }, [num, from, to, convertBetween, valid]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-emerald opacity-15 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
            <ArrowRightLeft className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">Currency converter</h2>
            <p className="text-xs text-muted-foreground">Live rates · all supported currencies</p>
          </div>
        </div>
        <button
          onClick={refresh}
          aria-label="Refresh rates"
          className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground transition hover:text-foreground hover:shadow-soft"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="space-y-3">
        <div className="rounded-xl border border-border bg-background/60 p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              From
            </p>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-md bg-transparent text-xs font-semibold text-foreground outline-none"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c} · {CURRENCY_NAMES[c] ?? c}
                </option>
              ))}
            </select>
          </div>
          <input
            type="number"
            value={amount}
            min="0"
            step="0.01"
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 w-full bg-transparent font-display text-xl font-bold text-foreground tabular-nums outline-none"
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={swap}
            aria-label="Swap"
            className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card text-muted-foreground shadow-soft transition hover:rotate-180 hover:text-primary"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="rounded-xl border border-border bg-background/60 p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              To
            </p>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-md bg-transparent text-xs font-semibold text-foreground outline-none"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c} · {CURRENCY_NAMES[c] ?? c}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-1 font-display text-xl font-bold text-foreground tabular-nums">
            {converted !== null ? formatMoney(converted, to) : "—"}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-primary/20 bg-primary-soft/60 p-3.5">
        {loading ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Fetching live rates…
          </div>
        ) : error ? (
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-destructive">
              <AlertCircle className="h-3.5 w-3.5" /> Couldn't load exchange rates
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">{error}.</p>
            <button
              onClick={refresh}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1 text-[11px] font-semibold text-secondary-foreground transition hover:bg-secondary/90"
            >
              <RefreshCw className="h-3 w-3" /> Retry
            </button>
          </div>
        ) : (
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            Rate:{" "}
            <span className="font-semibold text-foreground tabular-nums">
              1 {from} = {convertBetween(1, from, to)?.toFixed(4) ?? "—"} {to}
            </span>
            {updatedAt && (
              <span className="ml-auto">· {new Date(updatedAt).toLocaleDateString()}</span>
            )}
          </p>
        )}
      </div>

      {rates && (
        <p className="mt-2 text-[10px] text-muted-foreground">
          Your dashboard base currency is{" "}
          <span className="font-semibold text-foreground">{base}</span>. Change it from Settings to
          see all values reflect a different currency.
        </p>
      )}
    </div>
  );
}
