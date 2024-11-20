import routes from "@/routes";
import {
  Tabs,
  TabsHeader,
  Tab,
} from "@material-tailwind/react";

import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";

import { Route, Routes } from "react-router-dom";
import { NavigationTopBar, ProfileTopBar } from "@/widgets/layout";

export function ProfileLayout() {
  return (
    <div className="w-full h-full">
      <NavigationTopBar />

      <Routes>
        {routes.map(
          ({ layout, pages }) =>
            layout === "profile" &&
            pages.map(({ element, path }) => (
              <Route path={path} element={element} />
            ))
        )}
      </Routes>
    </div>
  );
}

export default ProfileLayout;
