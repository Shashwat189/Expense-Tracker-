export type Category = "Food" | "Travel" | "Marketing" | "Utilities" | "Other";

export interface Expense {
  id: string;
  name: string;
  amount: number; // stored in the currency it was entered in
  category: Category;
  currency: string; // ISO currency code at entry time
  date: string; // ISO
}

export const CATEGORIES: Category[] = ["Food", "Travel", "Marketing", "Utilities", "Other"];

// Comprehensive list of supported currencies (matches open.er-api.com response)
export const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "INR",
  "AED",
  "CAD",
  "AUD",
  "JPY",
  "CNY",
  "CHF",
  "SGD",
  "HKD",
  "NZD",
  "SEK",
  "NOK",
  "DKK",
  "MXN",
  "BRL",
  "ZAR",
  "RUB",
  "KRW",
  "TRY",
  "THB",
  "MYR",
  "IDR",
  "PHP",
  "PKR",
  "BDT",
  "SAR",
  "EGP",
  "NGN",
  "VND",
  "PLN",
  "CZK",
  "HUF",
  "ILS",
  "TWD",
  "ARS",
  "CLP",
  "COP",
] as const;
export type CurrencyCode = (typeof CURRENCIES)[number];

export const CURRENCY_NAMES: Record<string, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  INR: "Indian Rupee",
  AED: "UAE Dirham",
  CAD: "Canadian Dollar",
  AUD: "Australian Dollar",
  JPY: "Japanese Yen",
  CNY: "Chinese Yuan",
  CHF: "Swiss Franc",
  SGD: "Singapore Dollar",
  HKD: "Hong Kong Dollar",
  NZD: "NZ Dollar",
  SEK: "Swedish Krona",
  NOK: "Norwegian Krone",
  DKK: "Danish Krone",
  MXN: "Mexican Peso",
  BRL: "Brazilian Real",
  ZAR: "S. African Rand",
  RUB: "Russian Ruble",
  KRW: "S. Korean Won",
  TRY: "Turkish Lira",
  THB: "Thai Baht",
  MYR: "Malaysian Ringgit",
  IDR: "Indonesian Rupiah",
  PHP: "Philippine Peso",
  PKR: "Pakistani Rupee",
  BDT: "Bangladeshi Taka",
  SAR: "Saudi Riyal",
  EGP: "Egyptian Pound",
  NGN: "Nigerian Naira",
  VND: "Vietnamese Dong",
  PLN: "Polish Zloty",
  CZK: "Czech Koruna",
  HUF: "Hungarian Forint",
  ILS: "Israeli Shekel",
  TWD: "Taiwan Dollar",
  ARS: "Argentine Peso",
  CLP: "Chilean Peso",
  COP: "Colombian Peso",
};

export const CATEGORY_META: Record<Category, { color: string; bg: string; text: string }> = {
  Food: {
    color: "var(--color-cat-food)",
    bg: "bg-orange-50 dark:bg-orange-500/10",
    text: "text-orange-700 dark:text-orange-300",
  },
  Travel: {
    color: "var(--color-cat-travel)",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    text: "text-blue-700 dark:text-blue-300",
  },
  Marketing: {
    color: "var(--color-cat-marketing)",
    bg: "bg-fuchsia-50 dark:bg-fuchsia-500/10",
    text: "text-fuchsia-700 dark:text-fuchsia-300",
  },
  Utilities: {
    color: "var(--color-cat-utilities)",
    bg: "bg-teal-50 dark:bg-teal-500/10",
    text: "text-teal-700 dark:text-teal-300",
  },
  Other: {
    color: "var(--color-cat-other)",
    bg: "bg-slate-100 dark:bg-slate-500/10",
    text: "text-slate-700 dark:text-slate-300",
  },
};

export function formatMoney(amount: number, currency: string = "USD") {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Convert an amount from one currency to another using USD-base rates from open.er-api.com */
export function convert(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number> | null,
): number | null {
  if (!rates) return null;
  if (from === to) return amount;
  const fromRate = from === "USD" ? 1 : rates[from];
  const toRate = to === "USD" ? 1 : rates[to];
  if (!fromRate || !toRate) return null;
  // amount in USD = amount / fromRate, then * toRate
  return (amount / fromRate) * toRate;
}
