import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi, getStoredUser, setStoredUser, getStoredToken } from "./api-client";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string; // data URL
}

interface AuthContextValue {
  user: AuthUser | null;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (
    patch: Partial<Pick<AuthUser, "name" | "email" | "avatar">> & { password?: string },
  ) => void;
}

const SESSION_KEY = "et:session";

const Ctx = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = getStoredUser();
      if (stored) setUser(stored);
    } catch {
      // Storage error - user will remain null
    }
    setHydrated(true);
  }, []);

  const persist = (u: AuthUser | null) => {
    setUser(u);
    if (u) setStoredUser(u);
    else {
      try {
        localStorage.removeItem(SESSION_KEY);
      } catch {
        // Storage error during logout - continue anyway
      }
      authApi.logout();
    }
  };

  const login: AuthContextValue["login"] = async (email, password) => {
    const response = await authApi.login(email, password);
    const user: AuthUser = {
      id: response._id,
      name: response.name,
      email: response.email,
    };
    persist(user);
  };

  const signup: AuthContextValue["signup"] = async (name, email, password) => {
    const response = await authApi.signup(name, email, password);
    const user: AuthUser = {
      id: response._id,
      name: response.name,
      email: response.email,
    };
    persist(user);
  };

  const logout = () => persist(null);

  const updateProfile: AuthContextValue["updateProfile"] = async (patch) => {
    if (!user) return;
    const updated: AuthUser = {
      ...user,
      name: patch.name?.trim() || user.name,
      email: patch.email?.trim().toLowerCase() || user.email,
      avatar: patch.avatar !== undefined ? patch.avatar : user.avatar,
    };
    persist(updated);
  };

  return (
    <Ctx.Provider value={{ user, hydrated, login, signup, logout, updateProfile }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
