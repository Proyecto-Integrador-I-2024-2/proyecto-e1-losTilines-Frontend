import { element } from "prop-types";
import Dashboard from "./pages/dashboard/dashboard";
import Profile from "./pages/profile/profile";
import Workers from "./pages/dashboard/workers";
import Areas from "./pages/dashboard/areas";
import Projects from "./pages/dashboard/projects";
import Homepage from "./pages/home/homepage";
import { ProjectDetail, MilestonesDetail, ProjectListing } from "@/pages/project"
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
      {
        name: "areas",
        path: "/areas",
        element: <Areas />,
      },
      {
        name: "projects",
        path: "/projects",
        element: <Projects />,
      }
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
        name: "listing",
        path: "/",
        element: <ProjectListing />,
      },
      {
        name: "detail",
        path: "/detail",
        element: <ProjectDetail />,
      },

      {
        name: "listing",
        path: "/",
        element: <ProjectListing />,
      },

      {
        name: "milestones",
        path: "/milestones",
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
  }
];

export default routes;
