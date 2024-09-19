import { element } from "prop-types";
import Dashboard from "./pages/dashboard/dashboard";
import Profile from "./pages/profile/profile";

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        name: "dashboard",
        path: "/",
        element: <Dashboard />,
      },
      
    ],  
  },
  {
    layout: "auth",
    pages: [
      {
        name: "sign in",
        path: "/sign-in",
        element: <div></div>,
      },
      {
        name: "sign up",
        path: "/sign-up",
        element: <div></div>,
      },
    ],
  },
  {
    layout: "profile",
    pages: [
      {
      name: "profile",
      path: "/",
      element: <Profile/>
      },
    ],


  },
];

export default routes;
