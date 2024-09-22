import { element } from "prop-types";
import Dashboard from "./pages/dashboard/dashboard";
import Profile from "./pages/profile/profile";
import Workers from "./pages/dashboard/workers";
import { SignIn, SignUp } from "./pages/auth";

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        name: "dashboard main",
        path: "/",
        element: <Dashboard />,
      },

      {
        name: "workers",
        path: "/workers",
        element: <Workers />,
      },
    ],
  },
  {
    layout: "auth",
    pages: [
      {
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
  {
    layout: "profile",
    pages: [
      {
        name: "profile",
        path: "/",
        element: <Profile />,
      },
    ],
  },
];

export default routes;
