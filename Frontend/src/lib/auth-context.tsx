import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  authApi,
  getStoredUser,
  setStoredUser,
} from "./api-client";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextValue {
  user: AuthUser | null;

  hydrated: boolean;

  login: (
    email: string,
    password: string,
  ) => Promise<void>;

  signup: (
    name: string,
    email: string,
    password: string,
  ) => Promise<void>;

  logout: () => void;

  updateProfile: (
    patch: Partial<
      Pick<
        AuthUser,
        "name" | "email" | "avatar"
      >
    > & {
      password?: string;
    },
  ) => void;
}

const Ctx =
  createContext<AuthContextValue | null>(
    null,
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<AuthUser | null>(
      null,
    );

  const [hydrated, setHydrated] =
    useState(false);

  useEffect(() => {
    try {
      const stored =
        getStoredUser();

      if (stored) {
        setUser(
          stored as AuthUser,
        );
      }
    } catch {
      // ignore
    }

    setHydrated(true);
  }, []);

  const persist = (
    u: AuthUser | null,
  ) => {
    setUser(u);

    if (u) {
      setStoredUser(u);
    } else {
      authApi.logout();
    }
  };

  const login:
    AuthContextValue["login"] =
    async (
      email,
      password,
    ) => {
      const response =
        await authApi.login(
          email,
          password,
        );

      const authUser =
        response as AuthUser;

      persist(authUser);
    };

  const signup:
    AuthContextValue["signup"] =
    async (
      name,
      email,
      password,
    ) => {
      const response =
        await authApi.signup(
          name,
          email,
          password,
        );

      const authUser =
        response as AuthUser;

      persist(authUser);
    };

  const logout = () => {
    persist(null);
  };

  const updateProfile:
    AuthContextValue["updateProfile"] =
    async (patch) => {
      if (!user) {
        return;
      }

      const updated: AuthUser = {
        ...user,

        name:
          patch.name?.trim() ||
          user.name,

        email:
          patch.email
            ?.trim()
            .toLowerCase() ||
          user.email,

        avatar:
          patch.avatar !==
          undefined
            ? patch.avatar
            : user.avatar,
      };

      persist(updated);
    };

  return (
    <Ctx.Provider
      value={{
        user,
        hydrated,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider",
    );
  }

  return ctx;
}