
export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        name: "dashboard",
        path: "/home",
        element: <div></div>,
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
];

export default routes;
