import { lazy } from "react";

//   path: string // Path of the route
//   component: LazyExoticComponent<() => JSX.Element> // Component to render -> lazy import with async await

const ROUTES = [
  {
    path: "/",
    component: lazy(async () => await import("../pages/Home/index")),
  },
  {
    path: "/dashboard",
    component: lazy(async () => await import("../pages/Home/index")),
  },
  // doctor start
  {
    path: "/doctor",
    component: lazy(async () => await import("../pages/Doctor/index")),
  },
  {
    path: "/add-doctor",
    component: lazy(async () => await import("../pages/Doctor/CreateDoctor")),
  },
  {
    path: "/update-doctor/:doctorId",
    component: lazy(async () => await import("../pages/Doctor/UpdateDoctor")),
    // doctor end
  },
  {
    path: "/orders",
    component: lazy(async () => await import("../pages/Orders/index")),
  },
  {
    path: "/users",
    component: lazy(async () => await import("../pages/User/index")),
  },
  {
    path: "/connected-users",
    component: lazy(async () => await import("../pages/ConnectedUser/index")),
  },
  {
    path: "/coupons",
    component: lazy(async () => await import("../pages/Coupons/index")),
  },
  {
    path: "/login",
    component: lazy(async () => await import("../pages/Login/index")),
  },
  {
    path: "/reviews",
    component: lazy(async () => await import("../pages/Reviews/index")),
  },
  {
    path: "/blog",
    component: lazy(async () => await import("../pages/Blog/index")),
  },

  {
    path: "*",
    component: lazy(async () => await import("../pages/Error/404")),
  },
];
export default ROUTES;
