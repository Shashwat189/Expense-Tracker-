const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

const TOKEN_KEY = "auth:token";
const USER_KEY = "auth:user";

interface ApiErrorType extends Error {
  status: number;
}

function createApiError(
  status: number,
  message: string,
): ApiErrorType {
  const error = new Error(
    message,
  ) as ApiErrorType;

  error.status = status;

  return error;
}

function getToken(): string | null {
  try {
    return localStorage.getItem(
      TOKEN_KEY,
    );
  } catch {
    return null;
  }
}

function setToken(
  token: string,
): void {
  try {
    localStorage.setItem(
      TOKEN_KEY,
      token,
    );
  } catch (error) {
    console.error(
      "Failed to save token",
      error,
    );
  }
}

function clearToken(): void {
  try {
    localStorage.removeItem(
      TOKEN_KEY,
    );

    localStorage.removeItem(
      USER_KEY,
    );
  } catch (error) {
    console.error(
      "Failed to clear token",
      error,
    );
  }
}

async function apiCall(
  method: string,
  endpoint: string,
  body?: unknown,
): Promise<unknown> {
  const url =
    `${API_BASE_URL}${endpoint}`;

  const headers: Record<
    string,
    string
  > = {
    "Content-Type":
      "application/json",
  };

  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(
      url,
      {
        method,
        headers,
        body: body
          ? JSON.stringify(body)
          : undefined,
      },
    );

    let data = null;

    try {
      data =
        await response.json();
    } catch {
      // ignore
    }

    if (!response.ok) {
      throw createApiError(
        response.status,
        data?.message ||
          `HTTP ${response.status}`,
      );
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes(
          "Failed to fetch",
        )
      ) {
        throw createApiError(
          0,
          `Cannot connect to backend at ${API_BASE_URL}`,
        );
      }

      throw error;
    }

    throw createApiError(
      500,
      "Unknown error",
    );
  }
}

export const authApi = {
  async signup(
    name: string,
    email: string,
    password: string,
  ): Promise<unknown> {
    const response =
      await apiCall(
        "POST",
        "/api/auth/signup",
        {
          name,
          email,
          password,
        },
      );

    const authResponse =
      response as {
        token: string;
        user: unknown;
      };

    setToken(
      authResponse.token,
    );

    setStoredUser(
      authResponse.user,
    );

    return authResponse.user;
  },

  async login(
    email: string,
    password: string,
  ): Promise<unknown> {
    const response =
      await apiCall(
        "POST",
        "/api/auth/login",
        {
          email,
          password,
        },
      );

    const authResponse =
      response as {
        token: string;
        user: unknown;
      };

    setToken(
      authResponse.token,
    );

    setStoredUser(
      authResponse.user,
    );

    return authResponse.user;
  },

  logout(): void {
    clearToken();
  },
};

export const expenseApi = {
  async getExpenses(): Promise<unknown> {
    return apiCall(
      "GET",
      "/api/expenses",
    );
  },

  async addExpense(
    title: string,
    amount: number,
    category: string,
    currency: string,
  ): Promise<unknown> {
    return apiCall(
      "POST",
      "/api/expenses",
      {
        title,
        amount,
        category,
        currency,
      },
    );
  },

  async deleteExpense(
    id: string,
  ): Promise<unknown> {
    return apiCall(
      "DELETE",
      `/api/expenses/${id}`,
    );
  },
};

export function getStoredUser(): unknown {
  try {
    const data =
      localStorage.getItem(
        USER_KEY,
      );

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function setStoredUser(
  user: unknown,
): void {
  try {
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(user),
    );
  } catch (error) {
    console.error(
      "Failed to store user",
      error,
    );
  }
}

export function getStoredToken():
  | string
  | null {
  return getToken();
}