import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useExchangeRates } from "@/hooks/useExchangeRates";
import { convert, formatMoney } from "@/lib/expense-utils";
import { useAuth } from "@/lib/auth-context";

interface CurrencyContextValue {
  base: string;
  setBase: (c: string) => void;
  rates: Record<string, number> | null;
  loading: boolean;
  error: string | null;
  updatedAt: string | null;
  refresh: () => void;

  /** convert raw amount in `from` currency to current base currency */
  toBase: (amount: number, from: string) => number | null;

  /** format amount currently expressed in `from`, displayed in current base */
  formatInBase: (amount: number, from: string) => string;

  /** generic convert between two currencies */
  convertBetween: (
    amount: number,
    from: string,
    to: string,
  ) => number | null;
}

const Ctx = createContext<CurrencyContextValue | null>(null);

export const CurrencyContext = Ctx;

function baseKey(userId: string | undefined) {
  return `et:base-currency:${userId ?? "guest"}`;
}

export function CurrencyProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuth();

  const [base, setBaseState] = useState<string>("USD");
  const [refreshKey, setRefreshKey] = useState(0);

  const { rates, loading, error, updatedAt } =
    useExchangeRates(refreshKey);

  // Load per-user base currency on user change
  useEffect(() => {
    try {
      const stored = localStorage.getItem(baseKey(user?.id));
      setBaseState(stored || "USD");
    } catch {
      setBaseState("USD");
    }
  }, [user?.id]);

  const setBase = useCallback(
    (c: string) => {
      setBaseState(c);

      try {
        localStorage.setItem(baseKey(user?.id), c);
      } catch {
        // ignore storage errors
      }
    },
    [user?.id],
  );

  const toBase = useCallback(
    (amount: number, from: string) =>
      convert(amount, from, base, rates),
    [base, rates],
  );

  const convertBetween = useCallback(
    (amount: number, from: string, to: string) =>
      convert(amount, from, to, rates),
    [rates],
  );

  const formatInBase = useCallback(
    (amount: number, from: string) => {
      const v = convert(amount, from, base, rates);

      return v === null ? "—" : formatMoney(v, base);
    },
    [base, rates],
  );

  const value = useMemo<CurrencyContextValue>(
    () => ({
      base,
      setBase,
      rates,
      loading,
      error,
      updatedAt,
      refresh: () => setRefreshKey((x) => x + 1),
      toBase,
      formatInBase,
      convertBetween,
    }),
    [
      base,
      setBase,
      rates,
      loading,
      error,
      updatedAt,
      toBase,
      formatInBase,
      convertBetween,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/**
 * Custom hook for accessing currency context
 */
export function useCurrency() {
  const context = useContext(Ctx);

  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider",);}
  return context;
}
