import { useEffect, useState } from "react";
import type { Category, Expense } from "@/lib/expense-utils";
import { expenseApi } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch expenses on mount and when user changes
  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setHydrated(true);
      return;
    }

    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const data = await expenseApi.getExpenses();
        const mapped: Expense[] = data.map((e: Record<string, unknown>) => ({
          id: e._id,
          name: e.title,
          amount: e.amount,
          category: e.category as Category,
          currency: e.currency || "USD",
          date: e.createdAt,
        }));
        setExpenses(mapped);
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
      } finally {
        setLoading(false);
        setHydrated(true);
      }
    };

    fetchExpenses();
  }, [user]);

  const addExpense = async (e: {
    name: string;
    amount: number;
    category: Category;
    currency: string;
  }) => {
    try {
      const result = await expenseApi.addExpense(e.name, e.amount, e.category, e.currency);
      const expense: Expense = {
        id: result._id,
        name: result.title,
        amount: result.amount,
        category: result.category as Category,
        currency: e.currency,
        date: result.createdAt,
      };
      setExpenses((prev) => [expense, ...prev]);
    } catch (error) {
      console.error("Failed to add expense:", error);
      throw error;
    }
  };

  const updateExpense = (
    id: string,
    patch: Partial<Pick<Expense, "name" | "amount" | "category" | "currency">>,
  ) => {
    setExpenses((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

  const removeExpense = async (id: string) => {
    try {
      await expenseApi.deleteExpense(id);
      setExpenses((prev) => prev.filter((x) => x.id !== id));
    } catch (error) {
      console.error("Failed to delete expense:", error);
      throw error;
    }
  };

  return { expenses, addExpense, updateExpense, removeExpense, hydrated, loading };
}
