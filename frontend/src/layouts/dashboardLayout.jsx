import routes from "@/routes";
import { Route, Routes } from "react-router-dom";
import { NavigationTopBar } from "@/widgets/layout";
export function DashboardLayout() {
  return (
    <div className="min-h-screen md:h-screen flex flex-col overflow">
      <NavigationTopBar />

      <Routes>
        {routes.map(
          ({ layout, pages }) =>
            layout === "dashboard" &&
            pages.map(({ element, path }) => (
              <Route path={path} element={element} />
            ))
        )}
      </Routes>
    </div>
  );
}
