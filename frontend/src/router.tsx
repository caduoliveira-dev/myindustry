import { createRouter, createRoute, createRootRoute, Outlet } from "@tanstack/react-router";
import { App } from "./App";
import { ProductDetailPage } from "./components/product-table/product-detail-page";

const rootRoute = createRootRoute({ component: Outlet });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: App,
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products/$productId",
  component: ProductDetailPage,
});

const routeTree = rootRoute.addChildren([indexRoute, productDetailRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
