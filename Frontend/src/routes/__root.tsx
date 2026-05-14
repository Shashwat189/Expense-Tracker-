import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

import { AuthProvider } from "@/lib/auth-context";
import { CurrencyProvider } from "@/lib/currency-context";

import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">
          404
        </h1>

        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist
          or has been moved.
        </p>

        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({
  error,
}: {
  error: Error;
}) {
  console.error(error);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Something went wrong
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Please refresh the page or try again later.
        </p>

        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route =
  createRootRouteWithContext<{
    queryClient: QueryClient;
  }>()({
    head: () => ({
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1",
        },
        {
          title:
            "Expense Tracker — Modern Personal Finance Dashboard",
        },
        {
          name: "description",
          content:
            "A premium fintech-inspired expense tracker dashboard with live currency conversion and analytics.",
        },
      ],

      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },

        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },

        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },

        {
          rel: "stylesheet",
          href:
            "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap",
        },
      ],
    }),

    component: RootComponent,

    notFoundComponent: NotFoundComponent,

    errorComponent: ErrorComponent,
  });

function RootComponent() {
  const { queryClient } =
    Route.useRouteContext();

  return (
    <>
      <HeadContent />

      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CurrencyProvider>
            <Outlet />

            <Toaster />
          </CurrencyProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default RootComponent;