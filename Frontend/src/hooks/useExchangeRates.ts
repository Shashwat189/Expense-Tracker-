import { useEffect, useState } from "react";

interface RatesState {
  rates: Record<string, number> | null;
  loading: boolean;
  error: string | null;
  updatedAt: string | null;
}

// Free, no-key API. Base USD.
const API = "https://open.er-api.com/v6/latest/USD";

export function useExchangeRates(refreshKey = 0) {
  const [state, setState] = useState<RatesState>({
    rates: null,
    loading: true,
    error: null,
    updatedAt: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    fetch(API)
      .then((r) => {
        if (!r.ok) throw new Error("Network response was not ok");
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (data?.result !== "success" || !data.rates) throw new Error("Bad response");
        setState({
          rates: data.rates,
          loading: false,
          error: null,
          updatedAt: data.time_last_update_utc ?? new Date().toUTCString(),
        });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setState({
          rates: null,
          loading: false,
          error: e instanceof Error ? e.message : "Failed to load rates",
          updatedAt: null,
        });
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return state;
}
