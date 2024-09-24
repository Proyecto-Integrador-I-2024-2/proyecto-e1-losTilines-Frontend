import routes from "@/routes";
import { Route, Routes } from "react-router-dom";
import { NavigationTopBar } from "@/widgets/layout";

export function HomepageLayout() {
  return (
    <div className="w-full h-full">
      <NavigationTopBar />

      <Routes>
        {routes.map(
          ({ layout, pages }) =>
            layout === "homepage" &&
            pages.map(({ element, path }) => (
              <Route path={path} element={element} />
            ))
        )}
      </Routes>
    </div>
  );
}
export default HomepageLayout;
