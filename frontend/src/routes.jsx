import Profile from "./pages/profile/profile";
import Workers from "./pages/dashboard/workers";
import Areas from "./pages/dashboard/areas";
import Projects from "./pages/dashboard/projects";
import Homepage from "./pages/home/homepage";
import { ProjectDetail, ProjectListing } from "./pages/project";
import { SignIn, SignUp } from "./pages/auth";
import { MilestonesDetail } from "./pages/project";
import { DashboardRenderByrole } from "./pages/dashboard";
import { FAQPage } from "./pages/faq";
export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        name: "dashboard main",
        path: "/",
        element: <DashboardRenderByrole />,
      },

      {
        name: "workers",
        path: "/workers",
        element: <Workers />,
      },
      {
        name: "areas",
        path: "/areas",
        element: <Areas />,
      },
      {
        name: "projects",
        path: "/projects",
        element: <Projects />,
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
        name: "detail",
        path: "/",
        element: <Profile />,
      },
    ],
  },

  {
    layout: "project",
    pages: [
      {
        name: "detail",
        path: "/detail/:id",
        element: <ProjectDetail />,
      },

      {
        name: "listing",
        path: "/",
        element: <ProjectListing />,
      },

      {
        name: "milestones",
        path: "/milestones/:id",
        element: <MilestonesDetail />,
      },
    ],
  },

  {
    layout: "homepage",
    pages: [
      {
        name: "homepage",
        path: "/",
        element: <Homepage />,
      },
    ],
  },
  {
    layout: "faq",
    pages: [
      {
        name: "faq",
        path: "/",
        element: <FAQPage />,
      },
    ],
  },
];

export default routes;
